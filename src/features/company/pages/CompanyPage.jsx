import React, { useState, useMemo } from "react";
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
  CompanyFilterDrawer,
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

  // Advanced slide-over filter drawer state
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [drawerFilters, setDrawerFilters] = useState({
    status: "",
    currency: "",
    region: "",
    gstinOnly: false,
  });

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

  const rawCompanies = companiesResponse?.data || [];

  // Real-time client-side filter application for all drawer & search filters
  const filteredCompanies = useMemo(() => {
    let list = Array.isArray(rawCompanies) ? [...rawCompanies] : [];

    // Search filter (name, code, email, phone, GSTIN, city, state)
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => {
        const name = (c.companyName || c.company_name || "").toLowerCase();
        const code = (c.companyCode || c.company_code || "").toLowerCase();
        const email = (c.email || "").toLowerCase();
        const phone = (c.phone || "").toLowerCase();
        const gstin = (c.gstin || c.taxNumber || c.tax_number || "").toLowerCase();
        const city = (c.city || "").toLowerCase();
        const state = (c.state || "").toLowerCase();
        return (
          name.includes(q) ||
          code.includes(q) ||
          email.includes(q) ||
          phone.includes(q) ||
          gstin.includes(q) ||
          city.includes(q) ||
          state.includes(q)
        );
      });
    }

    // Status filter
    const activeStatus = drawerFilters.status || statusFilter;
    if (activeStatus) {
      list = list.filter(
        (c) => (c.status || "").toLowerCase() === activeStatus.toLowerCase()
      );
    }

    // Currency filter
    if (drawerFilters.currency) {
      list = list.filter((c) => {
        const curr = (c.defaultCurrency || c.currency || "").toUpperCase();
        return curr === drawerFilters.currency.toUpperCase();
      });
    }

    // Region / State filter
    if (drawerFilters.region) {
      const reg = drawerFilters.region.toLowerCase();
      list = list.filter((c) => {
        const state = (c.state || "").toLowerCase();
        const city = (c.city || "").toLowerCase();
        const address = (c.address || "").toLowerCase();
        return state.includes(reg) || city.includes(reg) || address.includes(reg);
      });
    }

    // GSTIN only filter
    if (drawerFilters.gstinOnly) {
      list = list.filter((c) => Boolean(c.gstin || c.taxNumber || c.tax_number));
    }

    return list;
  }, [rawCompanies, search, statusFilter, drawerFilters]);

  // Active filter count calculation
  const activeFilterCount = useMemo(() => {
    return [
      Boolean(drawerFilters.status || statusFilter),
      Boolean(drawerFilters.currency),
      Boolean(drawerFilters.region),
      Boolean(drawerFilters.gstinOnly),
    ].filter(Boolean).length;
  }, [drawerFilters, statusFilter]);

  const paginationMeta = companiesResponse?.meta || {
    total: filteredCompanies.length,
    page,
    limit,
    totalPages: Math.ceil(filteredCompanies.length / limit) || 1,
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
        companies={rawCompanies}
        total={rawCompanies.length}
      />

      {/* Main Companies Table */}
      <CompanyTable
        companies={filteredCompanies}
        meta={paginationMeta}
        isLoading={isLoading}
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        statusFilter={drawerFilters.status || statusFilter}
        onStatusFilterChange={(val) => {
          setStatusFilter(val);
          setDrawerFilters((prev) => ({ ...prev, status: val }));
          setPage(1);
        }}
        onOpenFilterDrawer={() => setIsFilterDrawerOpen(true)}
        activeFilterCount={activeFilterCount}
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

      {/* Slide-Over Floating Filter Drawer Modal */}
      <CompanyFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={{
          ...drawerFilters,
          status: drawerFilters.status || statusFilter,
        }}
        onApplyFilters={(newFilters) => {
          setDrawerFilters(newFilters);
          if (newFilters.status !== undefined) {
            setStatusFilter(newFilters.status);
          }
          setPage(1);
        }}
        onReset={() => {
          setDrawerFilters({
            status: "",
            currency: "",
            region: "",
            gstinOnly: false,
          });
          setStatusFilter("");
          setPage(1);
        }}
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
