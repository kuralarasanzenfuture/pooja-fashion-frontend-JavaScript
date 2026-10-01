import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Landmark,
  Save,
  AlertCircle,
  Globe,
  Phone,
  ShieldCheck,
  Building,
  CheckCircle2,
  Upload,
  Image as ImageIcon,
  Trash2,
  Sparkles,
  Eye,
  Sun,
  Moon,
  Hash,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "../../../common/components/ui/buttons/index.js";
import { DropdownSelect } from "../../../common/components/ui/select/index.js";
import BankLogo, { getBankPresetKey } from "./BankLogo.jsx";
import { useModalAnimation } from "../../../common/hooks/useModalAnimation.js";

// Aligned with the database schema: bank_type IN ('commercial', 'cooperative', 'regional_rural', 'small_finance', 'payments', 'foreign', 'other')
const BANK_TYPES = [
  { value: "commercial", label: "Scheduled Commercial Bank", badge: "Commercial", description: "Public & private sector commercial institutions" },
  { value: "cooperative", label: "Cooperative / Urban Bank", badge: "Co-op", description: "Urban & rural cooperative credit institutions" },
  { value: "regional_rural", label: "Regional Rural Bank (RRB)", badge: "RRB", description: "State & central sponsored rural banks" },
  { value: "small_finance", label: "Small Finance Bank (SFB)", badge: "SFB", description: "Financial inclusion & small business focus" },
  { value: "payments", label: "Payments Bank", badge: "Payments", description: "RBI licensed payments banking institutions" },
  { value: "foreign", label: "Foreign Commercial Bank", badge: "Foreign", description: "International banking corporation branches" },
  { value: "other", label: "Other Financial Institution", badge: "Other", description: "Development banks, NBFCs, or specialized credit entities" },
];

