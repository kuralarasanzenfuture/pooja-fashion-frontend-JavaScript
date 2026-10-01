import React, { useState, useEffect } from "react";
import {
  X,
  UserCheck,
  User,
  Briefcase,
  Mail,
  Phone,
  Smartphone,
  Save,
  AlertCircle,
  ShieldCheck,
  Headphones,
  Calculator,
  TrendingUp,
} from "lucide-react";
import { Button } from "../../../common/components/ui/buttons/index.js";
import { DropdownSelect } from "../../../common/components/ui/select/index.js";
import { useModalAnimation } from "../../../common/hooks/useModalAnimation.js";

const CONTACT_TYPES = [
  {
    value: "owner",
    label: "Proprietor / Managing Director",
    description: "Principal owner or chief legal signatory",
    icon: ShieldCheck,
    badge: "Owner",
  },
  {
    value: "manager",
    label: "General / Operations Manager",
    description: "Oversees day-to-day administrative & business operations",
    icon: Briefcase,
    badge: "Manager",
  },
  {
    value: "accountant",
    label: "Chief Accountant / CFO",
    description: "Handles taxation, billing, vouchers & accounts reconciliation",
    icon: Calculator,
    badge: "Finance",
  },
  {
    value: "sales",
    label: "Sales & Merchandising Executive",
    description: "Point of contact for orders, quotes & product deliveries",
    icon: TrendingUp,
    badge: "Sales",
  },
  {
    value: "support",
    label: "Customer & Technical Support",
    description: "Post-sales inquiries, dispute resolution & logistics assistance",
    icon: Headphones,
    badge: "Support",
  },
  {
    value: "other",
    label: "Other Key Associate",
    description: "Third-party liaison, legal counsel or logistics coordinator",
    icon: User,
    badge: "Other",
  },
];

/**
 * Company Contact Modal for Create and Edit Operations
 */
export default function CompanyContactModal({
  isOpen = false,
  onClose,
  contact = null,
  companyId,
  onSubmit,
  isSubmitting = false,
}) {
  const isEdit = Boolean(contact?.id);
  const { isRendered, handleClose, backdropClasses, cardClasses } = useModalAnimation(isOpen, onClose);

  const initialFormState = {
    company_id: companyId,
    contact_type: "owner",
    contact_name: "",
    designation: "",
    email: "",
    phone: "",
    mobile: "",
    is_primary: false,
    is_active: true,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (contact) {
        setFormData({
          company_id: contact.companyId || contact.company_id || companyId,
          contact_type: contact.contactType || contact.contact_type || "owner",
          contact_name: contact.contactName || contact.contact_name || "",
          designation: contact.designation || "",
          email: contact.email || "",
          phone: contact.phone || "",
          mobile: contact.mobile || "",
          is_primary: Boolean(contact.isPrimary ?? contact.is_primary),
          is_active: Boolean(contact.isActive ?? contact.is_active ?? true),
        });
      } else {
        setFormData({
          ...initialFormState,
          company_id: companyId,
        });
      }
      setErrors({});
    }
  }, [isOpen, contact, companyId]);

  if (!isRendered) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

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

    if (!formData.contact_name?.trim()) {
      newErrors.contact_name = "Contact full name is required";
    }

    if (!formData.contact_type) {
      newErrors.contact_type = "Contact classification is required";
    }

    if (formData.email?.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Please provide a valid email address";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
      contact_name: formData.contact_name.trim(),
      designation: formData.designation?.trim() || null,
      email: formData.email?.trim() || null,
      phone: formData.phone?.trim() || null,
      mobile: formData.mobile?.trim() || null,
      company_id: Number(formData.company_id || companyId),
    };

    onSubmit(payload);
  };

  const inputClass = (hasError) =>
    `w-full px-3.5 py-2 text-sm rounded-xl border bg-base-100 placeholder:text-base-content/40 transition-all outline-hidden ${
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
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-base-content leading-tight">
                {isEdit ? "Edit Company Contact" : "Add Key Contact Person"}
              </h2>
              <p className="text-xs text-base-content/60 font-medium">
                {isEdit ? `Modifying contact person #${contact.id}` : "Register key representative or departmental lead"}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <DropdownSelect
                label="Designated Role / Type"
                required
                name="contact_type"
                value={formData.contact_type}
                onChange={handleChange}
                options={CONTACT_TYPES}
                error={errors.contact_type}
              />
            </div>

            <div>
              <label className={labelClass}>
                Official Designation / Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="e.g. Managing Partner / Head of Accounts"
                  className={inputClass(false)}
                />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Full Name of Contact Person <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="contact_name"
              value={formData.contact_name}
              onChange={handleChange}
              placeholder="e.g. Rajesh Kumar Sharma"
              className={inputClass(errors.contact_name)}
            />
            {errors.contact_name && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.contact_name}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Email Address</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. contact@business.com"
                className={inputClass(errors.email)}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Mobile Number (Direct)</label>
              <div className="relative">
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="e.g. +91 98765 43210"
                  className={inputClass(false)}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Landline / Desk Phone</label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 0261 2456789"
                  className={inputClass(false)}
                />
              </div>
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
                <span className="text-xs font-bold text-base-content block">Primary Representative</span>
                <span className="text-[11px] text-base-content/60">Chief executive contact for company communication</span>
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
                <span className="text-[11px] text-base-content/60">Currently authorized to represent company</span>
              </div>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 mt-2 border-t border-base-300 flex items-center justify-end gap-2.5">
            <Button variant="secondary" size="md" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="clip-six" size="md" loading={isSubmitting} icon={Save}>
              {isEdit ? "Save Changes" : "Create Contact"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
