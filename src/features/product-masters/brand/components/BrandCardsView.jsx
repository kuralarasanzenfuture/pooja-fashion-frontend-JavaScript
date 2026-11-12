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
 * BrandCardsView
 * Visual grid view displaying brands as luxury brand cards.
 */
export default function BrandCardsView({
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
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

        return (
          <div
            key={brand.id}
            className="group relative flex flex-col justify-between rounded-3xl border border-base-300 bg-base-100 p-5 shadow-2xs hover:shadow-lg hover:border-primary/40 transition-all duration-300 animate-in fade-in-50 slide-in-from-bottom-2 fill-mode-both"
            style={{ animationDelay: `${Math.min(index * 30, 240)}ms` }}
          >
            {/* Top Bar: Order & Status */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-lg bg-base-200 text-xs font-mono font-bold text-base-content/70 border border-base-300/80">
                  #{displayOrder}
                </span>

                <label className="inline-flex cursor-pointer items-center gap-1.5 select-none">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => onToggleStatus?.(brand)}
                    disabled={isStatusPending}
                    className="toggle toggle-success toggle-xs"
                    aria-label={`Toggle status for ${name}`}
                  />
                  <span
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-base-200 text-base-content/50 border border-base-300"
                    }`}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </label>
              </div>

              {/* Centered Brand Emblem & Identity */}
              <div className="flex flex-col items-center text-center">
                <div className="mb-3">
                  <BrandThumb
                    url={logoUrl}
                    name={name}
                    code={code}
                    size="lg"
                    onImageClick={onImageClick}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => onViewDetails?.(brand)}
                  className="font-extrabold text-base text-base-content hover:text-primary transition-colors cursor-pointer line-clamp-1 max-w-full"
                  title={name}
                >
                  {name}
                </button>

                {code && (
                  <div className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 text-[11px] font-mono font-bold">
                    <span>{code}</span>
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
                        className="hover:text-primary/70 transition-colors cursor-pointer"
                        aria-label="Copy brand code"
                      >
                        {copiedKey === `brand-${brand.id}` ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {website && (
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-primary/80 hover:text-primary hover:underline font-medium mt-2 max-w-[200px] truncate"
                  >
                    <span className="truncate">{website.replace(/^https?:\/\//i, "")}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                )}

                {desc && (
                  <p className="text-xs text-base-content/60 mt-2.5 line-clamp-2 text-center">
                    {desc}
                  </p>
                )}
              </div>
            </div>

            {/* Card Footer: Company & Actions */}
            <div className="pt-4 mt-4 border-t border-base-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 text-[11px] text-base-content/60 truncate min-w-0">
                {companyName && (
                  <>
                    <Building className="w-3 h-3 shrink-0 text-base-content/40" />
                    <span className="truncate">{companyName}</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <div className="tooltip tooltip-top" data-tip="View Details">
                  <button
                    type="button"
                    onClick={() => onViewDetails?.(brand)}
                    className="p-1.5 rounded-lg text-base-content/60 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                    aria-label="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
                <div className="tooltip tooltip-top" data-tip="Edit Brand">
                  <button
                    type="button"
                    onClick={() => onEdit?.(brand)}
                    className="p-1.5 rounded-lg text-base-content/60 hover:text-amber-600 hover:bg-amber-500/10 transition-colors cursor-pointer"
                    aria-label="Edit Brand"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="tooltip tooltip-top tooltip-error" data-tip="Delete Brand">
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
            </div>
          </div>
        );
      })}
    </div>
  );
}