export const EXTENDED_BANK_PRESETS = [
  {
    bankName: "Bank of Baroda",
    bankCode: "BOB",
    shortName: "Bank of Baroda",
    legalName: "Bank of Baroda Ltd.",
    bankType: "commercial",
    websiteUrl: "https://www.bankofbaroda.in",
    countryCode: "IN",
    displayOrder: 1,
    ifscPrefix: "BARB",
    swiftCode: "BARBINBBXXX",
    headquartersCity: "Vadodara",
    customerCareNumber: "1800 258 4455",
  },
  {
    bankName: "State Bank of India",
    bankCode: "SBI",
    shortName: "SBI",
    legalName: "State Bank of India",
    bankType: "commercial",
    websiteUrl: "https://www.sbi.co.in",
    countryCode: "IN",
    displayOrder: 2,
    ifscPrefix: "SBIN",
    swiftCode: "SBININBBXXX",
    headquartersCity: "Mumbai",
    customerCareNumber: "1800 1234",
  },
  {
    bankName: "HDFC Bank",
    bankCode: "HDFC",
    shortName: "HDFC Bank",
    legalName: "HDFC Bank Limited",
    bankType: "commercial",
    websiteUrl: "https://www.hdfcbank.com",
    countryCode: "IN",
    displayOrder: 3,
    ifscPrefix: "HDFC",
    swiftCode: "HDFCINBBXXX",
    headquartersCity: "Mumbai",
    customerCareNumber: "1800 202 6161",
  },
  {
    bankName: "ICICI Bank",
    bankCode: "ICICI",
    shortName: "ICICI Bank",
    legalName: "ICICI Bank Limited",
    bankType: "commercial",
    websiteUrl: "https://www.icicibank.com",
    countryCode: "IN",
    displayOrder: 4,
    ifscPrefix: "ICIC",
    swiftCode: "ICICINBBXXX",
    headquartersCity: "Mumbai",
    customerCareNumber: "1800 1080",
  },
  {
    bankName: "Bank of India",
    bankCode: "BKID",
    shortName: "BOI",
    legalName: "Bank of India",
    bankType: "commercial",
    websiteUrl: "https://www.bankofindia.co.in",
    countryCode: "IN",
    displayOrder: 5,
    ifscPrefix: "BKID",
    swiftCode: "BKIDINBBXXX",
    headquartersCity: "Mumbai",
    customerCareNumber: "1800 220 229",
  },
  {
    bankName: "Indian Bank",
    bankCode: "IDIB",
    shortName: "Indian Bank",
    legalName: "Indian Bank",
    bankType: "commercial",
    websiteUrl: "https://www.indianbank.in",
    countryCode: "IN",
    displayOrder: 6,
    ifscPrefix: "IDIB",
    swiftCode: "IDIBINBBXXX",
    headquartersCity: "Chennai",
    customerCareNumber: "1800 425 00 000",
  },
  {
    bankName: "Central Bank of India",
    bankCode: "CBIN",
    shortName: "Central Bank",
    legalName: "Central Bank of India",
    bankType: "commercial",
    websiteUrl: "https://www.centralbankofindia.co.in",
    countryCode: "IN",
    displayOrder: 7,
    ifscPrefix: "CBIN",
    swiftCode: "CBININBBXXX",
    headquartersCity: "Mumbai",
    customerCareNumber: "1800 22 1911",
  },
  {
    bankName: "Indian Overseas Bank",
    bankCode: "IOBA",
    shortName: "IOB",
    legalName: "Indian Overseas Bank",
    bankType: "commercial",
    websiteUrl: "https://www.iob.in",
    countryCode: "IN",
    displayOrder: 8,
    ifscPrefix: "IOBA",
    swiftCode: "IOBAINBBXXX",
    headquartersCity: "Chennai",
    customerCareNumber: "1800 425 4445",
  },
  {
    bankName: "UCO Bank",
    bankCode: "UCBA",
    shortName: "UCO Bank",
    legalName: "UCO Bank",
    bankType: "commercial",
    websiteUrl: "https://www.ucobank.com",
    countryCode: "IN",
    displayOrder: 9,
    ifscPrefix: "UCBA",
    swiftCode: "UCBAINBBXXX",
    headquartersCity: "Kolkata",
    customerCareNumber: "1800 103 0123",
  },
  {
    bankName: "Bank of Maharashtra",
    bankCode: "MAHB",
    shortName: "Bank of Maharashtra",
    legalName: "Bank of Maharashtra",
    bankType: "commercial",
    websiteUrl: "https://www.bankofmaharashtra.in",
    countryCode: "IN",
    displayOrder: 10,
    ifscPrefix: "MAHB",
    swiftCode: "MAHBINBBXXX",
    headquartersCity: "Pune",
    customerCareNumber: "1800 233 4526",
  },
  {
    bankName: "Punjab & Sind Bank",
    bankCode: "PSIB",
    shortName: "Punjab & Sind Bank",
    legalName: "Punjab & Sind Bank",
    bankType: "commercial",
    websiteUrl: "https://punjabandsindbank.co.in",
    countryCode: "IN",
    displayOrder: 11,
    ifscPrefix: "PSIB",
    swiftCode: "PSIBINBBXXX",
    headquartersCity: "New Delhi",
    customerCareNumber: "1800 419 8300",
  },
  {
    bankName: "Axis Bank",
    bankCode: "AXIS",
    shortName: "Axis Bank",
    legalName: "Axis Bank Limited",
    bankType: "commercial",
    websiteUrl: "https://www.axisbank.com",
    countryCode: "IN",
    displayOrder: 12,
    ifscPrefix: "UTIB",
    swiftCode: "UTIBINBBXXX",
    headquartersCity: "Mumbai",
    customerCareNumber: "1860 419 5555",
  },
  {
    bankName: "Canara Bank",
    bankCode: "CANARA",
    shortName: "Canara Bank",
    legalName: "Canara Bank",
    bankType: "commercial",
    websiteUrl: "https://www.canarabank.com",
    countryCode: "IN",
    displayOrder: 13,
    ifscPrefix: "CNRB",
    swiftCode: "CNRBINBBXXX",
    headquartersCity: "Bengaluru",
    customerCareNumber: "1800 425 0018",
  },
  {
    bankName: "Kotak Mahindra Bank",
    bankCode: "KOTAK",
    shortName: "Kotak",
    legalName: "Kotak Mahindra Bank Ltd.",
    bankType: "commercial",
    websiteUrl: "https://www.kotak.com",
    countryCode: "IN",
    displayOrder: 14,
    ifscPrefix: "KKBK",
    swiftCode: "KKBKINBBXXX",
    headquartersCity: "Mumbai",
    customerCareNumber: "1860 266 2666",
  },
  {
    bankName: "Punjab National Bank",
    bankCode: "PNB",
    shortName: "PNB",
    legalName: "Punjab National Bank",
    bankType: "commercial",
    websiteUrl: "https://www.pnbindia.in",
    countryCode: "IN",
    displayOrder: 15,
    ifscPrefix: "PUNB",
    swiftCode: "PUNBINBBXXX",
    headquartersCity: "New Delhi",
    customerCareNumber: "1800 180 2222",
  },
  {
    bankName: "Union Bank of India",
    bankCode: "UNION",
    shortName: "Union Bank",
    legalName: "Union Bank of India",
    bankType: "commercial",
    websiteUrl: "https://www.unionbankofindia.co.in",
    countryCode: "IN",
    displayOrder: 16,
    ifscPrefix: "UBIN",
    swiftCode: "UBININBBXXX",
    headquartersCity: "Mumbai",
    customerCareNumber: "1800 22 22 44",
  },
  // Small Finance Banks
  {
    bankName: "AU Small Finance Bank",
    bankCode: "AUBL",
    shortName: "AU Bank",
    legalName: "AU Small Finance Bank Limited",
    bankType: "small_finance",
    websiteUrl: "https://www.aubank.in",
    countryCode: "IN",
    displayOrder: 17,
    ifscPrefix: "AUBL",
    swiftCode: "AUBLINBBXXX",
    headquartersCity: "Jaipur",
    customerCareNumber: "1800 1200 1300",
  },
  {
    bankName: "Equitas Small Finance Bank",
    bankCode: "ESFB",
    shortName: "Equitas",
    legalName: "Equitas Small Finance Bank Ltd.",
    bankType: "small_finance",
    websiteUrl: "https://www.equitasbank.com",
    countryCode: "IN",
    displayOrder: 18,
    ifscPrefix: "ESFB",
    swiftCode: "ESFBINBBXXX",
    headquartersCity: "Chennai",
    customerCareNumber: "1800 103 1222",
  },
  // Cooperative Banks
  {
    bankName: "Saraswat Cooperative Bank",
    bankCode: "SRCB",
    shortName: "Saraswat Bank",
    legalName: "Saraswat Co-operative Bank Ltd.",
    bankType: "cooperative",
    websiteUrl: "https://www.saraswatbank.com",
    countryCode: "IN",
    displayOrder: 19,
    ifscPrefix: "SRCB",
    swiftCode: "SRCBINBBXXX",
    headquartersCity: "Mumbai",
    customerCareNumber: "1800 22 9999",
  },
  {
    bankName: "Cosmos Cooperative Bank",
    bankCode: "COSB",
    shortName: "Cosmos Bank",
    legalName: "The Cosmos Co-operative Bank Ltd.",
    bankType: "cooperative",
    websiteUrl: "https://www.cosmosbank.com",
    countryCode: "IN",
    displayOrder: 20,
    ifscPrefix: "COSB",
    swiftCode: "COSBINBBXXX",
    headquartersCity: "Pune",
    customerCareNumber: "1800 233 0234",
  },
  // Payments Banks
  {
    bankName: "Airtel Payments Bank",
    bankCode: "AIRP",
    shortName: "Airtel Bank",
    legalName: "Airtel Payments Bank Limited",
    bankType: "payments",
    websiteUrl: "https://www.airtel.in/bank",
    countryCode: "IN",
    displayOrder: 21,
    ifscPrefix: "AIRP",
    swiftCode: "AIRPINBBXXX",
    headquartersCity: "New Delhi",
    customerCareNumber: "400",
  },
  {
    bankName: "India Post Payments Bank",
    bankCode: "IPPB",
    shortName: "IPPB",
    legalName: "India Post Payments Bank Limited",
    bankType: "payments",
    websiteUrl: "https://www.ippbonline.com",
    countryCode: "IN",
    displayOrder: 22,
    ifscPrefix: "IPOS",
    swiftCode: "IPOSINBBXXX",
    headquartersCity: "New Delhi",
    customerCareNumber: "155299",
  },
  // Regional Rural Banks (RRB)
  {
    bankName: "Aryavart Bank",
    bankCode: "ARYA",
    shortName: "Aryavart Bank",
    legalName: "Aryavart Regional Rural Bank",
    bankType: "regional_rural",
    websiteUrl: "https://aryavart-rrb.com",
    countryCode: "IN",
    displayOrder: 23,
    ifscPrefix: "ARYA",
    swiftCode: "ARYAINBBXXX",
    headquartersCity: "Lucknow",
    customerCareNumber: "1800 102 0304",
  },
  {
    bankName: "Kerala Gramin Bank",
    bankCode: "KLGB",
    shortName: "KGB",
    legalName: "Kerala Gramin Bank",
    bankType: "regional_rural",
    websiteUrl: "https://keralagbank.com",
    countryCode: "IN",
    displayOrder: 24,
    ifscPrefix: "KLGB",
    swiftCode: "KLGBINBBXXX",
    headquartersCity: "Malappuram",
    customerCareNumber: "1800 425 2422",
  },
  // Foreign Banks
  {
    bankName: "Standard Chartered Bank",
    bankCode: "SCBL",
    shortName: "StanChart",
    legalName: "Standard Chartered Bank (India)",
    bankType: "foreign",
    websiteUrl: "https://www.sc.com/in",
    countryCode: "GB",
    displayOrder: 25,
    ifscPrefix: "SCBL",
    swiftCode: "SCBLINBBXXX",
    headquartersCity: "Mumbai / London",
    customerCareNumber: "1800 345 1000",
  },
];

