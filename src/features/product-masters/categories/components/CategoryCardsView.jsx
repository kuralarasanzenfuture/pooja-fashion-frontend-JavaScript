import React from "react";
import {
  Building,
  Check,
  Copy,
  FolderTree,
  Eye,
  Edit2,
  Trash2,
  Calendar,
} from "lucide-react";
import CategoryThumb from "./CategoryThumb.jsx";
import Pagination from "../../../../common/components/ui/pagination/Pagination.jsx";

/**
 * CategoryCardsView
 * Responsive card grid layout for visual-first browsing of product categories.
 * Each card showcases large thumbnail previews, inline status toggles, metadata badges, and quick actions.
 */
export default function CategoryCardsView({
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat, index) => {
          const name = cat.categoryName || cat.category_name;
          const code = cat.categoryCode || cat.category_code;
          const imageUrl = cat.imageUrl || cat.image_url;
          const displayOrder = cat.displayOrder ?? cat.display_order ?? 0;
          const isActive =
            cat.isActive !== undefined ? cat.isActive : Boolean(cat.is_active);
          const updatedAt = cat.updatedAt || cat.updated_at;
          const desc = cat.description;
          const companyName = cat.companyName || cat.company_name || "Pooja Fashion";

          return (
            <div
              key={cat.id}
              className="rounded-2xl p-5 bg-base-100 border border-base-300 hover:border-primary/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 shadow-xs group animate-in fade-in-50 slide-in-from-bottom-3 duration-300 fill-mode-both"
              style={{ animationDelay: `${Math.min(index * 40, 320)}ms` }}
            >
              <div>
                {/* Top badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-base-200 text-base-content/75 border border-base-300/80">
                      #{displayOrder}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg text-xs font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
                      {code}
                    </span>
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-base-200/90 text-base-content/70 border border-base-300"
                      title={`Company: ${companyName}`}
                    >
                      <Building className="w-3 h-3 text-primary shrink-0" />
                      <span className="truncate max-w-[100px]">{companyName}</span>
                    </span>
                  </div>

                  <label className="inline-flex cursor-pointer items-center gap-1.5">
                    <input
                      type="checkbox"
                      className="toggle toggle-success toggle-xs"
                      checked={isActive}
                      disabled={isStatusPending}
                      onChange={() => onToggleStatus?.(cat)}
                      aria-label={`Toggle active for ${name}`}
                    />
                    <span
                      className={`text-[11px] font-semibold ${
                        isActive ? "text-emerald-600" : "text-base-content/50"
                      }`}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </label>
                </div>

                {/* Image Banner / Media Preview with Click to Full View */}
                <div className="relative mb-3.5">
                  <CategoryThumb
                    url={imageUrl}
                    name={name}
                    size="lg"
                    onImageClick={onImageClick}
                  />
                </div>

                {/* Category Title & Description */}
                <div className="space-y-1">
                  <h3
                    onClick={() => onViewDetails?.(cat)}
                    className="text-base font-bold text-base-content leading-snug truncate group-hover:text-primary transition-colors cursor-pointer"
                    title="Click to view details"
                  >
                    {name}
                  </h3>
                  <p className="text-xs text-base-content/65 line-clamp-2 leading-relaxed min-h-[32px]">
                    {desc || (
                      <span className="italic text-base-content/40">
                        No description provided
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-base-200 flex items-center justify-between text-xs text-base-content/60">
                <span className="flex items-center gap-1 font-medium text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-base-content/40" />
                  {fmtDate(updatedAt)}
                </span>

                <div className="flex items-center gap-1.5">
                  <div
                    className="tooltip tooltip-top"
                    data-tip={copiedKey === cat.id ? "Copied code!" : "Copy code"}
                  >
                    <button
                      type="button"
                      onClick={() => onCopyCode?.(code, cat.id)}
                      className="p-1.5 rounded-lg text-base-content/60 hover:text-primary hover:bg-base-200 transition-colors cursor-pointer"
                    >
                      {copiedKey === cat.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="tooltip tooltip-top" data-tip="Add Subcategory">
                    <button
                      type="button"
                      onClick={() => onAddSubcategory?.(cat)}
                      className="p-1.5 rounded-lg text-base-content/60 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                    >
                      <FolderTree className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="tooltip tooltip-top" data-tip="View Details">
                    <button
                      type="button"
                      onClick={() => onViewDetails?.(cat)}
                      className="p-1.5 rounded-lg text-base-content/60 hover:text-primary hover:bg-base-200 transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="tooltip tooltip-top" data-tip="Edit Category">
                    <button
                      type="button"
                      onClick={() => onEdit?.(cat)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-primary hover:bg-primary/10 border border-primary/20 transition-all cursor-pointer shadow-2xs"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>

                  <div
                    className="tooltip tooltip-top tooltip-error"
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
              </div>
            </div>
          );
        })}
      </div>

      {/* Cards Footer Pagination */}
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
