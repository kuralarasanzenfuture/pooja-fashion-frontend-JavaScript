import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Building2,
  ChevronLeft,
  Edit2,
  RefreshCw,
  Trash2,
  Mail,
  Phone,
  Globe,
  DollarSign,
  Calendar,
  ShieldCheck,
  FileText,
  Copy,
  Check,
  ExternalLink,
  MapPin,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Layers,
  ArrowRight,
  Camera,
  Maximize2,
} from "lucide-react";
import ImageViewerModal from "../../../common/components/ui/ImageViewerModal.jsx";
import { Button } from "../../../common/components/ui/buttons/index.js";
import {
  useCompany,
  useCompanies,
  useUpdateCompany,
  useUpdateCompanyStatus,
  useDeleteCompany,
} from "../hooks/useCompanies.js";
import {
  CompanyModal,
  CompanyStatusModal,
  CompanyDeleteModal,
} from "../components/index.js";

/**
 * Full Page View for Company Enterprise
 * Supports viewing by ID (/company/:id) or primary store profile (/company/profile)
 */
export default function CompanyViewPage({ isProfileMode = false }) {
  const { id: routeId } = useParams();
  const navigate = useNavigate();

  // Active section tabs
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedField, setCopiedField] = useState(null);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // In profile mode without ID, fetch the first company as default
  const { data: companiesResponse, isLoading: isListLoading } = useCompanies(
    isProfileMode && !routeId ? { limit: 1 } : { enabled: false }
  );

  const targetId = routeId || companiesResponse?.data?.[0]?.id;

  // Single company query
  const {
    data: companyResponse,
    isLoading: isCompanyLoading,
    isError,
    error,
    refetch,
  } = useCompany(targetId, {
    enabled: Boolean(targetId),
  });

  // Mutations
  const updateMutation = useUpdateCompany();
  const statusMutation = useUpdateCompanyStatus();
  const deleteMutation = useDeleteCompany();

  const company = companyResponse?.data || (isProfileMode ? companiesResponse?.data?.[0] : null);
  const isLoading = (isProfileMode && !routeId && isListLoading) || isCompanyLoading;

  const handleCopy = (text, fieldKey) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 1800);
  };

  // Submit Edit
  const handleEditSubmit = async (formData) => {
    try {
      await updateMutation.mutateAsync({
        id: company.id,
        data: formData,
      });
      setIsEditModalOpen(false);
      refetch();
    } catch (err) {
      console.error("Failed to update company:", err);
    }
  };

  // Submit Status Change
  const handleStatusSubmit = async ({ id, status }) => {
    try {
      await statusMutation.mutateAsync({ id, status });
      setIsStatusModalOpen(false);
      refetch();
    } catch (err) {
      console.error("Failed to change status:", err);
    }
  };

  // Submit Deletion
  const handleDeleteSubmit = async (id) => {
    try {
      await deleteMutation.mutateAsync(id);
      setIsDeleteModalOpen(false);
      navigate("/company", { replace: true });
    } catch (err) {
      console.error("Failed to delete company:", err);
    }
  };

  const statusThemes = {
    active: {
      label: "Active (Operational)",
      badgeBg: "bg-success/15 text-success border-success/30",
      dot: "bg-success",
    },
    inactive: {
      label: "Inactive (Dormant)",
      badgeBg: "bg-warning/15 text-warning border-warning/30",
      dot: "bg-warning",
    },
    suspended: {
      label: "Suspended (Locked)",
      badgeBg: "bg-error/15 text-error border-error/30",
      dot: "bg-error",
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-3 border-[#1e3a8a] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold text-slate-600">
          Loading company profile...
        </span>
      </div>
    );
  }

  if (isError || (!isLoading && !company)) {
    return (
      <div className="min-h-[450px] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">
          Company Not Found
        </h3>
        <p className="text-sm text-slate-500 mt-1 max-w-md">
          {error?.message || "The requested company record could not be retrieved from the database."}
        </p>
        <div className="mt-6 flex items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            icon={ChevronLeft}
            onClick={() => navigate("/company")}
          >
            Back to Companies Directory
          </Button>
        </div>
      </div>
    );
  }

  const initials = (company.companyName || "PF")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const currentTheme = statusThemes[company.status] || statusThemes.active;

  const tabs = [
    { id: "overview", label: "Overview & Identity", icon: Building2, colorDot: "bg-primary" },
    { id: "contact", label: "Contact & Web", icon: Mail, colorDot: "bg-secondary" },
    { id: "fiscal", label: "Localization & Fiscal", icon: DollarSign, colorDot: "bg-accent" },
    { id: "audit", label: "System & Audit Trail", icon: Clock, colorDot: "bg-info" },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Action Bar & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            icon={ChevronLeft}
            onClick={() => navigate("/company")}
          >
            All Companies
          </Button>
          <div className="h-4 w-px bg-base-300 hidden sm:block" />
          <nav className="text-xs sm:text-sm font-medium text-base-content/60 flex items-center gap-1.5 truncate">
            <Link to="/company" className="hover:text-primary transition-colors">
              Company
            </Link>
            <span>/</span>
            <span className="font-bold text-base-content truncate">
              {company.companyName}
            </span>
          </nav>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={() => setIsStatusModalOpen(true)}
          >
            Change Status
          </Button>

          <Button
            variant="clip-six"
            size="sm"
            icon={Edit2}
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit Company
          </Button>

          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={() => setIsDeleteModalOpen(true)}
            title="Delete this company"
          />
        </div>
      </div>

      {/* Main Luxury Hero Identity Card */}
      <div className="relative rounded-3xl bg-base-100 border border-base-300 shadow-sm p-6 sm:p-8 overflow-hidden transition-colors duration-200">
        {/* Top Luxury Hairline Accent */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0a1128] via-[#1e3a8a] to-[#d4af37]" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            {/* Company Avatar / Logo with High-Resolution Click-to-View */}
            <div className="relative group/avatar">
              <div
                onClick={() => setIsImageViewerOpen(true)}
                title="Click to view full high-resolution emblem"
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-base-200 text-base-content flex items-center justify-center font-black text-2xl tracking-wider shadow-md shrink-0 border border-base-300 overflow-hidden relative cursor-pointer group hover:border-primary transition-all"
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
                <span className="hidden w-full h-full items-center justify-center bg-primary text-primary-content font-black text-2xl">
                  {initials}
                </span>

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-2xs">
                  <Maximize2 className="w-5 h-5 text-amber-300 animate-pulse" />
                  <span className="text-[9px] font-bold mt-0.5">View HD</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                title="Change brand profile logo"
                className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-full bg-primary text-primary-content shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer border-2 border-base-100 z-10"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Entity Name & Quick Badges */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-base-200 text-base-content border border-base-300">
                  {company.companyCode}
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${currentTheme.badgeBg}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${currentTheme.dot} ${company.status === "active" ? "animate-pulse" : ""
                      }`}
                  />
                  <span>{currentTheme.label}</span>
                </span>

                <span className="text-xs font-mono text-base-content/50 font-semibold">
                  ID: #{company.id}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-base-content mt-2 tracking-tight">
                {company.companyName}
              </h1>

              {company.legalName && (
                <p className="text-sm font-medium text-base-content/60 mt-1">
                  Legal Name: <span className="text-base-content font-semibold">{company.legalName}</span>
                </p>
              )}
            </div>
          </div>

          {/* Quick Info Box on Right */}
          <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-1 pt-4 md:pt-0 border-t md:border-t-0 border-base-200">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/50 font-mono">
              Store Registration
            </span>
            <span className="text-sm sm:text-base font-mono font-black text-base-content">
              {company.registrationNumber || "Unregistered"}
            </span>
            <span className="text-xs text-base-content/60 font-medium">
              Base: {company.defaultCurrency || "INR"} • {company.countryCode || "IN"}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Quick Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-base-100 border border-base-300 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/50 font-mono">
              Operation Status
            </span>
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-xl font-bold text-base-content mt-2 capitalize">
            {company.status}
          </p>
          <p className="text-xs text-base-content/60 mt-0.5">
            {company.status === "active" ? "Ready for sales & billing" : "Restricted activity"}
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-base-100 border border-base-300 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/50 font-mono">
              Base Currency
            </span>
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <p className="text-xl font-bold text-base-content mt-2 font-mono">
            {company.defaultCurrency || "INR"}
          </p>
          <p className="text-xs text-base-content/60 mt-0.5">
            Region: {company.countryCode || "IN"} ({company.timezone || "Asia/Kolkata"})
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-base-100 border border-base-300 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/50 font-mono">
              Fiscal Cycle
            </span>
            <Calendar className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-xl font-bold text-base-content mt-2">
            Month #{company.financialYearStartMonth || 4}
          </p>
          <p className="text-xs text-base-content/60 mt-0.5">
            Starts in {company.financialYearStartMonth === 4 ? "April (Standard IST)" : "January"}
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-base-100 border border-base-300 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/50 font-mono">
              Business Type
            </span>
            <Building2 className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-xl font-bold text-base-content mt-2 truncate">
            {company.businessType || "Retail Boutique"}
          </p>
          <p className="text-xs text-base-content/60 mt-0.5 truncate">
            {company.industryType || "Apparel & Sarees"}
          </p>
        </div>
      </div>

      {/* Main Tabbed Details Container */}
      <div className="rounded-3xl bg-base-100 border border-base-300 shadow-xs overflow-hidden transition-colors duration-200">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-base-300 bg-base-200/50 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-b-2 ${
                  isActive
                    ? "bg-primary text-primary-content border-primary shadow-sm shadow-primary/30"
                    : "text-base-content/60 border-transparent hover:text-base-content hover:bg-base-200/80"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span
                  className={`w-2 h-2 rounded-full ${tab.colorDot} ${
                    isActive ? "ring-2 ring-primary-content/50" : ""
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="p-6 sm:p-8">
          {/* TAB 1: OVERVIEW & IDENTITY */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h3 className="text-base font-extrabold text-base-content mb-1">
                  Corporate Registration & Identity
                </h3>
                <p className="text-xs sm:text-sm text-base-content/60">
                  Core enterprise parameters, statutory names, and business taxonomy.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300">
                  <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider block font-mono">
                    Company Code
                  </span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-base font-mono font-bold text-base-content">
                      {company.companyCode}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(company.companyCode, "code")}
                      className="p-1 rounded text-base-content/50 hover:text-primary transition-colors"
                      title="Copy Code"
                    >
                      {copiedField === "code" ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300">
                  <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider block font-mono">
                    Official Company Name
                  </span>
                  <span className="text-base font-bold text-base-content mt-1 block">
                    {company.companyName}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300">
                  <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider block font-mono">
                    Display Name
                  </span>
                  <span className="text-base font-bold text-base-content mt-1 block">
                    {company.displayName || "—"}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300">
                  <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider block font-mono">
                    Legal / Statutory Name
                  </span>
                  <span className="text-base font-bold text-base-content mt-1 block">
                    {company.legalName || "—"}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300">
                  <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider block font-mono">
                    Business Type
                  </span>
                  <span className="text-base font-bold text-base-content mt-1 block">
                    {company.businessType || "Retail & Wholesale"}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300">
                  <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider block font-mono">
                    Industry Sector
                  </span>
                  <span className="text-base font-bold text-base-content mt-1 block">
                    {company.industryType || "Apparel & Textiles"}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300 sm:col-span-2 lg:col-span-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider block font-mono">
                      Registration Number / GSTIN / CIN
                    </span>
                    <span className="text-base font-mono font-bold text-base-content mt-1 block">
                      {company.registrationNumber || "Not Registered"}
                    </span>
                  </div>
                  {company.registrationNumber && (
                    <button
                      type="button"
                      onClick={() => handleCopy(company.registrationNumber, "reg")}
                      className="p-2 rounded-xl text-base-content/50 hover:text-primary hover:bg-base-300 transition-colors"
                      title="Copy GSTIN"
                    >
                      {copiedField === "reg" ? (
                        <Check className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTACT & WEB */}
          {activeTab === "contact" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h3 className="text-base font-extrabold text-base-content mb-1">
                  Contact Information & Channels
                </h3>
                <p className="text-xs sm:text-sm text-base-content/60">
                  Direct contact details, corporate communications, and online presence.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-base-200/50 border border-base-300 flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider block font-mono">
                      Corporate Email
                    </span>
                    {company.email ? (
                      <a
                        href={`mailto:${company.email}`}
                        className="text-base font-bold text-primary hover:underline flex items-center gap-2 mt-1 truncate"
                      >
                        <Mail className="w-4 h-4 shrink-0 text-base-content/50" />
                        <span className="truncate">{company.email}</span>
                      </a>
                    ) : (
                      <span className="text-base font-bold text-base-content/40 mt-1 block">—</span>
                    )}
                  </div>
                  {company.email && (
                    <button
                      type="button"
                      onClick={() => handleCopy(company.email, "email")}
                      className="p-2 rounded-xl text-base-content/50 hover:text-primary hover:bg-base-300 transition-colors"
                    >
                      {copiedField === "email" ? (
                        <Check className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  )}
                </div>

                <div className="p-5 rounded-2xl bg-base-200/50 border border-base-300 flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider block font-mono">
                      Landline Telephone
                    </span>
                    {company.phone ? (
                      <a
                        href={`tel:${company.phone}`}
                        className="text-base font-bold text-base-content hover:text-primary flex items-center gap-2 mt-1 truncate"
                      >
                        <Phone className="w-4 h-4 shrink-0 text-base-content/50" />
                        <span>{company.phone}</span>
                      </a>
                    ) : (
                      <span className="text-base font-bold text-base-content/40 mt-1 block">—</span>
                    )}
                  </div>
                  {company.phone && (
                    <button
                      type="button"
                      onClick={() => handleCopy(company.phone, "phone")}
                      className="p-2 rounded-xl text-base-content/50 hover:text-primary hover:bg-base-300 transition-colors"
                    >
                      {copiedField === "phone" ? (
                        <Check className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  )}
                </div>

                <div className="p-5 rounded-2xl bg-base-200/50 border border-base-300 flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider block font-mono">
                      Mobile Hotline
                    </span>
                    {company.mobile ? (
                      <a
                        href={`tel:${company.mobile}`}
                        className="text-base font-bold text-base-content hover:text-primary flex items-center gap-2 mt-1 truncate"
                      >
                        <Phone className="w-4 h-4 shrink-0 text-base-content/50" />
                        <span>{company.mobile}</span>
                      </a>
                    ) : (
                      <span className="text-base font-bold text-base-content/40 mt-1 block">—</span>
                    )}
                  </div>
                  {company.mobile && (
                    <button
                      type="button"
                      onClick={() => handleCopy(company.mobile, "mobile")}
                      className="p-2 rounded-xl text-base-content/50 hover:text-primary hover:bg-base-300 transition-colors"
                    >
                      {copiedField === "mobile" ? (
                        <Check className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  )}
                </div>

                <div className="p-5 rounded-2xl bg-base-200/50 border border-base-300 flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider block font-mono">
                      Official Website
                    </span>
                    {company.website ? (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-bold text-primary hover:underline flex items-center gap-2 mt-1 truncate"
                      >
                        <Globe className="w-4 h-4 shrink-0 text-base-content/50" />
                        <span className="truncate">{company.website}</span>
                        <ExternalLink className="w-4 h-4 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-base font-bold text-base-content/40 mt-1 block">—</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LOCALIZATION & FISCAL */}
          {activeTab === "fiscal" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h3 className="text-base font-extrabold text-base-content mb-1">
                  Currency, Region & Fiscal Configuration
                </h3>
                <p className="text-xs sm:text-sm text-base-content/60">
                  Accounting currency, regional tax zone, and financial calendar parameters.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-base-200/50 border border-base-300 text-center">
                  <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider font-mono">
                    Currency ISO
                  </span>
                  <p className="text-2xl font-black font-mono text-base-content mt-2">
                    {company.defaultCurrency || "INR"}
                  </p>
                  <span className="text-xs text-base-content/60 font-medium mt-1 block">
                    Indian Rupee (₹)
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-base-200/50 border border-base-300 text-center">
                  <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider font-mono">
                    Country Code
                  </span>
                  <p className="text-2xl font-black font-mono text-base-content mt-2">
                    {company.countryCode || "IN"}
                  </p>
                  <span className="text-xs text-base-content/60 font-medium mt-1 block">
                    India
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-base-200/50 border border-base-300 text-center">
                  <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider font-mono">
                    Fiscal Start
                  </span>
                  <p className="text-2xl font-black text-base-content mt-2">
                    Month #{company.financialYearStartMonth || 4}
                  </p>
                  <span className="text-xs text-base-content/60 font-medium mt-1 block">
                    April (Standard GST)
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-base-200/50 border border-base-300 text-center">
                  <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider font-mono">
                    Store Timezone
                  </span>
                  <p className="text-base font-black font-mono text-base-content mt-3 truncate">
                    {company.timezone || "Asia/Kolkata"}
                  </p>
                  <span className="text-xs text-base-content/60 font-medium mt-1 block">
                    IST (+05:30)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AUDIT TRAIL */}
          {activeTab === "audit" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h3 className="text-base font-extrabold text-base-content mb-1">
                  Entity History & System Audit
                </h3>
                <p className="text-xs sm:text-sm text-base-content/60">
                  Timestamps, database identity, and multi-tenant ledger binding.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-base-200/50 border border-base-300">
                  <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider block font-mono">
                    Primary Entity ID
                  </span>
                  <span className="text-lg font-mono font-bold text-base-content mt-1 block">
                    #{company.id}
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-base-200/50 border border-base-300">
                  <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider block font-mono">
                    Record Registered At
                  </span>
                  <span className="text-sm font-semibold text-base-content mt-1 block">
                    {company.createdAt
                      ? new Date(company.createdAt).toLocaleString()
                      : "System Baseline Seed"}
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-base-200/50 border border-base-300">
                  <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider block font-mono">
                    Last Modified At
                  </span>
                  <span className="text-sm font-semibold text-base-content mt-1 block">
                    {company.updatedAt
                      ? new Date(company.updatedAt).toLocaleString()
                      : "Original creation"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <CompanyModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        company={company}
        onSubmit={handleEditSubmit}
        isSubmitting={updateMutation.isPending}
      />

      {/* Status Modal */}
      <CompanyStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        company={company}
        onSubmit={handleStatusSubmit}
        isSubmitting={statusMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <CompanyDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        company={company}
        onConfirm={handleDeleteSubmit}
        isDeleting={deleteMutation.isPending}
      />

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
