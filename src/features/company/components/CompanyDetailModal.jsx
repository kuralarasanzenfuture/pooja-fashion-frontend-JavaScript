import React from "react";
import {
  X,
  Building2,
  Mail,
  Phone,
  Globe,
  Calendar,
  DollarSign,
  ShieldCheck,
  Edit2,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  Maximize2,
} from "lucide-react";
import { Button } from "../../../common/components/ui/buttons/index.js";
import ImageViewerModal from "../../../common/components/ui/ImageViewerModal.jsx";

/**
 * Detailed Company View Modal
 */
export default function CompanyDetailModal({
  isOpen = false,
  onClose,
  company = null,
  onEdit,
  onChangeStatus,
}) {
  const [copiedField, setCopiedField] = React.useState(null);
  const [isImageViewerOpen, setIsImageViewerOpen] = React.useState(false);

  if (!isOpen || !company) return null;

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const statusColors = {
    active: "bg-success/20 text-success border-success/30",
    inactive: "bg-warning/20 text-warning border-warning/30",
    suspended: "bg-error/20 text-error border-error/30",
  };

  const initials = (company.companyName || "PF")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden flex flex-col max-h-[90vh] text-base-content">
        {/* Header Hero Banner */}
        <div className="relative p-6 bg-gradient-to-br from-[#0a1128] via-[#0f1c3f] to-[#1e3a8a] text-white">
          {/* Top Hairline accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div
              onClick={() => setIsImageViewerOpen(true)}
              title="Click to view full high-resolution emblem"
              className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl font-black text-amber-300 shadow-inner shrink-0 overflow-hidden relative cursor-pointer group hover:border-amber-300/60 transition-all"
            >
              <img
                src={company.logoUrl || "/images/pooja-fashion-logo.jpg"}
                alt={company.companyName}
                className="w-full h-full object-cover rounded-2xl transition-transform duration-200 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  if (e.currentTarget.nextElementSibling) {
                    e.currentTarget.nextElementSibling.style.display = "flex";
                  }
                }}
              />
              <span className="hidden w-full h-full items-center justify-center text-primary-content bg-primary font-black text-xl">
                {initials}
              </span>

              {/* Hover overlay hint */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                <Maximize2 className="w-4 h-4 text-amber-300 animate-pulse" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-300/30">
                  {company.companyCode}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${statusColors[company.status] || statusColors.active
                    }`}
                >
                  ● {company.status}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black mt-1.5 text-white tracking-tight leading-tight truncate">
                {company.companyName}
              </h2>

              {company.legalName && (
                <p className="text-xs text-sky-200/80 mt-0.5 truncate font-medium">
                  {company.legalName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Business Classification */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-base-content/50 font-mono mb-3">
              Entity Information & Identity
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-3.5 rounded-2xl bg-base-200/50 border border-base-300">
                <span className="text-[11px] font-semibold text-base-content/50 block">
                  Display Name
                </span>
                <span className="text-xs font-bold text-base-content mt-0.5 block">
                  {company.displayName || "—"}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-base-200/50 border border-base-300">
                <span className="text-[11px] font-semibold text-base-content/50 block">
                  Business & Sector
                </span>
                <span className="text-xs font-bold text-base-content mt-0.5 block">
                  {company.businessType || "Retail"} • {company.industryType || "Apparel"}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-base-200/50 border border-base-300 sm:col-span-2 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-base-content/50 block">
                    GSTIN / Registration Number
                  </span>
                  <span className="text-xs font-mono font-bold text-base-content mt-0.5 block">
                    {company.registrationNumber || "Not Registered"}
                  </span>
                </div>
                {company.registrationNumber && (
                  <button
                    type="button"
                    onClick={() => handleCopy(company.registrationNumber, "reg")}
                    className="p-1.5 rounded-lg text-base-content/50 hover:text-primary hover:bg-base-300 transition-colors"
                    title="Copy GSTIN"
                  >
                    {copiedField === "reg" ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Contact & Communication */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-base-content/50 font-mono mb-3">
              Contact & Communication
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-3.5 rounded-2xl bg-base-200/50 border border-base-300 flex items-center justify-between">
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-base-content/50 block">
                    Corporate Email
                  </span>
                  {company.email ? (
                    <a
                      href={`mailto:${company.email}`}
                      className="text-xs font-bold text-primary hover:underline truncate mt-0.5 block"
                    >
                      {company.email}
                    </a>
                  ) : (
                    <span className="text-xs text-base-content/40 font-bold">—</span>
                  )}
                </div>
                {company.email && (
                  <button
                    type="button"
                    onClick={() => handleCopy(company.email, "email")}
                    className="p-1.5 rounded-lg text-base-content/50 hover:text-primary hover:bg-base-300 transition-colors"
                  >
                    {copiedField === "email" ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-base-200/50 border border-base-300 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-base-content/50 block">
                    Phone & Mobile
                  </span>
                  <span className="text-xs font-bold text-base-content mt-0.5 block">
                    {company.phone || company.mobile || "—"}
                  </span>
                </div>
                {(company.phone || company.mobile) && (
                  <button
                    type="button"
                    onClick={() => handleCopy(company.phone || company.mobile, "phone")}
                    className="p-1.5 rounded-lg text-base-content/50 hover:text-primary hover:bg-base-300 transition-colors"
                  >
                    {copiedField === "phone" ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>

              {company.website && (
                <div className="p-3.5 rounded-2xl bg-base-200/50 border border-base-300 sm:col-span-2 flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="text-[11px] font-semibold text-base-content/50 block">
                      Website
                    </span>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5 mt-0.5 truncate"
                    >
                      <Globe className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{company.website}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Localization & Fiscal Setup */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-base-content/50 font-mono mb-3">
              Fiscal Year & Localization
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-base-200/50 border border-base-300 text-center">
                <span className="text-[10px] font-bold text-base-content/50 uppercase">
                  Currency
                </span>
                <span className="text-sm font-black font-mono text-base-content block mt-0.5">
                  {company.defaultCurrency || "INR"}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-base-200/50 border border-base-300 text-center">
                <span className="text-[10px] font-bold text-base-content/50 uppercase">
                  Country
                </span>
                <span className="text-sm font-black font-mono text-base-content block mt-0.5">
                  {company.countryCode || "IN"}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-base-200/50 border border-base-300 text-center">
                <span className="text-[10px] font-bold text-base-content/50 uppercase">
                  Fiscal Start
                </span>
                <span className="text-xs font-bold text-base-content block mt-1">
                  Month #{company.financialYearStartMonth || 4}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-base-200/50 border border-base-300 text-center">
                <span className="text-[10px] font-bold text-base-content/50 uppercase">
                  Timezone
                </span>
                <span className="text-[11px] font-mono font-bold text-base-content block mt-1 truncate">
                  {company.timezone || "Asia/Kolkata"}
                </span>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="pt-2 border-t border-base-300 flex flex-wrap items-center justify-between text-[11px] text-base-content/50">
            <span>ID: #{company.id}</span>
            {company.createdAt && (
              <span>Registered: {new Date(company.createdAt).toLocaleDateString()}</span>
            )}
            {company.updatedAt && (
              <span>Last Modified: {new Date(company.updatedAt).toLocaleDateString()}</span>
            )}
          </div>
        </div>

        {/* Modal Footer with Global Buttons */}
        <div className="p-4 sm:px-6 border-t border-base-300 flex items-center justify-between gap-3 bg-base-200/50">
          <Button variant="secondary" size="md" onClick={onClose}>
            Close
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              icon={RefreshCw}
              onClick={() => {
                onClose();
                onChangeStatus(company);
              }}
            >
              Update Status
            </Button>

            <Button
              variant="clip-six"
              size="md"
              icon={Edit2}
              onClick={() => {
                onClose();
                onEdit(company);
              }}
            >
              Edit Enterprise
            </Button>
          </div>
        </div>
      </div>

      {/* High-Resolution Fullscreen Image Viewer Lightbox */}
      <ImageViewerModal
        isOpen={isImageViewerOpen}
        onClose={() => setIsImageViewerOpen(false)}
        src={company?.logoUrl || "/images/pooja-fashion-logo.jpg"}
        title={company?.companyName || "Company Brand Emblem"}
        subtitle={`${company?.companyCode || "PFS"} • High Definition Inspection`}
      />
    </div>
  );
}
