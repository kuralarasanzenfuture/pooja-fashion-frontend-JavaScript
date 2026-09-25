import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Plus,
  RefreshCw,
  Sparkles,
  Download,
  Filter,
  CheckCircle,
  AlertCircle,
  Layers,
} from "lucide-react";
import PageHeader from "../../../common/components/PageHeader.jsx";
import { Button } from "../../../common/components/ui/buttons/index.js";
import {
  CompanyStats,
  CompanyTable,
  CompanyModal,
  CompanyDetailModal,
  CompanyStatusModal,
  CompanyDeleteModal,
} from "../components/index.js";
import {
  useCompanies,
  useCreateCompany,
  useUpdateCompany,
  useUpdateCompanyStatus,
  useDeleteCompany,
} from "../hooks/useCompanies.js";

/**
 * Company Management Feature Page
 * Implements backend company.routes.js (/api/companies) endpoints
 * Powered by the unified luxury Global Button design system.
 */
export default function CompanyPage() {
  const navigate = useNavigate();

  // Query parameters state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  // Notification toast state
  const [notification, setNotification] = useState(null);

  // Modals state
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Query Hook
  const {
    data: companiesResponse,
    isLoading,
    isFetching,
    refetch,
  } = useCompanies({
    page,
    limit,
    search: search.trim() || undefined,
    status: statusFilter || undefined,
    sortBy,
    sortOrder,
  });

  // Mutation Hooks
  const createMutation = useCreateCompany();
  const updateMutation = useUpdateCompany();
  const statusMutation = useUpdateCompanyStatus();
  const deleteMutation = useDeleteCompany();

  const companiesList = companiesResponse?.data || [];
  const paginationMeta = companiesResponse?.meta || {
    total: companiesList.length,
    page,
    limit,
    totalPages: Math.ceil(companiesList.length / limit) || 1,
  };

  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Handlers
  const handleOpenCreate = () => {
    setSelectedCompany(null);
    setModalMode("create");
  };

  const handleOpenEdit = (company) => {
    setSelectedCompany(company);
    setModalMode("edit");
  };

  const handleOpenDetail = (company) => {
    navigate(`/company/${company.id}`);
  };

  const handleOpenStatus = (company) => {
    setSelectedCompany(company);
    setIsStatusModalOpen(true);
  };

  const handleOpenDelete = (company) => {
    setSelectedCompany(company);
    setIsDeleteModalOpen(true);
  };

  // Submit Create or Edit
  const handleFormSubmit = async (formData) => {
    try {
      if (modalMode === "create") {
        await createMutation.mutateAsync(formData);
        showToast(`Company "${formData.company_name}" created successfully!`, "success");
      } else if (modalMode === "edit" && selectedCompany) {
        await updateMutation.mutateAsync({
          id: selectedCompany.id,
          data: formData,
        });
        showToast(`Company "${formData.company_name}" updated successfully!`, "success");
      }
      setModalMode(null);
      setSelectedCompany(null);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "An error occurred while saving company details.";
      showToast(msg, "error");
    }
  };

  // Submit Status Change
  const handleStatusSubmit = async ({ id, status }) => {
    try {
      await statusMutation.mutateAsync({ id, status });
      showToast(`Company status updated to "${status.toUpperCase()}"!`, "success");
      setIsStatusModalOpen(false);
      setSelectedCompany(null);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to update company status.";
      showToast(msg, "error");
    }
  };

  // Submit Deletion
  const handleDeleteSubmit = async (id) => {
    try {
      await deleteMutation.mutateAsync(id);
      showToast("Company removed successfully.", "success");
      setIsDeleteModalOpen(false);
      setSelectedCompany(null);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete company.";
      showToast(msg, "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold animate-in slide-in-from-bottom duration-200 ${notification.type === "error"
              ? "bg-rose-50 text-rose-800 border-rose-200"
              : "bg-emerald-50 text-emerald-800 border-emerald-200"
            }`}
        >
          {notification.type === "error" ? (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          ) : (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Company & Enterprise Management"
          description="Manage corporate entities, statutory GST numbers, base currencies, and regional POS store identities."
        />

        {/* Global Button Header Actions */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <Button
            variant="secondary"
            size="md"
            icon={RefreshCw}
            loading={isFetching}
            onClick={() => refetch()}
            title="Refresh Companies"
          >
            Refresh
          </Button>

          <Button
            variant="clip-six"
            size="md"
            icon={Plus}
            onClick={handleOpenCreate}
          >
            Register Company
          </Button>
        </div>
      </div>

      {/* Overview Statistics Cards */}
      <CompanyStats
        companies={companiesList}
        total={paginationMeta.total}
      />

      {/* Global Buttons Showcase Banner (demonstrates variants & interactive designs) */}
      <div className="relative p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#070d1e] via-[#0f1c3f] to-[#1e3a8a] text-white shadow-xl border border-amber-400/25 overflow-hidden">
        {/* Luxury Golden Top Hairline Accent */}
        <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-amber-300 via-[#d4af37] to-amber-200" />

        {/* Ambient subtle glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-bold text-[11px] uppercase tracking-wider font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Global Button Architecture</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white mt-2 tracking-tight font-display">
              Enterprise Boutique Design System • Pooja Fashion POS
            </h3>
            <p className="text-xs text-sky-200/80 mt-1 leading-relaxed">
              Unified across corporate entities, multi-branch POS, and ledger tables. Powered by luxury gold, midnight sapphire, and creative micro-animated variants.
            </p>
          </div>

          {/* Interactive Button Palette */}
          <div className="flex flex-wrap items-center gap-2.5 p-2 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shrink-0">
            <Button
              variant="gold"
              size="sm"
              icon={Building2}
              onClick={handleOpenCreate}
            >
              New Branch
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => showToast("Global Secondary Button clicked")}
            >
              Export CSV
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => showToast("Outline Button active")}
              className="!text-white !border-white/40 hover:!bg-white/15"
            >
              Audit Trail
            </Button>

            <Button
              variant="gradient-two"
              size="sm"
              onClick={() => showToast("Creative Amethyst Gradient Button clicked")}
            >
              Amethyst
            </Button>
          </div>
        </div>
      </div>

      {/* Main Companies Table */}
      <CompanyTable
        companies={companiesList}
        meta={paginationMeta}
        isLoading={isLoading}
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={(sb, so) => {
          setSortBy(sb);
          setSortOrder(so);
          setPage(1);
        }}
        page={page}
        onPageChange={setPage}
        pageSize={limit}
        onPageSizeChange={(newSize) => {
          setLimit(newSize);
          setPage(1);
        }}
        onViewCompany={handleOpenDetail}
        onEditCompany={handleOpenEdit}
        onChangeStatus={handleOpenStatus}
        onDeleteCompany={handleOpenDelete}
        onAddNew={handleOpenCreate}
      />

      {/* Create / Edit Modal */}
      <CompanyModal
        isOpen={modalMode !== null}
        onClose={() => {
          setModalMode(null);
          setSelectedCompany(null);
        }}
        company={selectedCompany}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Detail View Modal */}
      <CompanyDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedCompany(null);
        }}
        company={selectedCompany}
        onEdit={handleOpenEdit}
        onChangeStatus={handleOpenStatus}
      />

      {/* Status Update Modal */}
      <CompanyStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false);
          setSelectedCompany(null);
        }}
        company={selectedCompany}
        onSubmit={handleStatusSubmit}
        isSubmitting={statusMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <CompanyDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCompany(null);
        }}
        company={selectedCompany}
        onConfirm={handleDeleteSubmit}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