/**
 * BankModal Component
 * Implements complete PostgreSQL `banks` schema:
 * bank_code, bank_name, short_name, legal_name, bank_type,
 * logo_url, logo_light_url, logo_dark_url, website_url,
 * country_code, is_active, is_verified, display_order, metadata.
 */
export default function BankModal({
  isOpen = false,
  onClose,
  bank = null,
  initialBankName = "",
  onSubmit,
  isSubmitting = false,
}) {
  const isEdit = Boolean(bank?.id);
  const { isRendered, handleClose, backdropClasses, cardClasses } = useModalAnimation(isOpen, onClose);
  const primaryFileInputRef = useRef(null);
  const lightFileInputRef = useRef(null);
  const darkFileInputRef = useRef(null);

  const initialFormState = {
    bank_name: initialBankName || "",
    bank_code: "",
    short_name: "",
    legal_name: "",
    bank_type: "commercial",
    logo_url: "",
    logo_light_url: "",
    logo_dark_url: "",
    website_url: "",
    country_code: "IN",
    is_active: true,
    is_verified: true,
    display_order: 0,
    // Metadata JSON auxiliary fields
    ifsc_prefix: "",
    swift_code: "",
    headquarters_city: "",
    customer_care_number: "",
    notes: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [showAdvancedLogos, setShowAdvancedLogos] = useState(false);
  const [previewTheme, setPreviewTheme] = useState("light"); // 'light' | 'dark'
  const [lightboxImageUrl, setLightboxImageUrl] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (bank) {
        const meta = bank.metadata || {};
        setFormData({
          bank_name: bank.bankName || bank.bank_name || "",
          bank_code: bank.bankCode || bank.bank_code || "",
          short_name: bank.shortName || bank.short_name || "",
          legal_name: bank.legalName || bank.legal_name || "",
          bank_type: (bank.bankType || bank.bank_type || "commercial").toLowerCase(),
          logo_url: bank.logoUrl || bank.logo_url || "",
          logo_light_url: bank.logoLightUrl || bank.logo_light_url || "",
          logo_dark_url: bank.logoDarkUrl || bank.logo_dark_url || "",
          website_url: bank.websiteUrl || bank.website_url || bank.website || "",
          country_code: (bank.countryCode || bank.country_code || "IN").toUpperCase(),
          is_active: Boolean(bank.isActive ?? bank.is_active ?? true),
          is_verified: Boolean(bank.isVerified ?? bank.is_verified ?? true),
          display_order: Number(bank.displayOrder ?? bank.display_order ?? 0),
          // Metadata fields
          ifsc_prefix: bank.ifscPrefix || bank.ifsc_prefix || meta.ifsc_prefix || "",
          swift_code: bank.swiftCode || bank.swift_code || meta.swift_code || "",
          headquarters_city: bank.headquartersCity || bank.headquarters_city || meta.headquarters_city || "",
          customer_care_number: bank.customerCareNumber || bank.customer_care_number || meta.customer_care_number || "",
          notes: bank.notes || meta.notes || "",
        });
        if (bank.logoLightUrl || bank.logo_light_url || bank.logoDarkUrl || bank.logo_dark_url) {
          setShowAdvancedLogos(true);
        }
      } else {
        const matched = initialBankName
          ? EXTENDED_BANK_PRESETS.find(
              (p) => p.bankName.toLowerCase() === initialBankName.toLowerCase().trim()
            )
          : null;

        if (matched) {
          setFormData({
            ...initialFormState,
            bank_name: matched.bankName,
            bank_code: matched.bankCode,
            short_name: matched.shortName || "",
            legal_name: matched.legalName || "",
            bank_type: matched.bankType || "commercial",
            website_url: matched.websiteUrl || "",
            country_code: matched.countryCode || "IN",
            display_order: matched.displayOrder || 0,
            ifsc_prefix: matched.ifscPrefix || "",
            swift_code: matched.swiftCode || "",
            headquarters_city: matched.headquartersCity || "",
            customer_care_number: matched.customerCareNumber || "",
          });
        } else {
          setFormData({
            ...initialFormState,
            bank_name: initialBankName || "",
          });
        }
      }
      setErrors({});
      setUploadError("");
    }
  }, [isOpen, bank, initialBankName]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let nextVal = type === "checkbox" ? checked : value;

    if (name === "display_order") {
      nextVal = Math.max(0, parseInt(value, 10) || 0);
    } else if (name === "country_code" && typeof nextVal === "string") {
      nextVal = nextVal.toUpperCase().slice(0, 2);
    } else if (["bank_code", "swift_code", "ifsc_prefix"].includes(name) && typeof nextVal === "string") {
      nextVal = nextVal.toUpperCase().trim();
    }

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: nextVal,
      };

      // Auto-detect when typing bank name if fields are untouched
      if (name === "bank_name" && typeof nextVal === "string" && !prev.bank_code) {
        const found = EXTENDED_BANK_PRESETS.find(
          (p) => p.bankName.toLowerCase() === nextVal.toLowerCase().trim()
        );
        if (found) {
          updated.bank_code = found.bankCode;
          if (!prev.short_name) updated.short_name = found.shortName;
          if (!prev.legal_name) updated.legal_name = found.legalName;
          if (!prev.website_url) updated.website_url = found.websiteUrl;
          if (!prev.ifsc_prefix) updated.ifsc_prefix = found.ifscPrefix;
          if (!prev.swift_code) updated.swift_code = found.swiftCode;
          if (!prev.headquarters_city) updated.headquarters_city = found.headquartersCity;
          if (!prev.customer_care_number) updated.customer_care_number = found.customerCareNumber;
          if (found.displayOrder && !prev.display_order) updated.display_order = found.displayOrder;
        }
      }

      return updated;
    });

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // Image Upload processor
  const processImageFile = (file, targetField = "logo_url") => {
    setUploadError("");
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload a valid image file (PNG, JPG, WebP, SVG).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setUploadError("Image size exceeds 8MB limit. Please upload a smaller logo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({
        ...prev,
        [targetField]: event.target.result,
      }));
    };
    reader.onerror = () => {
      setUploadError("Failed to read image file.");
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

  const handleDrop = (e, targetField = "logo_url") => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file, targetField);
  };

  const applyPreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      bank_name: preset.bankName,
      bank_code: preset.bankCode,
      short_name: preset.shortName || preset.bankCode,
      legal_name: preset.legalName || "",
      bank_type: preset.bankType || "commercial",
      website_url: preset.websiteUrl || "",
      country_code: preset.countryCode || "IN",
      display_order: preset.displayOrder || prev.display_order,
      ifsc_prefix: preset.ifscPrefix || "",
      swift_code: preset.swiftCode || prev.swift_code,
      headquarters_city: preset.headquartersCity || prev.headquarters_city,
      customer_care_number: preset.customerCareNumber || prev.customer_care_number,
      logo_url: "", // Resets to display official vector brand logo
    }));
    setErrors({});
  };

  const validate = () => {
    const errs = {};
    if (!formData.bank_name?.trim()) errs.bank_name = "Bank name is required";
    if (!formData.bank_code?.trim()) errs.bank_code = "Bank code is required (e.g. HDFC, SBI, BKID)";
    if (formData.display_order < 0) errs.display_order = "Display order must be 0 or greater";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Metadata JSON structure for auxiliary fields
    const metadataPayload = {
      ifsc_prefix: formData.ifsc_prefix?.trim() ? formData.ifsc_prefix.trim().toUpperCase() : null,
      swift_code: formData.swift_code?.trim() ? formData.swift_code.trim().toUpperCase() : null,
      headquarters_city: formData.headquarters_city?.trim() || null,
      customer_care_number: formData.customer_care_number?.trim() || null,
      notes: formData.notes?.trim() || null,
    };

    // Full dual-cased payload satisfying the PostgreSQL banks schema & API handlers
    const payload = {
      // 1. EXACT PostgreSQL Schema Columns
      bank_code: formData.bank_code.trim().toUpperCase(),
      bank_name: formData.bank_name.trim(),
      short_name: formData.short_name?.trim() || null,
      legal_name: formData.legal_name?.trim() || null,
      bank_type: formData.bank_type || "commercial",
      logo_url: formData.logo_url?.trim() || null,
      logo_light_url: formData.logo_light_url?.trim() || null,
      logo_dark_url: formData.logo_dark_url?.trim() || null,
      website_url: formData.website_url?.trim() || null,
      country_code: (formData.country_code || "IN").trim().toUpperCase(),
      is_active: Boolean(formData.is_active),
      is_verified: Boolean(formData.is_verified),
      display_order: Number(formData.display_order || 0),
      metadata: metadataPayload,

      // 2. Direct top-level fields for legacy backend endpoints
      ifsc_prefix: metadataPayload.ifsc_prefix,
      swift_code: metadataPayload.swift_code,
      headquarters_city: metadataPayload.headquarters_city,
      customer_care_number: metadataPayload.customer_care_number,
      website: formData.website_url?.trim() || null,
      notes: metadataPayload.notes,

      // 3. CamelCase aliases
      bankCode: formData.bank_code.trim().toUpperCase(),
      bankName: formData.bank_name.trim(),
      shortName: formData.short_name?.trim() || null,
      legalName: formData.legal_name?.trim() || null,
      bankType: formData.bank_type || "commercial",
      logoUrl: formData.logo_url?.trim() || null,
      logoLightUrl: formData.logo_light_url?.trim() || null,
      logoDarkUrl: formData.logo_dark_url?.trim() || null,
      websiteUrl: formData.website_url?.trim() || null,
      countryCode: (formData.country_code || "IN").trim().toUpperCase(),
      isActive: Boolean(formData.is_active),
      isVerified: Boolean(formData.is_verified),
      displayOrder: Number(formData.display_order || 0),
      ifscPrefix: metadataPayload.ifsc_prefix,
      swiftCode: metadataPayload.swift_code,
      headquartersCity: metadataPayload.headquarters_city,
      customerCareNumber: metadataPayload.customer_care_number,
    };

    onSubmit(payload);
  };

  const inputClass = (hasError) =>
    `w-full px-3.5 py-2.5 text-sm rounded-xl border bg-base-100 placeholder:text-base-content/40 transition-all outline-hidden font-medium ${
      hasError
        ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20 text-rose-600"
        : "border-base-300 focus:border-primary focus:ring-1 focus:ring-primary/20 text-base-content"
    }`;

  const labelClass = "block text-xs font-semibold text-base-content/75 mb-1";

  // Determines which logo URL to display in preview
  const activeLogoToPreview =
    previewTheme === "dark" && formData.logo_dark_url
      ? formData.logo_dark_url
      : previewTheme === "light" && formData.logo_light_url
      ? formData.logo_light_url
      : formData.logo_url;

  if (!isRendered) return null;

  return (
    <>
      <div className={backdropClasses} onClick={handleClose} role="dialog" aria-modal="true">
        <div
          className={`relative w-full max-w-2xl bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden flex flex-col max-h-[92vh] ${cardClasses}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-base-300 bg-base-200/40 shrink-0">
            <div className="flex items-center gap-3">
              <BankLogo
                bank={{ bankName: formData.bank_name, bankCode: formData.bank_code }}
                logoUrl={formData.logo_url}
                size="md"
              />
              <div>
                <h2 className="text-base sm:text-lg font-bold text-base-content leading-tight">
                  {isEdit ? "Edit Banking Institution" : "Add Banking Institution"}
                </h2>
                <p className="text-xs text-base-content/60 font-medium">
                  {isEdit
                    ? `Modifying Bank Master entry #${bank.id}`
                    : "Register a recognized commercial or scheduled bank into the master directory"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="p-1.5 rounded-xl text-base-content/50 hover:text-base-content hover:bg-base-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
            {/* Quick Preset Selector */}
            {!isEdit && (
              <div className="p-3.5 rounded-2xl bg-base-200/50 border border-base-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-base-content/60 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> Quick Fill Popular Banks
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                  {EXTENDED_BANK_PRESETS.map((preset) => (
                    <button
                      key={preset.bankCode}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-base-100 hover:bg-primary/10 hover:text-primary border border-base-300 hover:border-primary/30 transition-all cursor-pointer shadow-2xs"
                    >
                      <BankLogo bank={preset} size="xs" showBorder={false} />
                      <span>{preset.bankName}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 1. PROFESSIONAL LOGO & BRANDING STUDIO */}
            <div className="space-y-3 p-4 rounded-2xl bg-base-200/30 border border-base-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-base-content/75 uppercase tracking-wider">
                    Bank Brand Logo & Media Studio
                  </h3>
                  <p className="text-[11.5px] text-base-content/55 mt-0.5">
                    Upload official high-resolution logo or utilize built-in vector branding.
                  </p>
                </div>

                {/* Theme preview switcher */}
                <div className="flex items-center bg-base-100 rounded-xl p-1 border border-base-300 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setPreviewTheme("light")}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      previewTheme === "light"
                        ? "bg-amber-500/15 text-amber-700 font-bold"
                        : "text-base-content/50 hover:text-base-content"
                    }`}
                    title="Preview on Light background"
                  >
                    <Sun className="w-3.5 h-3.5" /> Light
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTheme("dark")}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      previewTheme === "dark"
                        ? "bg-slate-800 text-white font-bold"
                        : "text-base-content/50 hover:text-base-content"
                    }`}
                    title="Preview on Dark background"
                  >
                    <Moon className="w-3.5 h-3.5" /> Dark
                  </button>
                </div>
              </div>

              {/* Main Logo Dropzone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, "logo_url")}
                className={`p-4 rounded-2xl border-2 border-dashed transition-all flex flex-col sm:flex-row items-center gap-4 ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-base-300 bg-base-100 hover:border-primary/40"
                }`}
              >
                {/* Theme-sensitive logo preview tile */}
                <div
                  className={`relative w-20 h-20 rounded-2xl p-2.5 flex items-center justify-center shrink-0 border transition-all ${
                    previewTheme === "dark"
                      ? "bg-slate-900 border-slate-700 shadow-inner"
                      : "bg-white border-base-300 shadow-2xs"
                  }`}
                >
                  <BankLogo
                    bank={{ bankName: formData.bank_name, bankCode: formData.bank_code }}
                    logoUrl={activeLogoToPreview}
                    size="lg"
                    showBorder={false}
                  />

                  {/* Quick actions on preview tile */}
                  <div className="absolute -bottom-2 -right-2 flex items-center gap-1">
                    {activeLogoToPreview && (
                      <button
                        type="button"
                        onClick={() => setLightboxImageUrl(activeLogoToPreview)}
                        className="p-1.5 rounded-full bg-base-100 hover:bg-primary hover:text-white border border-base-300 text-base-content/70 shadow-sm transition-colors cursor-pointer"
                        title="View Full Resolution"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                    )}
                    {formData.logo_url && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, logo_url: "" }));
                          if (primaryFileInputRef.current) primaryFileInputRef.current.value = "";
                        }}
                        className="p-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-sm transition-colors cursor-pointer"
                        title="Remove custom logo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left space-y-1.5">
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => primaryFileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-content hover:bg-primary/90 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload Primary Logo
                    </button>
                    {formData.logo_url && (
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, logo_url: "" }))}
                        className="text-xs text-rose-500 hover:underline font-medium cursor-pointer"
                      >
                        Reset to Default Vector
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-base-content/55">
                    Drag & drop or browse PNG, JPG, WebP, SVG up to 8MB. Recommended: square 512x512 transparent PNG/SVG.
                  </p>
                  <input
                    ref={primaryFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) processImageFile(f, "logo_url");
                    }}
                    className="hidden"
                  />
                </div>
              </div>

              {uploadError && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {uploadError}
                </p>
              )}

              {/* Advanced Light & Dark Mode Logos Toggle */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdvancedLogos(!showAdvancedLogos)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5" />
                  {showAdvancedLogos ? "Hide Theme Variants (Light / Dark)" : "Configure Light / Dark Mode Logo Variants (Optional)"}
                  {showAdvancedLogos ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showAdvancedLogos && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 p-3.5 rounded-xl bg-base-100 border border-base-300">
                    {/* Light Mode Logo */}
                    <div>
                      <label className="text-[11px] font-semibold text-base-content/70 flex items-center gap-1 mb-1">
                        <Sun className="w-3 h-3 text-amber-500" /> Light Background Logo (Optional)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          name="logo_light_url"
                          value={formData.logo_light_url}
                          onChange={handleChange}
                          placeholder="https://.../logo-light.svg or upload"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-base-300 bg-base-100 font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => lightFileInputRef.current?.click()}
                          className="p-1.5 rounded-lg border border-base-300 bg-base-200 hover:text-primary cursor-pointer shrink-0"
                          title="Browse"
                        >
                          <Upload className="w-3.5 h-3.5" />
                        </button>
                        <input
                          ref={lightFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) processImageFile(f, "logo_light_url");
                          }}
                          className="hidden"
                        />
                      </div>
                    </div>

                    {/* Dark Mode Logo */}
                    <div>
                      <label className="text-[11px] font-semibold text-base-content/70 flex items-center gap-1 mb-1">
                        <Moon className="w-3 h-3 text-indigo-500" /> Dark Background Logo (Optional)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          name="logo_dark_url"
                          value={formData.logo_dark_url}
                          onChange={handleChange}
                          placeholder="https://.../logo-dark.svg or upload"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-base-300 bg-base-100 font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => darkFileInputRef.current?.click()}
                          className="p-1.5 rounded-lg border border-base-300 bg-base-200 hover:text-primary cursor-pointer shrink-0"
                          title="Browse"
                        >
                          <Upload className="w-3.5 h-3.5" />
                        </button>
                        <input
                          ref={darkFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) processImageFile(f, "logo_dark_url");
                          }}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 2. CORE STATUTORY & REGISTRATION DETAILS */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-base-content/50 uppercase tracking-wider">
                Statutory & Identification Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    Bank Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleChange}
                    maxLength={150}
                    placeholder="e.g. Bank of India, State Bank of India"
                    className={inputClass(errors.bank_name)}
                  />
                  {errors.bank_name && (
                    <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.bank_name}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>
                    Bank Code (Unique Identifier) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bank_code"
                    value={formData.bank_code}
                    onChange={handleChange}
                    maxLength={50}
                    placeholder="e.g. BKID, SBI, HDFC"
                    className={`${inputClass(errors.bank_code)} uppercase font-bold tracking-wider`}
                  />
                  {errors.bank_code && (
                    <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.bank_code}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Short Display Name</label>
                  <input
                    type="text"
                    name="short_name"
                    value={formData.short_name}
                    onChange={handleChange}
                    maxLength={100}
                    placeholder="e.g. BOI, SBI, Bank of Baroda"
                    className={inputClass(false)}
                  />
                </div>

                <div>
                  <label className={labelClass}>Legal / Corporate Statutory Name</label>
                  <input
                    type="text"
                    name="legal_name"
                    value={formData.legal_name}
                    onChange={handleChange}
                    maxLength={200}
                    placeholder="e.g. Bank of India Ltd."
                    className={inputClass(false)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <DropdownSelect
                    label="Bank Classification / Type"
                    required
                    name="bank_type"
                    value={formData.bank_type}
                    onChange={handleChange}
                    options={BANK_TYPES}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Display Order <span className="text-base-content/40 font-normal">(0 = default)</span>
                  </label>
                  <input
                    type="number"
                    name="display_order"
                    value={formData.display_order}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                    className={inputClass(errors.display_order)}
                  />
                  {errors.display_order && (
                    <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.display_order}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 3. INTERBANK ROUTING & REGIONAL DATA */}
            <div className="space-y-3 pt-2 border-t border-base-200">
              <h3 className="text-xs font-bold text-base-content/50 uppercase tracking-wider">
                Interbank Routing & Geographical Metadata
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>IFSC Prefix (4 Chars)</label>
                  <input
                    type="text"
                    name="ifsc_prefix"
                    value={formData.ifsc_prefix}
                    onChange={handleChange}
                    maxLength={10}
                    placeholder="e.g. BKID, SBIN, HDFC"
                    className={`${inputClass(false)} uppercase font-semibold`}
                  />
                </div>

                <div>
                  <label className={labelClass}>SWIFT / BIC Code</label>
                  <input
                    type="text"
                    name="swift_code"
                    value={formData.swift_code}
                    onChange={handleChange}
                    maxLength={20}
                    placeholder="e.g. BKIDINBBXXX"
                    className={`${inputClass(false)} uppercase tracking-wider font-semibold`}
                  />
                </div>

                <div>
                  <label className={labelClass}>Country Code (ISO 3166-1)</label>
                  <input
                    type="text"
                    name="country_code"
                    value={formData.country_code}
                    onChange={handleChange}
                    maxLength={2}
                    placeholder="IN"
                    className={`${inputClass(false)} uppercase font-bold text-center`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Headquarters City</label>
                  <input
                    type="text"
                    name="headquarters_city"
                    value={formData.headquarters_city}
                    onChange={handleChange}
                    placeholder="e.g. Mumbai, New Delhi"
                    className={inputClass(false)}
                  />
                </div>

                <div>
                  <label className={labelClass}>Official Website URL</label>
                  <input
                    type="text"
                    name="website_url"
                    value={formData.website_url}
                    onChange={handleChange}
                    placeholder="https://www.bankofindia.co.in"
                    className={inputClass(false)}
                  />
                </div>

                <div>
                  <label className={labelClass}>Customer Care Phone</label>
                  <input
                    type="text"
                    name="customer_care_number"
                    value={formData.customer_care_number}
                    onChange={handleChange}
                    placeholder="1800 220 229"
                    className={inputClass(false)}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Internal Notes / Metadata Remarks</label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="e.g. Nationalized commercial bank with extensive clearing branches"
                  className={inputClass(false)}
                />
              </div>
            </div>

            {/* 4. ACTIVE & REGULATORY VERIFIED STATUS */}
            <div className="pt-3 border-t border-base-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-base-200/50 border border-base-300 cursor-pointer hover:bg-base-200 transition-colors">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="checkbox checkbox-success rounded-lg"
                />
                <div>
                  <span className="text-xs font-bold text-base-content block">Active Institution</span>
                  <span className="text-[11px] text-base-content/60">Available across all companies and bank account lookups</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-base-200/50 border border-base-300 cursor-pointer hover:bg-base-200 transition-colors">
                <input
                  type="checkbox"
                  name="is_verified"
                  checked={formData.is_verified}
                  onChange={handleChange}
                  className="checkbox checkbox-primary rounded-lg"
                />
                <div>
                  <span className="text-xs font-bold text-base-content block">RBI Verified Status</span>
                  <span className="text-[11px] text-base-content/60">Official recognized banking institution badge</span>
                </div>
              </label>
            </div>

            {/* Footer Actions */}
            <div className="pt-4 mt-2 border-t border-base-300 flex items-center justify-end gap-2.5">
              <Button variant="secondary" size="md" onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="clip-six" size="md" loading={isSubmitting} icon={Save}>
                {isEdit ? "Update Institution" : "Register Bank"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* FULL RESOLUTION LIGHTBOX PREVIEW */}
      {lightboxImageUrl && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/40 transition-opacity duration-200 select-none animate-in fade-in"
          onClick={() => setLightboxImageUrl(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-lg w-full bg-base-100 rounded-3xl p-5 overflow-hidden border border-base-300 shadow-2xl transition-all duration-200 transform scale-100 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-base-200">
              <h4 className="text-sm font-bold text-base-content flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" /> Bank Logo Resolution Preview
              </h4>
              <button
                type="button"
                onClick={() => setLightboxImageUrl(null)}
                className="p-1 rounded-xl hover:bg-base-200 text-base-content/60 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-6 flex items-center justify-center">
              <div className="p-6 rounded-2xl bg-base-200/50 border border-base-300 shadow-inner">
                <img
                  src={lightboxImageUrl}
                  alt="Full Logo Preview"
                  className="max-h-56 max-w-xs object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
