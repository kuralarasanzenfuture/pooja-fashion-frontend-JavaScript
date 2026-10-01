import React, { useState, useEffect } from "react";
import {
  X,
  Receipt,
  FileCheck2,
  FileText,
  CreditCard,
  Building,
  Save,
  AlertCircle,
  Hash,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../../../common/components/ui/buttons/index.js";
import { DropdownSelect } from "../../../common/components/ui/select/index.js";
import { useModalAnimation } from "../../../common/hooks/useModalAnimation.js";

const GST_REGISTRATION_TYPES = [
  {
    value: "regular",
    label: "Regular GST Taxpayer",
    description: "Standard monthly/quarterly return filer (GSTR-1, 3B) with full ITC eligibility",
    icon: ShieldCheck,
    badge: "Regular",
  },
  {
    value: "composition",
    label: "Composition Scheme",
    description: "Simplified quarterly lump-sum turnover tax for eligible small enterprises",
    icon: Receipt,
    badge: "Composition",
  },
  {
    value: "unregistered",
    label: "Unregistered Entity / Exempt",
    description: "Annual turnover below statutory threshold or dealing exclusively in exempt goods",
    icon: FileText,
    badge: "Unregistered",
  },
  {
    value: "other",
    label: "Other Special Entity",
    description: "SEZ developer/unit, input service distributor (ISD), or government deductor",
    icon: Building,
    badge: "Special",
  },
];

/**
 * Company Tax Detail Modal for Create and Edit Operations
 */
export default function CompanyTaxDetailModal({
  isOpen = false,
  onClose,
  taxDetail = null,
  companyId,
  onSubmit,
  isSubmitting = false,
}) {
  const isEdit = Boolean(taxDetail?.id);
  const { isRendered, handleClose, backdropClasses, cardClasses } = useModalAnimation(isOpen, onClose);

  const initialFormState = {
    company_id: companyId,
    gstin: "",
    pan_number: "",
    tan_number: "",
    gst_registration_type: "regular",
    gst_state_code: "",
    tax_registered_name: "",
    is_primary: true,
    is_active: true,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (taxDetail) {
        setFormData({
          company_id: taxDetail.companyId || taxDetail.company_id || companyId,
          gstin: taxDetail.gstin || "",
          pan_number: taxDetail.panNumber || taxDetail.pan_number || "",
          tan_number: taxDetail.tanNumber || taxDetail.tan_number || "",
          gst_registration_type:
            taxDetail.gstRegistrationType || taxDetail.gst_registration_type || "regular",
          gst_state_code: taxDetail.gstStateCode || taxDetail.gst_state_code || "",
          tax_registered_name:
            taxDetail.taxRegisteredName || taxDetail.tax_registered_name || "",
          is_primary: Boolean(taxDetail.isPrimary ?? taxDetail.is_primary ?? true),
          is_active: Boolean(taxDetail.isActive ?? taxDetail.is_active ?? true),
        });
      } else {
        setFormData({
          ...initialFormState,
          company_id: companyId,
        });
      }
      setErrors({});
    }
  }, [isOpen, taxDetail, companyId]);

  if (!isRendered) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let nextVal = type === "checkbox" ? checked : value;

    // Auto uppercase tax identifiers
    if (["gstin", "pan_number", "tan_number"].includes(name) && typeof nextVal === "string") {
      nextVal = nextVal.toUpperCase().trim();
    }

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: nextVal,
      };

      // Auto-populate PAN and state code if GSTIN is entered and has standard length
      if (name === "gstin" && typeof nextVal === "string" && nextVal.length >= 2) {
        if (!updated.gst_state_code) {
          updated.gst_state_code = nextVal.substring(0, 2);
        }
        if (nextVal.length >= 12 && !updated.pan_number) {
          updated.pan_number = nextVal.substring(2, 12);
        }
      }

      return updated;
    });

    if (errors[name]) {
      setErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors[name];
        return nextErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.gstin) {
      const gstinTrimmed = formData.gstin.trim();
      if (gstinTrimmed.length > 20) {
        newErrors.gstin = "GSTIN cannot exceed 20 characters";
      }
    }

    if (formData.pan_number) {
      const panTrimmed = formData.pan_number.trim();
      if (panTrimmed.length > 20) {
        newErrors.pan_number = "PAN number cannot exceed 20 characters";
      }
    }

    if (formData.tan_number) {
      const tanTrimmed = formData.tan_number.trim();
      if (tanTrimmed.length > 20) {
        newErrors.tan_number = "TAN number cannot exceed 20 characters";
      }
    }

    if (formData.gst_state_code && formData.gst_state_code.trim().length > 10) {
      newErrors.gst_state_code = "State code cannot exceed 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
      gstin: formData.gstin?.trim() ? formData.gstin.trim().toUpperCase() : null,
      pan_number: formData.pan_number?.trim() ? formData.pan_number.trim().toUpperCase() : null,
      tan_number: formData.tan_number?.trim() ? formData.tan_number.trim().toUpperCase() : null,
      gst_state_code: formData.gst_state_code?.trim() || null,
      tax_registered_name: formData.tax_registered_name?.trim() || null,
      company_id: Number(formData.company_id || companyId),
    };

    onSubmit(payload);
  };

  const inputClass = (hasError) =>
    `w-full px-3.5 py-2 text-sm rounded-xl border bg-base-100 placeholder:text-base-content/40 transition-all outline-hidden font-medium ${
      hasError
        ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20 text-rose-600"
        : "border-base-300 focus:border-primary focus:ring-1 focus:ring-primary/20 text-base-content"
    }`;

  const labelClass = "block text-xs font-semibold text-base-content/70 mb-1";

  return (
    <div className={backdropClasses} onClick={handleClose} role="dialog" aria-modal="true">
      <div
        className={`relative w-full max-w-2xl bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden flex flex-col max-h-[90vh] ${cardClasses}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-300 bg-base-200/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-base-content leading-tight">
                {isEdit ? "Edit Tax & GST Record" : "Add Tax & GST Registration"}
              </h2>
              <p className="text-xs text-base-content/60 font-medium">
                {isEdit ? `Modifying registration record #${taxDetail.id}` : "Configure GSTIN, PAN, TAN & statutory credentials"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-xl text-base-content/50 hover:text-base-content hover:bg-base-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className={labelClass}>Legal Trade / Tax Registered Entity Name</label>
            <input
              type="text"
              name="tax_registered_name"
              value={formData.tax_registered_name}
              onChange={handleChange}
              placeholder="e.g. Pooja Fashion Apparels Private Limited"
              className={inputClass(false)}
            />
            <p className="text-[11px] text-base-content/50 mt-1">
              Exact company name as registered with the Goods and Services Tax Network (GSTN).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <DropdownSelect
                label="GST Registration Type"
                required
                name="gst_registration_type"
                value={formData.gst_registration_type}
                onChange={handleChange}
                options={GST_REGISTRATION_TYPES}
                error={errors.gst_registration_type}
              />
            </div>

            <div>
              <label className={labelClass}>GST State Code (2-Digits)</label>
              <input
                type="text"
                name="gst_state_code"
                value={formData.gst_state_code}
                onChange={handleChange}
                maxLength={5}
                placeholder="e.g. 24 (Gujarat) or 33 (TN)"
                className={inputClass(errors.gst_state_code)}
              />
              {errors.gst_state_code && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.gst_state_code}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>
                GSTIN (GST Number)
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleChange}
                  maxLength={18}
                  placeholder="e.g. 24AAAAA0000A1Z5"
                  className={`${inputClass(errors.gstin)} font-mono uppercase tracking-wider`}
                />
              </div>
              {errors.gstin && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.gstin}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>
                PAN Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="pan_number"
                  value={formData.pan_number}
                  onChange={handleChange}
                  maxLength={12}
                  placeholder="e.g. AAAAA0000A"
                  className={`${inputClass(errors.pan_number)} font-mono uppercase tracking-wider`}
                />
              </div>
              {errors.pan_number && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.pan_number}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>
                TAN Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="tan_number"
                  value={formData.tan_number}
                  onChange={handleChange}
                  maxLength={12}
                  placeholder="e.g. ABCD12345E"
                  className={`${inputClass(errors.tan_number)} font-mono uppercase tracking-wider`}
                />
              </div>
              {errors.tan_number && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.tan_number}
                </p>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-base-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3 rounded-2xl bg-base-200/50 border border-base-300 cursor-pointer hover:bg-base-200 transition-colors">
              <input
                type="checkbox"
                name="is_primary"
                checked={formData.is_primary}
                onChange={handleChange}
                className="checkbox checkbox-primary rounded-lg"
              />
              <div>
                <span className="text-xs font-bold text-base-content block">Primary Tax Identification</span>
                <span className="text-[11px] text-base-content/60">Applied by default on invoices & GST filings</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-2xl bg-base-200/50 border border-base-300 cursor-pointer hover:bg-base-200 transition-colors">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="checkbox checkbox-success rounded-lg"
              />
              <div>
                <span className="text-xs font-bold text-base-content block">Active Status</span>
                <span className="text-[11px] text-base-content/60">Valid and active registration</span>
              </div>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 mt-2 border-t border-base-300 flex items-center justify-end gap-2.5">
            <Button variant="secondary" size="md" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="clip-six" size="md" loading={isSubmitting} icon={Save}>
              {isEdit ? "Save Changes" : "Create Tax Record"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
