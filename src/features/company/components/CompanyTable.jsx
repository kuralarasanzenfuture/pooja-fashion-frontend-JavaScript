import {
  Search,
  Mail,
  Phone,
  Eye,
  Edit2,
  Trash2,
  RefreshCw,
  Building2,
  ChevronDown,
  Plus,
} from "lucide-react";
import { Button } from "../../../common/components/ui/buttons/index.js";
import Pagination from "../../../common/components/Pagination.jsx";

/**
 * Company Table — directory of companies with search, filters, sort, and row actions.
 */
export default function CompanyTable({
  companies = [],
  meta = {},
  isLoading = false,
  search = "",
  onSearchChange,
  statusFilter = "",
  onStatusFilterChange,
  sortBy = "created_at",
  sortOrder = "desc",
  onSortChange,
  page = 1,
  onPageChange,
  pageSize = 10,
  onPageSizeChange,
  onViewCompany,
  onEditCompany,
  onChangeStatus,
  onDeleteCompany,
  onAddNew,
}) {
  const statusStyles = {
    active: { label: "Active", text: "text-success", dot: "bg-success" },
    inactive: { label: "Inactive", text: "text-warning", dot: "bg-warning" },
    suspended: { label: "Suspended", text: "text-error", dot: "bg-error" },
  };

  const statusOptions = [
    { value: "", label: "All" },
    { value: "active", label: "Active", dot: "bg-success" },
    { value: "inactive", label: "Inactive", dot: "bg-warning" },
    { value: "suspended", label: "Suspended", dot: "bg-error" },
  ];

  return (
    <div className="bg-base-100 rounded-xl border border-base-300 overflow-hidden text-base-content">
      {/* Toolbar */}
      <div className="px-5 py-4 border-b border-base-300 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input
            type="text"
            placeholder="Search companies, code, email, GSTIN..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-base-300 bg-base-200/50 text-base-content placeholder-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-base-100 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status filter tabs - theme color active tab and color indicators */}
          <div className="flex items-center border border-base-300 rounded-lg p-0.5 bg-base-200/60 shadow-xs">
            {statusOptions.map((opt) => {
              const isActive = statusFilter === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onStatusFilterChange(opt.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-content shadow-sm shadow-primary/30"
                      : "text-base-content/70 hover:text-base-content hover:bg-base-100/60"
                  }`}
                >
                  {opt.dot && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${opt.dot} ${
                        isActive ? "ring-1 ring-primary-content/50" : ""
                      }`}
                    />
                  )}
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative">
            <select
              value={`${sortBy}:${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split(":");
                onSortChange(sb, so);
              }}
              className="appearance-none text-xs font-medium pl-3 pr-7 py-2 rounded-lg border border-base-300 bg-base-100 text-base-content focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="created_at:desc" className="bg-base-100 text-base-content">Newest first</option>
              <option value="created_at:asc" className="bg-base-100 text-base-content">Oldest first</option>
              <option value="company_name:asc" className="bg-base-100 text-base-content">Name A–Z</option>
              <option value="company_name:desc" className="bg-base-100 text-base-content">Name Z–A</option>
              <option value="company_code:asc" className="bg-base-100 text-base-content">Code A–Z</option>
              <option value="status:asc" className="bg-base-100 text-base-content">Status</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-base-300 bg-base-200/40 text-[11px] font-semibold uppercase tracking-wide text-base-content/60">
              <th className="py-2.5 px-5 font-semibold">Company</th>
              <th className="py-2.5 px-4 font-semibold">Sector</th>
              <th className="py-2.5 px-4 font-semibold">Contact</th>
              <th className="py-2.5 px-4 font-semibold">Region</th>
              <th className="py-2.5 px-4 font-semibold">Status</th>
              <th className="py-2.5 px-5 font-semibold text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-base-200 text-sm">
            {isLoading ? (
              <SkeletonRows rows={6} />
            ) : companies.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-16">
                  <div className="max-w-sm mx-auto flex flex-col items-center text-center gap-2">
                    <div className="w-11 h-11 rounded-lg bg-base-200 flex items-center justify-center text-base-content/50">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <h4 className="font-semibold text-base-content text-sm">
                      No companies found
                    </h4>
                    <p className="text-xs text-base-content/60 leading-relaxed">
                      {search || statusFilter
                        ? "Try adjusting your search or filters."
                        : "Add your first company to get started."}
                    </p>
                    {onAddNew && (
                      <Button
                        variant="clip-six"
                        size="md"
                        icon={Plus}
                        onClick={onAddNew}
                        className="mt-3"
                      >
                        Add company
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              companies.map((company) => {
                const badge = statusStyles[company.status] || statusStyles.active;
                const initials = (company.companyName || "—")
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                return (
                  <tr key={company.id} className="hover:bg-base-200/50 transition-colors group">
                    {/* Company */}
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => onViewCompany?.(company)}
                          className="w-9 h-9 rounded-lg bg-base-200 text-base-content flex items-center justify-center font-semibold text-xs shrink-0 overflow-hidden border border-base-300 relative group"
                        >
                          <img
                            src={company.logoUrl || "/images/pooja-fashion-logo.jpg"}
                            alt={company.companyName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              if (e.currentTarget.nextElementSibling) {
                                e.currentTarget.nextElementSibling.style.display = 'flex';
                              }
                            }}
                          />
                          <span className="hidden w-full h-full items-center justify-center bg-primary text-primary-content font-bold text-xs">
                            {initials}
                          </span>
                        </button>
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => onViewCompany?.(company)}
                            className="font-medium text-base-content hover:text-primary transition-colors truncate max-w-[180px] text-left block"
                          >
                            {company.companyName}
                          </button>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[11px] font-mono text-base-content/50">
                              {company.companyCode}
                            </span>
                            {company.displayName && (
                              <span className="text-[11px] text-base-content/50 truncate hidden sm:inline">
                                · {company.displayName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Sector */}
                    <td className="py-3 px-4">
                      <div className="text-base-content text-[13px]">
                        {company.businessType || "Retail / Fashion"}
                      </div>
                      <div className="text-xs text-base-content/50 truncate">
                        {company.industryType || "Apparel & Sarees"}
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-4">
                      {company.email ? (
                        <a
                          href={`mailto:${company.email}`}
                          className="flex items-center gap-1.5 text-[13px] text-base-content/70 hover:text-primary truncate max-w-[180px]"
                        >
                          <Mail className="w-3.5 h-3.5 text-base-content/40 shrink-0" />
                          {company.email}
                        </a>
                      ) : (
                        <span className="text-xs text-base-content/30">—</span>
                      )}
                      {company.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-base-content/50 mt-0.5">
                          <Phone className="w-3 h-3 shrink-0" />
                          {company.phone}
                        </div>
                      )}
                    </td>

                    {/* Region */}
                    <td className="py-3 px-4">
                      <div className="text-[13px] text-base-content">
                        {company.defaultCurrency || "INR"}{" "}
                        <span className="text-base-content/50">· {company.countryCode || "IN"}</span>
                      </div>
                      <div className="text-xs text-base-content/50">
                        {company.timezone || "Asia/Kolkata"}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => onChangeStatus(company)}
                        className={`inline-flex items-center gap-1.5 text-xs font-medium ${badge.text} hover:opacity-70 transition-opacity`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        {badge.label}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-5">
                      <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="xs"
                          title="View"
                          aria-label="View"
                          onClick={() => onViewCompany(company)}
                          icon={Eye}
                        />
                        <Button
                          variant="ghost"
                          size="xs"
                          title="Edit"
                          aria-label="Edit"
                          onClick={() => onEditCompany(company)}
                          icon={Edit2}
                        />
                        <Button
                          variant="ghost"
                          size="xs"
                          title="Change status"
                          aria-label="Change status"
                          onClick={() => onChangeStatus(company)}
                          icon={RefreshCw}
                        />
                        <Button
                          variant="ghost"
                          size="xs"
                          title="Delete"
                          aria-label="Delete"
                          onClick={() => onDeleteCompany(company)}
                          icon={Trash2}
                          className="hover:text-rose-600"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={page}
        totalItems={meta.total ?? companies.length}
        pageSize={pageSize || meta.limit || 10}
        pageSizeOptions={[5, 10, 20, 50]}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        showPageSizeSelector={true}
        showFirstLast={true}
      />
    </div>
  );
}

/** Skeleton rows shaped exactly like a real row, so there's no layout jump on load. */
function SkeletonRows({ rows = 6 }) {
  return Array.from({ length: rows }).map((_, i) => (
    <tr key={i}>
      <td className="py-3 px-5">
        <div className="flex items-center gap-3">
          <div className="skeleton w-9 h-9 rounded-lg shrink-0" />
          <div className="space-y-1.5 flex-1">
            <div className="skeleton h-3.5 w-32 rounded" />
            <div className="skeleton h-2.5 w-16 rounded" />
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="skeleton h-3.5 w-24 rounded mb-1.5" />
        <div className="skeleton h-2.5 w-20 rounded" />
      </td>
      <td className="py-3 px-4">
        <div className="skeleton h-3.5 w-28 rounded mb-1.5" />
        <div className="skeleton h-2.5 w-16 rounded" />
      </td>
      <td className="py-3 px-4">
        <div className="skeleton h-3.5 w-16 rounded mb-1.5" />
        <div className="skeleton h-2.5 w-20 rounded" />
      </td>
      <td className="py-3 px-4">
        <div className="skeleton h-3.5 w-14 rounded" />
      </td>
      <td className="py-3 px-5 text-right">
        <div className="skeleton h-6 w-20 rounded ml-auto" />
      </td>
    </tr>
  ));
}