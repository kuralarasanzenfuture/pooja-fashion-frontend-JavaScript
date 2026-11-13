import {
  ExternalLink,
  Copy,
  Check,
  Eye,
  Edit2,
  Trash2,
  Building,
  Tag,
  Plus,
} from "lucide-react";
import BrandThumb from "./BrandThumb.jsx";
import { formatBrandName } from "../utils/brandHelper.js";
import { Button } from "../../../../common/components/ui/buttons/index.js";

/**
 * BrandTableView
 * High-density data table for managing product master brands.
 */
export default function BrandTableView({
  brands = [],
  copiedKey = null,
  onCopyCode,
  onToggleStatus,
  isStatusPending = false,
  onImageClick,
  onViewDetails,
  onEdit,
  onDelete,
  onAddBrand,
  fmtDate = (d) => d || "—",
}) {
  if (!brands || brands.length === 0) {
    return (
      <div className="rounded-3xl border border-base-300 bg-base-100 p-12 text-center shadow-xs">
        <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-4">
          <Tag className="w-8 h-8" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-base-content">
          No brands found
        </h3>
        <p className="text-xs sm:text-sm text-base-content/60 mt-1 max-w-sm mx-auto">
          No brands match your current search or filter criteria. Try adjusting your query or create a new brand.
        </p>
        {onAddBrand && (
          <div className="mt-5">
            <Button variant="clip-six" size="sm" icon={Plus} onClick={onAddBrand}>
              Add Brand
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-3xl border border-base-300 overflow-hidden shadow-2xs">
      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="border-b border-base-300 bg-base-200/50 text-[11px] font-semibold uppercase tracking-wider text-base-content/60">
              <th className="py-3.5 px-5 w-20 text-center first:rounded-tl-3xl">Order</th>
              <th className="py-3.5 px-4">Brand Details</th>
              <th className="py-3.5 px-4 hidden md:table-cell">Website</th>
              <th className="py-3.5 px-4 hidden lg:table-cell">Company</th>
              <th className="py-3.5 px-4 hidden xl:table-cell max-w-[200px]">Description</th>
              <th className="py-3.5 px-4 whitespace-nowrap">Catalog Status</th>
              <th className="py-3.5 px-5 text-right whitespace-nowrap last:rounded-tr-3xl">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200 text-sm">
            {brands.map((brand, index) => {
              const name = formatBrandName(brand.brandName || brand.brand_name);
              const code = brand.brandCode || brand.brand_code;
              const logoUrl = brand.logoUrl || brand.logo_url;
              const website = brand.websiteUrl || brand.website_url;
              const displayOrder = brand.displayOrder ?? brand.display_order ?? 0;
              const isActive =
                brand.isActive !== undefined ? brand.isActive : Boolean(brand.is_active);
              const desc = brand.description;
              const companyName = brand.companyName || brand.company_name;
              const companyCode = brand.companyCode || brand.company_code;

              return (
                <tr
                  key={brand.id}
                  className="hover:bg-base-200/50 transition-all duration-200 group animate-in fade-in-50 slide-in-from-bottom-2 duration-300 fill-mode-both"
                  style={{ animationDelay: `${Math.min(index * 25, 200)}ms` }}
                >
                  {/* Order */}
                  <td className="py-4 px-5 text-center">
                    <span className="inline-flex items-center justify-center min-w-8 px-2 py-1 rounded-lg bg-base-200 text-xs font-mono font-bold text-base-content/75 border border-base-300/80">
                      #{displayOrder}
                    </span>
                  </td>

                  {/* Brand Details */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <BrandThumb
                        url={logoUrl}
                        name={name}
                        code={code}
                        size="md"
                        onImageClick={onImageClick}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onViewDetails?.(brand)}
                            className="font-bold text-base-content text-sm leading-snug hover:text-primary transition-colors cursor-pointer text-left truncate"
                            title="Click to view brand details"
                          >
                            {name}
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {code && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
                              {code}
                            </span>
                          )}
                          {code && (
                            <div
                              className="tooltip tooltip-top"
                              data-tip={copiedKey === `brand-${brand.id}` ? "Copied code!" : "Copy code"}
                            >
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onCopyCode?.(code, brand.id);
                                }}
                                className="text-base-content/40 hover:text-primary p-0.5 rounded transition-colors cursor-pointer"
                                aria-label="Copy brand code"
                              >
                                {copiedKey === `brand-${brand.id}` ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Website */}
                  <td className="py-4 px-4 hidden md:table-cell">
                    {website ? (
                      <a
                        href={website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium max-w-[180px] truncate"
                        title={website}
                      >
                        <span className="truncate">{website.replace(/^https?:\/\//i, "")}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-xs text-base-content/40">—</span>
                    )}
                  </td>

                  {/* Company */}
                  <td className="py-4 px-4 hidden lg:table-cell">
                    {companyName ? (
                      <div className="flex items-center gap-1.5 text-xs text-base-content/80 font-medium">
                        <Building className="w-3.5 h-3.5 text-base-content/40 shrink-0" />
                        <span className="truncate max-w-[160px]">{companyName}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-base-content/40">—</span>
                    )}
                  </td>

                  {/* Description */}
                  <td className="py-4 px-4 hidden xl:table-cell max-w-[200px]">
                    <span className="text-xs text-base-content/60 line-clamp-1 truncate block" title={desc || ""}>
                      {desc || "—"}
                    </span>
                  </td>

                  {/* Catalog Status */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <label className="inline-flex cursor-pointer items-center gap-2 select-none">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => onToggleStatus?.(brand)}
                        disabled={isStatusPending}
                        className="toggle toggle-success toggle-sm"
                        aria-label={`Toggle active status for ${name}`}
                      />
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40"
                            : "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40"
                        }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </label>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <div className="tooltip tooltip-left" data-tip="View Details">
                        <button
                          type="button"
                          onClick={() => onViewDetails?.(brand)}
                          className="p-1.5 rounded-lg text-base-content/60 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                          aria-label="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="tooltip tooltip-left" data-tip="Edit Brand">
                        <button
                          type="button"
                          onClick={() => onEdit?.(brand)}
                          className="p-1.5 rounded-lg text-base-content/60 hover:text-amber-600 hover:bg-amber-500/10 transition-colors cursor-pointer"
                          aria-label="Edit Brand"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="tooltip tooltip-left tooltip-error" data-tip="Delete Brand">
                        <button
                          type="button"
                          onClick={() => onDelete?.(brand)}
                          className="p-1.5 rounded-lg text-base-content/60 hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          aria-label="Delete Brand"
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
    </div>
  );
}

