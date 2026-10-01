import React, { useState, useEffect } from "react";
import {
  X,
  MapPin,
  Building,
  Building2,
  FileText,
  Package,
  Save,
  AlertCircle,
  Home,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../../../common/components/ui/buttons/index.js";
import { DropdownSelect } from "../../../common/components/ui/select/index.js";
import useModalAnimation from "../../../common/hooks/useModalAnimation.js";

const ADDRESS_TYPES = [
  {
    value: "registered",
    label: "Registered Corporate Office",
    description: "Legal statutory domicile for corporate records & GST",
    icon: Building2,
    badge: "Official",
  },
  {
    value: "head_office",
    label: "Headquarters / Central HQ",
    description: "Executive operations & principal administrative center",
    icon: Building,
    badge: "HQ",
  },
  {
    value: "billing",
    label: "Billing & Accounts Location",
    description: "Designated location for invoices & financial notices",
    icon: FileText,
    badge: "Finance",
  },
  {
    value: "warehouse",
    label: "Warehouse / Fulfilment Hub",
    description: "Inventory depot, goods receiving & logistics dispatch",
    icon: Package,
    badge: "Logistics",
  },
  {
    value: "other",
    label: "Other Branch / Facility",
    description: "Showroom, retail outlet, or regional branch",
    icon: MapPin,
    badge: "Facility",
  },
];

/**
 * Company Address Modal for Create and Edit Operations
 */
export default function CompanyAddressModal({
  isOpen = false,
  onClose,
  address = null,
  companyId,
  onSubmit,
  isSubmitting = false,
}) {
  const isEdit = Boolean(address?.id);

  const initialFormState = {
    company_id: companyId,
    address_type: "registered",
    address_line_1: "",
    address_line_2: "",
    landmark: "",
    city: "",
    district: "",
    state: "",
    postal_code: "",
    country: "India",
    is_primary: false,
    is_active: true,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (address) {
        setFormData({
          company_id: address.companyId || address.company_id || companyId,
          address_type: address.addressType || address.address_type || "registered",
          address_line_1: address.addressLine1 || address.address_line_1 || "",
          address_line_2: address.addressLine2 || address.address_line_2 || "",
          landmark: address.landmark || "",
          city: address.city || "",
          district: address.district || "",
          state: address.state || "",
          postal_code: address.postalCode || address.postal_code || "",
          country: address.country || "India",
          is_primary: Boolean(address.isPrimary ?? address.is_primary),
          is_active: Boolean(address.isActive ?? address.is_active ?? true),
        });
      } else {
        setFormData({
          ...initialFormState,
          company_id: companyId,
        });
      }
      setErrors({});
    }
  }, [isOpen, address, companyId]);

  const { isRendered, isVisible, handleClose, backdropClasses, cardClasses } = useModalAnimation(
    isOpen,
    onClose
  );

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

    if (!formData.address_line_1.trim()) {
      newErrors.address_line_1 = "Address line 1 is required";
    }

    if (!formData.address_type) {
      newErrors.address_type = "Address type is required";
    }

    if (formData.postal_code && formData.postal_code.trim().length > 20) {
      newErrors.postal_code = "Postal code cannot exceed 20 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
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
    <div className={backdropClasses} onClick={handleClose}>
      <div
        className={`relative w-full max-w-2xl bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden flex flex-col max-h-[90vh] text-base-content ${cardClasses}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-300 bg-base-200/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-base-content leading-tight">
                {isEdit ? "Edit Company Address" : "Add Company Address"}
              </h2>
              <p className="text-xs text-base-content/60 font-medium">
                {isEdit ? `Modifying address record #${address.id}` : "Register a physical establishment or postal hub"}
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
                label="Address Classification"
                required
                name="address_type"
                value={formData.address_type}
                onChange={handleChange}
                options={ADDRESS_TYPES}
                error={errors.address_type}
              />
            </div>

            <div>
              <label className={labelClass}>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="India"
                className={inputClass(false)}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Street Address Line 1 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="address_line_1"
              value={formData.address_line_1}
              onChange={handleChange}
              placeholder="e.g. Shop #42, Textile Market, Ring Road"
              className={inputClass(errors.address_line_1)}
            />
            {errors.address_line_1 && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.address_line_1}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Address Line 2 (Optional)</label>
            <input
              type="text"
              name="address_line_2"
              value={formData.address_line_2}
              onChange={handleChange}
              placeholder="e.g. 2nd Floor, Wing B, Near Fashion Tower"
              className={inputClass(false)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Landmark / Reference</label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                placeholder="e.g. Opposite Old Clock Tower"
                className={inputClass(false)}
              />
            </div>

            <div>
              <label className={labelClass}>City / Town</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Surat / Chennai / Mumbai"
                className={inputClass(false)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>District</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="e.g. Surat"
                className={inputClass(false)}
              />
            </div>

            <div>
              <label className={labelClass}>State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g. Gujarat / Tamil Nadu"
                className={inputClass(false)}
              />
            </div>

            <div>
              <label className={labelClass}>PIN / Postal Code</label>
              <input
                type="text"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                placeholder="e.g. 395002"
                className={inputClass(errors.postal_code)}
              />
              {errors.postal_code && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.postal_code}
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
                <span className="text-xs font-bold text-base-content block">Primary Official Address</span>
                <span className="text-[11px] text-base-content/60">Marks this as main postal address</span>
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
                <span className="text-[11px] text-base-content/60">Available for commercial documentation</span>
              </div>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 mt-2 border-t border-base-300 flex items-center justify-end gap-2.5">
            <Button variant="secondary" size="md" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="clip-six" size="md" loading={isSubmitting} icon={Save}>
              {isEdit ? "Save Changes" : "Create Address"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
