import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Building2,
  FileText,
  Mail,
  DollarSign,
  Save,
  AlertCircle,
  CheckCircle2,
  PauseCircle,
  Ban,
  Camera,
  UploadCloud,
  Maximize2,
  Eye,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "../../../common/components/ui/buttons/index.js";
import ImageViewerModal from "../../../common/components/ui/ImageViewerModal.jsx";

/**
 * Company Modal for Create and Edit Operations
 */
export default function CompanyModal({
  isOpen = false,
  onClose,
  company = null, // null for create, object for edit
  onSubmit,
  isSubmitting = false,
}) {
  const isEdit = Boolean(company?.id);

  const initialFormState = {
    company_code: "",
    company_name: "",
    legal_name: "",
    display_name: "",
    business_type: "Retail & Wholesale Boutique",
    industry_type: "Apparel & Textiles",
    registration_number: "",
    email: "",
    phone: "",
    mobile: "",
    website: "",
    logo_url: "",
    default_currency: "INR",
    country_code: "IN",
    timezone: "Asia/Kolkata",
    financial_year_start_month: 4,
    status: "active",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("identity");
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (company) {
      setFormData({
        company_code: company.companyCode || company.company_code || "",
        company_name: company.companyName || company.company_name || "",
        legal_name: company.legalName || company.legal_name || "",
        display_name: company.displayName || company.display_name || "",
        business_type: company.businessType || company.business_type || "Retail & Wholesale Boutique",
        industry_type: company.industryType || company.industry_type || "Apparel & Textiles",
        registration_number: company.registrationNumber || company.registration_number || "",
        email: company.email || "",
        phone: company.phone || "",
        mobile: company.mobile || "",
        website: company.website || "",
        logo_url: company.logoUrl || company.logo_url || "",
        default_currency: company.defaultCurrency || company.default_currency || "INR",
        country_code: company.countryCode || company.country_code || "IN",
        timezone: company.timezone || "Asia/Kolkata",
        financial_year_start_month: company.financialYearStartMonth || company.financial_year_start_month || 4,
        status: company.status || "active",
      });
      setErrors({});
    } else {
      setFormData(initialFormState);
      setErrors({});
    }
    setActiveTab("identity");
    setUploadError("");
  }, [company, isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const processImageFile = (file) => {
    setUploadError("");
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload a valid image file (PNG, JPG, WebP, SVG).");
      return;
    }
    // Limit to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Image size exceeds 10MB limit. Please upload a smaller image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setFormData((prev) => ({
        ...prev,
        logo_url: dataUrl,
      }));
    };
    reader.onerror = () => {
      setUploadError("Failed to read image file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      logo_url: "",
    }));
    setUploadError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "company_code") {
      formattedValue = value.toUpperCase().replace(/[^A-Z0-9_-]/g, "");
    }
    if (name === "financial_year_start_month") {
      formattedValue = Number(value);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.company_code || formData.company_code.trim().length < 2) {
      newErrors.company_code = "Company code must be at least 2 characters (alphanumeric, -, _).";
    }
    if (!formData.company_name || formData.company_name.trim().length < 2) {
      newErrors.company_name = "Company name must be at least 2 characters.";
    }
    if (formData.email && formData.email.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please provide a valid email address.";
      }
    }
    if (formData.default_currency && formData.default_currency.length !== 3) {
      newErrors.default_currency = "Currency code must be exactly 3 characters (e.g. INR).";
    }
    if (formData.country_code && formData.country_code.length !== 2) {
      newErrors.country_code = "Country code must be exactly 2 characters (e.g. IN).";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      company_code: formData.company_code.trim().toUpperCase(),
      company_name: formData.company_name.trim(),
      legal_name: formData.legal_name.trim() || null,
      display_name: formData.display_name.trim() || null,
      business_type: formData.business_type.trim() || null,
      industry_type: formData.industry_type.trim() || null,
      registration_number: formData.registration_number.trim() || null,
      email: formData.email.trim() || null,
      phone: formData.phone.trim() || null,
      mobile: formData.mobile.trim() || null,
      website: formData.website.trim() || null,
      logo_url: formData.logo_url.trim() || null,
      default_currency: formData.default_currency.trim().toUpperCase() || "INR",
      country_code: formData.country_code.trim().toUpperCase() || "IN",
      timezone: formData.timezone.trim() || "Asia/Kolkata",
      financial_year_start_month: Number(formData.financial_year_start_month) || 4,
      status: formData.status,
    };

    onSubmit(payload);
  };

  const tabs = [
    { id: "identity", label: "Identity", icon: Building2 },
    { id: "business", label: "Business & Tax", icon: FileText },
    { id: "contact", label: "Contact & Web", icon: Mail },
    { id: "locale", label: "Currency & Fiscal", icon: DollarSign },
  ];

  const inputClass = (hasError) =>
    `w-full px-3 py-2 text-[13.5px] rounded-lg border bg-base-200/50 text-base-content placeholder-base-content/40 focus:outline-none focus:ring-[3px] transition-colors ${hasError
      ? "border-rose-400 focus:border-rose-400 focus:ring-rose-500/20"
      : "border-base-300 focus:border-primary focus:ring-primary/20 focus:bg-base-100"
    }`;

  const labelClass = "block text-[12.5px] font-medium text-base-content/80 mb-1.5 tracking-[-0.01em]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-base-100 rounded-2xl shadow-2xl border border-base-300 overflow-hidden flex flex-col max-h-[90vh] font-[450] antialiased text-base-content">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-base-200">
          <div>
            <h3 className="font-semibold text-base-content text-[17px] tracking-[-0.015em] leading-tight">
              {isEdit ? "Edit company" : "Register new company"}
            </h3>
            <p className="text-[13px] text-base-content/60 mt-1">
              {isEdit
                ? `Updating configuration for ${formData.company_code}`
                : "Create a boutique branch or multi-store entity"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 -mr-1.5 rounded-lg text-base-content/50 hover:text-base-content hover:bg-base-200 transition-colors"
          >
            <X className="w-[18px] h-[18px]" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 px-6 py-2.5 border-b border-base-300 bg-base-200/40 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-primary text-primary-content shadow-sm shadow-primary/20"
                    : "text-base-content/60 hover:text-base-content hover:bg-base-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" strokeWidth={2} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* TAB 1: IDENTITY */}
          {activeTab === "identity" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    Company code <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="company_code"
                    value={formData.company_code}
                    onChange={handleChange}
                    placeholder="e.g. PFS001"
                    maxLength={50}
                    className={`${inputClass(errors.company_code)} font-mono tracking-wide`}
                  />
                  {errors.company_code && (
                    <p className="text-[11.5px] text-rose-500 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.company_code}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Used across POS invoices and accounting.
                  </p>
                </div>

                <div>
                  <label className={labelClass}>
                    Company name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder="e.g. Pooja Fashion Sarees"
                    className={inputClass(errors.company_name)}
                  />
                  {errors.company_name && (
                    <p className="text-[11.5px] text-rose-500 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.company_name}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Legal / registered name</label>
                  <input
                    type="text"
                    name="legal_name"
                    value={formData.legal_name}
                    onChange={handleChange}
                    placeholder="e.g. Pooja Fashion Shop Private Limited"
                    className={inputClass(false)}
                  />
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Printed on statutory GST tax invoices.
                  </p>
                </div>

                <div>
                  <label className={labelClass}>Display name</label>
                  <input
                    type="text"
                    name="display_name"
                    value={formData.display_name}
                    onChange={handleChange}
                    placeholder="e.g. Pooja Fashion"
                    className={inputClass(false)}
                  />
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Shown in navigation and dashboard headers.
                  </p>
                </div>
              </div>

              <div>
                <label className={`${labelClass} mb-2`}>Operating status</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    {
                      id: "active",
                      label: "Active",
                      desc: "Operational, billing ready",
                      icon: CheckCircle2,
                      accent: "text-emerald-600",
                      ring: "border-emerald-300 bg-emerald-50/40 ring-1 ring-emerald-200",
                    },
                    {
                      id: "inactive",
                      label: "Inactive",
                      desc: "Temporarily dormant",
                      icon: PauseCircle,
                      accent: "text-amber-600",
                      ring: "border-amber-300 bg-amber-50/40 ring-1 ring-amber-200",
                    },
                    {
                      id: "suspended",
                      label: "Suspended",
                      desc: "Transactions locked",
                      icon: Ban,
                      accent: "text-rose-600",
                      ring: "border-rose-300 bg-rose-50/40 ring-1 ring-rose-200",
                    },
                  ].map((st) => {
                    const Icon = st.icon;
                    const isSelected = formData.status === st.id;

                    return (
                      <label
                        key={st.id}
                        className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors select-none ${isSelected
                            ? st.ring
                            : "bg-base-200/50 border-base-300 hover:bg-base-200"
                          }`}
                      >
                        <input
                          type="radio"
                          name="status"
                          value={st.id}
                          checked={isSelected}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <Icon
                          className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? st.accent : "text-base-content/40"}`}
                          strokeWidth={2}
                        />
                        <div>
                          <div className={`text-[13px] font-medium ${isSelected ? "text-base-content font-bold" : "text-base-content/70"}`}>
                            {st.label}
                          </div>
                          <p className="text-[11.5px] text-base-content/50 mt-0.5 leading-snug">
                            {st.desc}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Brand Logo / Profile Image Section */}
              <div className="p-4 sm:p-5 rounded-2xl bg-base-200/50 border border-base-300 space-y-3.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className={`${labelClass} mb-0 flex items-center gap-2 font-bold`}>
                    <Camera className="w-4 h-4 text-primary" />
                    <span>Company Brand Logo / Emblem</span>
                  </label>
                  <span className="text-[11px] font-mono text-base-content/50">
                    High Quality • PNG, JPG, WebP, SVG (Max 10MB)
                  </span>
                </div>

                {/* Dropzone & Preview Box */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative p-4 rounded-xl border-2 border-dashed transition-all ${
                    isDragging
                      ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                      : "border-base-300 bg-base-100 hover:border-primary/50"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Interactive Preview Thumbnail with Click-to-View Overlay */}
                    <div className="relative group shrink-0">
                      <div
                        onClick={() => {
                          if (formData.logo_url || "/images/pooja-fashion-logo.jpg") {
                            setIsImageViewerOpen(true);
                          }
                        }}
                        title="Click to view high-resolution image"
                        className="w-20 h-20 rounded-2xl bg-base-200 border-2 border-primary/20 shadow-md overflow-hidden flex items-center justify-center cursor-pointer relative group-hover:shadow-lg group-hover:border-primary transition-all"
                      >
                        <img
                          src={formData.logo_url || "/images/pooja-fashion-logo.jpg"}
                          alt="Brand Logo Preview"
                          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            if (e.currentTarget.nextElementSibling) {
                              e.currentTarget.nextElementSibling.style.display = "flex";
                            }
                          }}
                        />
                        <span className="hidden w-full h-full items-center justify-center bg-primary text-primary-content font-black text-xl">
                          {formData.company_name?.slice(0, 2).toUpperCase() || "PF"}
                        </span>

                        {/* Hover Overlay with Eye / Zoom Icon */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white p-1 text-center backdrop-blur-2xs">
                          <Maximize2 className="w-5 h-5 text-amber-300 animate-pulse" />
                          <span className="text-[10px] font-bold leading-tight">Click to View HD</span>
                        </div>
                      </div>

                      {/* Small badge if custom image is loaded */}
                      {formData.logo_url && (
                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-success text-success-content flex items-center justify-center shadow-xs">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    {/* Upload Controls & Actions */}
                    <div className="flex-1 text-center sm:text-left space-y-2 min-w-0">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <Button
                          type="button"
                          variant="clip-six"
                          size="sm"
                          icon={UploadCloud}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Upload Image File
                        </Button>

                        <button
                          type="button"
                          onClick={() => setIsImageViewerOpen(true)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-base-200 hover:bg-base-300 text-base-content border border-base-300 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-primary" />
                          Click to View HD
                        </button>

                        {formData.logo_url && (
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            title="Remove uploaded image"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 border border-rose-300/40 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        )}
                      </div>

                      <p className="text-xs text-base-content/60">
                        Select or drag & drop high-resolution PNG, JPG, or SVG emblem file. Click the preview to inspect in full HD.
                      </p>
                    </div>
                  </div>

                  {uploadError && (
                    <div className="mt-2.5 p-2 rounded-lg bg-rose-500/10 border border-rose-300/40 text-rose-600 text-xs flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}
                </div>

                {/* Secondary Option: Preset Emblem or Direct URL */}
                <div className="pt-1 flex flex-col sm:flex-row items-center gap-2">
                  <div className="relative flex-1 w-full">
                    <input
                      type="text"
                      name="logo_url"
                      value={formData.logo_url}
                      onChange={handleChange}
                      placeholder="Or enter image URL (e.g. /images/pooja-fashion-logo.jpg)"
                      className={`${inputClass(false)} text-xs`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        logo_url: "/images/pooja-fashion-logo.jpg",
                      }));
                      setUploadError("");
                    }}
                    className="w-full sm:w-auto px-3.5 py-2 text-xs font-semibold rounded-lg bg-base-200 hover:bg-base-300 text-base-content border border-base-300 shrink-0 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Use Boutique Emblem
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BUSINESS & TAX */}
          {activeTab === "business" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Business type</label>
                  <input
                    type="text"
                    name="business_type"
                    value={formData.business_type}
                    onChange={handleChange}
                    placeholder="e.g. Retail, Wholesale, Boutique"
                    className={inputClass(false)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Industry / sector</label>
                  <input
                    type="text"
                    name="industry_type"
                    value={formData.industry_type}
                    onChange={handleChange}
                    placeholder="e.g. Fashion & Garments, Silk Sarees"
                    className={inputClass(false)}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Registration number / GSTIN / CIN</label>
                <input
                  type="text"
                  name="registration_number"
                  value={formData.registration_number}
                  onChange={handleChange}
                  placeholder="e.g. 33AAAAA0000A1Z5"
                  className={`${inputClass(false)} font-mono tracking-wide`}
                />
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Required for GST compliance and B2B invoices.
                </p>
              </div>

              <div>
                <label className={labelClass}>Logo URL</label>
                <input
                  type="url"
                  name="logo_url"
                  value={formData.logo_url}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
                  className={inputClass(false)}
                />
              </div>
            </div>
          )}

          {/* TAB 3: CONTACT & WEB */}
          {activeTab === "contact" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Corporate email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contact@poojafashion.com"
                    className={inputClass(errors.email)}
                  />
                  {errors.email && (
                    <p className="text-[11.5px] text-rose-500 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Website</label>
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://poojafashion.com"
                    className={inputClass(false)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Office / landline phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 44 2828 1234"
                    className={inputClass(false)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Store manager mobile</label>
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className={inputClass(false)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CURRENCY & FISCAL */}
          {activeTab === "locale" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    Default currency (ISO) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="default_currency"
                    value={formData.default_currency}
                    onChange={handleChange}
                    maxLength={3}
                    placeholder="INR"
                    className={`${inputClass(false)} font-mono uppercase tracking-wide`}
                  />
                  <p className="text-[11px] text-slate-400 mt-1.5">3-letter code — INR, USD, EUR.</p>
                </div>
                <div>
                  <label className={labelClass}>
                    Country code (ISO 3166-1) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="country_code"
                    value={formData.country_code}
                    onChange={handleChange}
                    maxLength={2}
                    placeholder="IN"
                    className={`${inputClass(false)} font-mono uppercase tracking-wide`}
                  />
                  <p className="text-[11px] text-slate-400 mt-1.5">2-letter alpha code — IN, US, AE.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Store timezone</label>
                  <select
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                    className={`${inputClass(false)} cursor-pointer`}
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                    <option value="Asia/Dubai">Asia/Dubai (GST +4:00)</option>
                    <option value="Asia/Singapore">Asia/Singapore (SGT +8:00)</option>
                    <option value="Europe/London">Europe/London (GMT/BST)</option>
                    <option value="America/New_York">America/New_York (EST/EDT)</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Financial year starts</label>
                  <select
                    name="financial_year_start_month"
                    value={formData.financial_year_start_month}
                    onChange={handleChange}
                    className={`${inputClass(false)} cursor-pointer`}
                  >
                    <option value={1}>January (calendar year)</option>
                    <option value={4}>April (standard Indian fiscal year)</option>
                    <option value={7}>July</option>
                    <option value={10}>October</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="pt-4 mt-1 border-t border-base-200 flex items-center justify-between gap-3">
            <div className="text-[11.5px] text-base-content/50">
              <span className="text-rose-400">*</span> Required fields
            </div>

            <div className="flex items-center gap-2">
              <Button variant="secondary" size="md" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="clip-six" size="md" loading={isSubmitting} icon={Save}>
                {isEdit ? "Save changes" : "Create company"}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* High-Resolution Fullscreen Image Viewer Lightbox */}
      <ImageViewerModal
        isOpen={isImageViewerOpen}
        onClose={() => setIsImageViewerOpen(false)}
        src={formData.logo_url || "/images/pooja-fashion-logo.jpg"}
        title={formData.company_name || "Company Brand Logo"}
        subtitle={`${formData.company_code || "PFS"} • High Definition Preview`}
      />
    </div>
  );
}