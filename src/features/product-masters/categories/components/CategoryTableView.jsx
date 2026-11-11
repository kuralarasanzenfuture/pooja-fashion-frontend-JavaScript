import React from "react";
import {
  Building,
  Check,
  Copy,
  FolderTree,
  Eye,
  Edit2,
  Trash2,
} from "lucide-react";
import CategoryThumb from "./CategoryThumb.jsx";
import Pagination from "../../../../common/components/ui/pagination/Pagination.jsx";
import { formatCategoryName } from "../utils/categoryImageHelper.js";

/**
 * CategoryTableView
 * Professional, high-density data table for managing product categories.
 * Features responsive layout, inline status toggles, image previews, and action tooltips.
 */
export default function CategoryTableView({
  categories = [],
  totalItems = 0,
  page = 1,
  limit = 10,
  setPage,
  setLimit,
  copiedKey = null,
  onCopyCode,
  onToggleStatus,
  isStatusPending = false,
  onImageClick,
  onViewDetails,
  onEdit,
  onAddSubcategory,
  onDelete,
  fmtDate = (d) => d || "-",
}) {
  return (
    <div className="bg-base-100 rounded-2xl border border-base-300 shadow-2xs">
      <div className="overflow-x-auto scrollbar-none lg:overflow-x-visible">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="border-b border-base-300 bg-base-200/50 text-[11px] font-semibold uppercase tracking-wider text-base-content/60">
              <th className="py-3 px-5 w-20 text-center first:rounded-tl-2xl">Order</th>
              <th className="py-3 px-4">Category Details</th>
              <th className="py-3 px-4 hidden sm:table-cell">Company</th>
              <th className="py-3 px-4 hidden lg:table-cell max-w-[200px]">Description</th>
              <th className="py-3 px-4 whitespace-nowrap">Catalog Status</th>
              <th className="py-3 px-4 hidden md:table-cell whitespace-nowrap">Last Updated</th>
              <th className="py-3 px-5 text-right whitespace-nowrap last:rounded-tr-2xl">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200 text-sm">
            {categories.map((cat, index) => {
              const name = formatCategoryName(cat.categoryName || cat.category_name);
              const code = cat.categoryCode || cat.category_code;
              const imageUrl = cat.imageUrl || cat.image_url;
              const displayOrder = cat.displayOrder ?? cat.display_order ?? 0;
              const isActive =
                cat.isActive !== undefined ? cat.isActive : Boolean(cat.is_active);
              const updatedAt = cat.updatedAt || cat.updated_at;
              const desc = cat.description;
              const companyName = cat.companyName || cat.company_name || "Pooja Fashion";
              const companyCode = cat.companyCode || cat.company_code || null;

              return (
                <tr
                  key={cat.id}
                  className="hover:bg-base-200/50 transition-all duration-200 group animate-in fade-in-50 slide-in-from-bottom-2 duration-300 fill-mode-both"
                  style={{ animationDelay: `${Math.min(index * 30, 240)}ms` }}
                >
                  {/* Order */}
                  <td className="py-3.5 px-5 text-center">
                    <span className="inline-flex items-center justify-center min-w-8 px-2 py-1 rounded-lg bg-base-200 text-xs font-mono font-bold text-base-content/75 border border-base-300/80">
                      #{displayOrder}
                    </span>
                  </td>

                  {/* Category Info with Clickable High-Res Image */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <CategoryThumb
                        url={imageUrl}
                        name={name}
                        size="md"
                        onImageClick={onImageClick}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onViewDetails?.(cat)}
                            className="font-bold text-base-content text-sm leading-snug hover:text-primary transition-colors cursor-pointer text-left truncate"
                            title="Click to view category details"
                          >
                            {name}
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
                            {code}
                          </span>
                          <div
                            className="tooltip tooltip-top"
                            data-tip={copiedKey === cat.id ? "Copied code!" : "Copy code"}
                          >
                            <button
                              type="button"
                              onClick={() => onCopyCode?.(code, cat.id)}
                              className="text-base-content/40 hover:text-primary transition-colors cursor-pointer p-0.5"
                            >
                              {copiedKey === cat.id ? (
                                <Check className="w-3 h-3 text-emerald-500" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Company Info */}
                  <td className="py-3.5 px-4 hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                        <Building className="w-3.5 h-3.5" />
                      </span>
                      <div className="min-w-0">
                        <span
                          className="font-semibold text-xs text-base-content block truncate max-w-[130px]"
                          title={companyName}
                        >
                          {companyName}
                        </span>
                        {companyCode && (
                          <span className="badge badge-xs text-[9px] font-mono uppercase font-bold tracking-wider badge-ghost">
                            {companyCode}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Description */}
                  <td className="py-3.5 px-4 hidden lg:table-cell max-w-[200px]">
                    <p className="line-clamp-2 text-xs text-base-content/70 leading-relaxed">
                      {desc || (
                        <span className="italic text-base-content/40">
                          No description provided
                        </span>
                      )}
                    </p>
                  </td>

                  {/* Status Toggle */}
                  <td className="py-3.5 px-4">
                    <label className="inline-flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        className="toggle toggle-success toggle-sm"
                        checked={isActive}
                        disabled={isStatusPending}
                        onChange={() => onToggleStatus?.(cat)}
                        aria-label={`Toggle active status for ${name}`}
                      />
                      <span
                        className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${
                          isActive
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-base-200 text-base-content/50"
                        }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </label>
                  </td>

                  {/* Updated Date */}
                  <td className="py-3.5 px-4 hidden md:table-cell whitespace-nowrap text-xs text-base-content/65 font-medium">
                    {fmtDate(updatedAt)}
                  </td>

                  {/* Actions with DaisyUI Tooltips */}
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <div className="tooltip tooltip-left" data-tip="Add Subcategory">
                        <button
                          type="button"
                          onClick={() => onAddSubcategory?.(cat)}
                          className="p-1.5 rounded-lg text-base-content/60 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                        >
                          <FolderTree className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="tooltip tooltip-left" data-tip="View Details">
                        <button
                          type="button"
                          onClick={() => onViewDetails?.(cat)}
                          className="p-1.5 rounded-lg text-base-content/60 hover:text-primary hover:bg-base-200 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="tooltip tooltip-left" data-tip="Edit Category">
                        <button
                          type="button"
                          onClick={() => onEdit?.(cat)}
                          className="p-1.5 rounded-lg text-base-content/60 hover:text-primary hover:bg-base-200 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div
                        className="tooltip tooltip-left tooltip-error"
                        data-tip="Delete Category"
                      >
                        <button
                          type="button"
                          onClick={() => onDelete?.(cat)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-500/10 hover:text-rose-700 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer Pagination */}
      <Pagination
        currentPage={page}
        totalItems={totalItems}
        pageSize={limit}
        pageSizeOptions={[6, 10, 20, 50, "All"]}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setLimit?.(newSize);
          setPage?.(1);
        }}
        showPageSizeSelector={true}
        showFirstLast={true}
      />
    </div>
  );
}
