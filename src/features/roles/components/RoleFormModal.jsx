import { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  X,
  Shield,
  Sparkles,
  Building,
  Info,
  Check,
  Layers,
  KeyRound,
  CheckCircle2,
  Lock,
  AlertCircle,
} from "lucide-react";
import { Button } from "../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../common/hooks/useModalAnimation.js";
import { useCompanies } from "../../company/hooks/useCompanies.js";
import { CompanySelect } from "../../company/components/index.js";
import { checkRoleNameExists } from "../services/roleService.js";
import {
  selectIsSuperAdmin,
  selectIsAdmin,
  selectCurrentUserCompanyId,
  selectCurrentUser,
} from "../../../redux/selectors/authSelectors.js";

const EMPTY_FORM = {
  role_name: "",
  role_code: "",
  description: "",
  company_id: null,
  is_system_role: false,
  is_active: true,
  permissions: [],
};

/**
 * Standard Pooja Fashion Boutique Role Presets for 1-Click Fast Setup
 */
export const STANDARD_ROLE_PRESETS = [
  {
    name: "Store Manager",
    code: "STORE_MANAGER",
    desc: "Oversees daily boutique operations, staff, customer credit approvals, and stock transfers.",
    permissions: ["billing", "products", "stock", "customers", "employees", "reports"],
  },
  {
    name: "Cashier",
    code: "CASHIER",
    desc: "Handles POS billing, invoice generation, cash register, and customer payments.",
    permissions: ["billing", "customers"],
  },
  {
    name: "Sales Associate",
    code: "SALES_ASSOCIATE",
    desc: "Assists retail walk-in customers, sarees display, metre cuts, and cart drafting.",
    permissions: ["billing", "products"],
  },
  {
    name: "Inventory Manager",
    code: "INVENTORY_MANAGER",
    desc: "Tracks fabric bolts, mill arrivals, thaan shrinkage, and warehouse stock inward.",
    permissions: ["products", "stock", "purchases", "suppliers"],
  },
  {
    name: "Accountant",
    code: "ACCOUNTANT",
    desc: "Manages ledger balances, GST summaries, supplier payables, and daybook closing.",
    permissions: ["billing", "customers", "suppliers", "reports"],
  },
];

/**
 * Granular Application Module Permissions
 */
// export const AVAILABLE_MODULE_PERMISSIONS = [
//   { id: "billing", label: "POS Billing", desc: "Create bills, metre calculations & receipts" },
//   { id: "products", label: "Fabrics & Catalog", desc: "Browse sarees, silk rolls & rate lists" },
//   { id: "stock", label: "Inventory & Bolts", desc: "Track fabric bolts, shrinkage & warehouse" },
//   { id: "customers", label: "Customers & Khata", desc: "Retail clients, boutique khata & ledger" },
//   { id: "purchases", label: "Purchases & Mills", desc: "Record mill and weaver purchase invoices" },
//   { id: "suppliers", label: "Suppliers & Mills", desc: "Manage master weavers, agents & payables" },
//   { id: "employees", label: "Staff & Attendance", desc: "Track staff shifts, attendance & commissions" },
//   { id: "reports", label: "GST & Sales Reports", desc: "GSTR summaries, profit margins & daybook" },
//   { id: "settings", label: "Settings & Company", desc: "Company profiles, bank accounts & master" },
// ];

/**
 * Generate clean uppercase role code
 */
function generateCodeFromName(name = "") {
  if (!name.trim()) return "";
  return name
    .trim()
    .toUpperCase()
    .replace(/[^A-Za-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 50);
}

/**
 * Validation rules matching backend createRoleSchema and updateRoleSchema
 */
function validateRoleForm(values, isPrivilegedAdmin, isEdit = false, userCompanyId = null) {
  const errors = {};
  const name = (values.role_name || "").trim();
  const code = (values.role_code || "").trim();

  if (!name) {
    errors.role_name = "Role name is required.";
  } else if (name.length < 2) {
    errors.role_name = "Role name must be at least 2 characters.";
  } else if (name.length > 100) {
    errors.role_name = "Role name cannot exceed 100 characters.";
  }

  if (code) {
    if (code.length < 2) {
      errors.role_code = "Role code must be at least 2 characters.";
    } else if (code.length > 50) {
      errors.role_code = "Role code cannot exceed 50 characters.";
    } else if (!/^[A-Za-z0-9_-]+$/.test(code)) {
      errors.role_code = "Only uppercase letters, numbers, hyphens, and underscores are allowed.";
    }
  }

  if (values.description && values.description.length > 1000) {
    errors.description = "Description cannot exceed 1000 characters.";
  }

  if (!isEdit) {
    const compId = isPrivilegedAdmin ? values.company_id : (values.company_id || userCompanyId);
    if (!compId || Number(compId) <= 0) {
      errors.company_id = isPrivilegedAdmin
        ? "Please select a target company."
        : "Company association is required.";
    }
  }

  // Enforce reserved system role names & codes
  const nameUpper = name.toUpperCase();
  if (["SUPERADMIN", "ADMIN", "SUPER ADMIN"].includes(nameUpper)) {
    errors.role_name = `'${name}' is a reserved system role name and cannot be created.`;
  }

  const codeUpper = code.toUpperCase();
  if (["SUPERADMIN", "ADMIN"].includes(codeUpper)) {
    errors.role_code = `'${code}' is a reserved system role code.`;
  }

  return errors;
}

/**
 * Add / Edit Role Modal
 */
export default function RoleFormModal({
  open,
  isOpen = false,
  mode = "add", // "add" | "edit"
  initialData = null,
  saving = false,
  onClose,
  onSubmit,
}) {
  const isModalOpen = open ?? isOpen ?? false;
  const { isRendered, handleClose, backdropClasses, cardClasses } = useModalAnimation(
    isModalOpen,
    onClose
  );
  const isSuperAdmin = useSelector(selectIsSuperAdmin);
  const isAdmin = useSelector(selectIsAdmin);
  const userCompanyId = useSelector(selectCurrentUserCompanyId);
  const currentUser = useSelector(selectCurrentUser);
  const nameInputRef = useRef(null);

  // Both SuperAdmin and Admin have enterprise administrative privileges to assign company
  const isPrivilegedAdmin = isSuperAdmin || isAdmin;

  // Fetch active companies for Admin and SuperAdmin selection
  const { data: companiesResponse, isLoading: companiesLoading } = useCompanies({
    limit: 100,
    status: "active",
  });
  const companies = companiesResponse?.data || [];

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [activeTab, setActiveTab] = useState("general"); // "general" | "permissions"
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [nameAvailable, setNameAvailable] = useState(null);
  const nameCheckTimeoutRef = useRef(null);

  const isEdit = mode === "edit";
  const isSystemRole = Boolean(
    initialData?.isSystemRole ||
    initialData?.is_system_role ||
    ["SUPERADMIN", "ADMIN"].includes(String(initialData?.roleCode || initialData?.role_code).toUpperCase())
  );

  // Sync form on open / initialData change
  useEffect(() => {
    if (!isModalOpen) {
      if (nameCheckTimeoutRef.current) {
        clearTimeout(nameCheckTimeoutRef.current);
      }
      return;
    }

    if (initialData) {
      setForm({
        role_name: initialData.roleName || initialData.role_name || "",
        role_code: initialData.roleCode || initialData.role_code || "",
        description: initialData.description || "",
        company_id: initialData.companyId ?? initialData.company_id ?? userCompanyId ?? null,
        is_system_role: Boolean(initialData.isSystemRole || initialData.is_system_role),
        is_active:
          initialData.isActive !== undefined
            ? Boolean(initialData.isActive)
            : initialData.is_active !== undefined
            ? Boolean(initialData.is_active)
            : true,
        permissions: initialData.permissions || [
          "billing",
          "products",
          "customers",
        ],
      });
    } else {
      // In Add mode:
      // For Admin & SuperAdmin, ask company field (prefill with userCompanyId if any, or first company)
      // For other users, automatically bind to their assigned userCompanyId
      const initialCompanyId = !isPrivilegedAdmin
        ? (userCompanyId || null)
        : (userCompanyId || (companies.length === 1 ? companies[0].id : ""));

      setForm({
        ...EMPTY_FORM,
        company_id: initialCompanyId,
        is_system_role: false,
        permissions: ["billing", "products", "customers"],
      });
    }
    setErrors({});
    setTouched({});
    setNameAvailable(null);
    setIsCheckingName(false);
    setActiveTab("general");

    // Auto-focus role name input on modal open
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 150);

    return () => {
      if (nameCheckTimeoutRef.current) {
        clearTimeout(nameCheckTimeoutRef.current);
      }
    };
  }, [isModalOpen, initialData, userCompanyId, isPrivilegedAdmin]);

  // Check role name availability against backend API
  const performCheckRoleName = useCallback(
    async (nameVal, companyIdVal, isSystemVal) => {
      const trimmed = (nameVal || "").trim();
      if (!trimmed || trimmed.length < 2) {
        setNameAvailable(null);
        setIsCheckingName(false);
        return;
      }

      // In edit mode, if name is identical to existing role name, it's valid
      const originalName = initialData?.roleName || initialData?.role_name || "";
      if (isEdit && trimmed.toLowerCase() === originalName.trim().toLowerCase()) {
        setNameAvailable(true);
        setIsCheckingName(false);
        return;
      }

      setIsCheckingName(true);
      try {
        const response = await checkRoleNameExists({
          name: trimmed,
          company_id: companyIdVal ? Number(companyIdVal) : (userCompanyId ? Number(userCompanyId) : undefined),
          is_system_role: Boolean(isSystemVal),
          exclude_id: isEdit ? (initialData?.id || undefined) : undefined,
        });

        const exists = Boolean(response?.data?.exists ?? response?.exists);
        if (exists) {
          const errMsg = response?.data?.message || response?.message || "This role name already exists.";
          setErrors((prev) => ({
            ...prev,
            role_name: errMsg,
          }));
          setTouched((prev) => ({ ...prev, role_name: true }));
          setNameAvailable(false);
        } else {
          setNameAvailable(true);
          setErrors((prev) => {
            if (prev.role_name && /already exists/i.test(prev.role_name)) {
              const next = { ...prev };
              delete next.role_name;
              return next;
            }
            return prev;
          });
        }
      } catch (err) {
        // Silently tolerate network glitch during typing check
        console.warn("Role name existence check:", err);
      } finally {
        setIsCheckingName(false);
      }
    },
    [isEdit, initialData, userCompanyId]
  );

  // If in Add mode and single active company loads, auto-populate for convenience
  useEffect(() => {
    if (!isModalOpen || isEdit) return;
    if (isPrivilegedAdmin && !form.is_system_role && !form.company_id && companies.length === 1) {
      setForm((prev) => ({ ...prev, company_id: companies[0].id }));
    }
  }, [isModalOpen, isEdit, isPrivilegedAdmin, form.is_system_role, form.company_id, companies]);

  if (!isRendered) return null;

  const handleChange = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "is_system_role" && value === true) {
        next.company_id = null;
      } else if (field === "is_system_role" && value === false && !next.company_id) {
        next.company_id = userCompanyId || 1;
      }
      return next;
    });

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }

    // Debounced check for role_name collision
    if (field === "role_name") {
      setNameAvailable(null);
      if (nameCheckTimeoutRef.current) {
        clearTimeout(nameCheckTimeoutRef.current);
      }
      if (value.trim().length >= 2) {
        nameCheckTimeoutRef.current = setTimeout(() => {
          performCheckRoleName(value, form.company_id, form.is_system_role);
        }, 400);
      }
    }

    // Re-check role name if target company changes
    if (field === "company_id" && form.role_name?.trim()?.length >= 2) {
      if (nameCheckTimeoutRef.current) clearTimeout(nameCheckTimeoutRef.current);
      nameCheckTimeoutRef.current = setTimeout(() => {
        performCheckRoleName(form.role_name, value, form.is_system_role);
      }, 200);
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "role_name" && form.role_name?.trim()?.length >= 2) {
      performCheckRoleName(form.role_name, form.company_id, form.is_system_role);
    }
  };

  const handleApplyPreset = (preset) => {
    setForm((prev) => ({
      ...prev,
      role_name: preset.name,
      role_code: preset.code,
      description: preset.desc,
      permissions: preset.permissions,
    }));
    setErrors({});
    setNameAvailable(null);
    performCheckRoleName(preset.name, form.company_id, form.is_system_role);
  };

  const handleAutoGenerateCode = () => {
    const generated = generateCodeFromName(form.role_name);
    if (generated) {
      handleChange("role_code", generated);
    }
  };

  const handleTogglePermission = (moduleId) => {
    setForm((prev) => {
      const current = prev.permissions || [];
      const exists = current.includes(moduleId);
      return {
        ...prev,
        permissions: exists
          ? current.filter((id) => id !== moduleId)
          : [...current, moduleId],
      };
    });
  };

  const handleSelectAllPermissions = () => {
    setForm((prev) => ({
      ...prev,
      permissions: AVAILABLE_MODULE_PERMISSIONS.map((m) => m.id),
    }));
  };

  const handleClearAllPermissions = () => {
    setForm((prev) => ({
      ...prev,
      permissions: [],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEdit && isSystemRole) {
      setErrors({ role_name: "Core system roles are protected and cannot be modified." });
      return;
    }

    const validationErrors = validateRoleForm(form, isPrivilegedAdmin, isEdit, userCompanyId);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouched({
        role_name: true,
        role_code: true,
        description: true,
        company_id: true,
      });
      setActiveTab("general");
      return;
    }

    // If role_name already has collision error, block submit and focus
    if (errors.role_name) {
      setTouched((prev) => ({ ...prev, role_name: true }));
      setActiveTab("general");
      nameInputRef.current?.focus();
      return;
    }

    const payload = {
      role_name: form.role_name.trim(),
      role_code: form.role_code.trim().toUpperCase() || undefined,
      description: form.description ? form.description.trim() : null,
      is_active: Boolean(form.is_active),
      permissions: form.permissions,
    };

    if (!isEdit) {
      payload.is_system_role = false;
      // For Admin / SuperAdmin, use the selected company from the form
      // For other users, automatically bind to userCompanyId
      const resolvedCompanyId = isPrivilegedAdmin
        ? (form.company_id ? Number(form.company_id) : (userCompanyId ? Number(userCompanyId) : null))
        : (userCompanyId ? Number(userCompanyId) : (form.company_id ? Number(form.company_id) : null));
      payload.company_id = resolvedCompanyId;
    }

    try {
      await onSubmit(payload);
    } catch (err) {
      // Backend returned error (e.g., duplicate role name collision)
      const errMsg = err?.response?.data?.message || err?.message || "";
      if (/role name/i.test(errMsg) || /already exists/i.test(errMsg)) {
        setErrors((prev) => ({
          ...prev,
          role_name: errMsg || "This role name already exists.",
        }));
        setTouched((prev) => ({ ...prev, role_name: true }));
        setNameAvailable(false);
        setActiveTab("general");
        nameInputRef.current?.focus();
      } else if (/role code/i.test(errMsg)) {
        setErrors((prev) => ({
          ...prev,
          role_code: errMsg || "This role code already exists.",
        }));
        setTouched((prev) => ({ ...prev, role_code: true }));
        setActiveTab("general");
      }
    }
  };

  return (
    <div
      className={backdropClasses}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full max-w-2xl bg-base-100 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.22)] border border-base-300 overflow-hidden flex flex-col max-h-[90vh] ${cardClasses}`}
        onClick={(e) => e.stopPropagation()}
      >

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-200/80 bg-base-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-base-content tracking-tight">
                {isEdit ? "Edit Role" : "Create New Role"}
              </h2>
              <p className="text-xs text-base-content/60">
                {isEdit
                  ? `Update ${form.role_name || "role details"}`
                  : "Define role permissions, access levels, and scopes"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-base-content/50 hover:text-base-content hover:bg-base-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* System Role Locked Notice */}
        {isEdit && isSystemRole && (
          <div className="mx-6 mt-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-300">
            <Lock className="w-4 h-4 shrink-0 text-amber-600" />
            <span>Core system roles (Super Admin and Admin) are protected and cannot be modified.</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center px-6 pt-2 border-b border-base-200/80 bg-base-200/20 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`pb-3 pt-1 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "general"
                ? "border-primary text-primary"
                : "border-transparent text-base-content/60 hover:text-base-content"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            General Information
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("permissions")}
            className={`pb-3 pt-1 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "permissions"
                ? "border-primary text-primary"
                : "border-transparent text-base-content/60 hover:text-base-content"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            Module Permissions
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-primary/10 text-primary font-bold">
              {form.permissions?.length || 0}
            </span>
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-5 flex-1 overflow-y-auto">
            {/* TAB 1: General Info */}
            {activeTab === "general" && (
              <div className="space-y-4">
                {/* Quick Presets on Add Mode */}
                {!isEdit && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-base-content/60 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      Quick Presets (1-Click Fill)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {STANDARD_ROLE_PRESETS.map((p) => {
                        const isSelected = form.role_name === p.name;
                        return (
                          <button
                            key={p.code}
                            type="button"
                            onClick={() => handleApplyPreset(p)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                              isSelected
                                ? "bg-primary text-white border-primary shadow-xs"
                                : "bg-base-200/60 hover:bg-base-200 border-base-300 text-base-content/80"
                            }`}
                          >
                            {p.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* System role notice if editing a system role */}
                {isEdit && isSystemRole && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      This is a <strong>Global System Role</strong>. System code and company scope are protected.
                    </span>
                  </div>
                )}

                {/* Role Name */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/70">
                      Role Name <span className="text-rose-500">*</span>
                    </label>
                    {isCheckingName ? (
                      <span className="text-[11px] text-primary flex items-center gap-1 font-medium animate-pulse">
                        <span className="loading loading-spinner loading-xs text-primary"></span>
                        Checking availability...
                      </span>
                    ) : nameAvailable && form.role_name.trim().length >= 2 && !errors.role_name ? (
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium animate-fadeIn">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Role name available
                      </span>
                    ) : null}
                  </div>
                  <div className="relative">
                    <input
                      ref={nameInputRef}
                      type="text"
                      value={form.role_name}
                      onChange={(e) => handleChange("role_name", e.target.value)}
                      onBlur={() => handleBlur("role_name")}
                      placeholder="e.g. Store Manager, Cashier, Billing Executive"
                      className={`w-full px-4 py-2.5 text-sm rounded-xl border bg-base-100 text-base-content placeholder:text-base-content/40 focus:outline-none transition-all ${
                        errors.role_name && touched.role_name
                          ? "border-rose-500 focus:border-rose-500 ring-2 ring-rose-500/10 bg-rose-500/5"
                          : nameAvailable && form.role_name.trim().length >= 2 && !errors.role_name
                          ? "border-emerald-500/60 focus:border-emerald-500 ring-1 ring-emerald-500/10"
                          : "border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                      }`}
                      disabled={saving}
                    />
                    {isCheckingName && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <span className="loading loading-spinner loading-xs text-primary"></span>
                      </div>
                    )}
                  </div>
                  {errors.role_name && touched.role_name && (
                    <div className="flex items-center gap-1.5 text-[11px] text-rose-500 mt-1.5 font-medium animate-fadeIn">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.role_name}</span>
                    </div>
                  )}
                </div>

                {/* Role Code & Auto-generator */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/70">
                      Role Code
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoGenerateCode}
                      disabled={!form.role_name.trim() || saving || (isEdit && isSystemRole && !isSuperAdmin)}
                      className="text-[11px] font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <Sparkles className="w-3 h-3" />
                      Auto-Generate
                    </button>
                  </div>
                  <input
                    type="text"
                    value={form.role_code}
                    onChange={(e) => handleChange("role_code", e.target.value.toUpperCase())}
                    onBlur={() => handleBlur("role_code")}
                    placeholder="e.g. STORE_MANAGER, CASHIER"
                    className={`w-full px-4 py-2.5 text-sm font-mono uppercase tracking-wider rounded-xl border bg-base-100 text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                      errors.role_code && touched.role_code
                        ? "border-rose-500 focus:border-rose-500"
                        : "border-base-300 focus:border-primary"
                    }`}
                    disabled={saving || (isEdit && isSystemRole && !isSuperAdmin)}
                  />
                  {errors.role_code && touched.role_code && (
                    <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.role_code}</p>
                  )}
                  <p className="text-[11px] text-base-content/50">
                    Unique uppercase identifier used for authorization checks.
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/70">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={form.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Outline operational responsibilities and access boundaries for this role..."
                    className="w-full px-4 py-2 text-sm rounded-xl border border-base-300 bg-base-100 text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    disabled={saving}
                  />
                  {errors.description && (
                    <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.description}</p>
                  )}
                </div>

                {/* Company Scoping: Asked for Admin and SuperAdmin; for other users derived from user data */}
                {!isEdit && (
                  <>
                    {isPrivilegedAdmin ? (
                      <div className="p-4 rounded-2xl bg-base-200/50 border border-base-200 space-y-3">
                        <CompanySelect
                          value={form.company_id}
                          onChange={(companyId) => handleChange("company_id", companyId)}
                          onBlur={() => handleBlur("company_id")}
                          error={errors.company_id && touched.company_id ? errors.company_id : null}
                          disabled={saving}
                          label="Target Company"
                          required
                          helperText={`As ${isSuperAdmin ? "Super Admin" : "Admin"}, specify the enterprise company this custom role is scoped to.`}
                        />
                      </div>
                    ) : (
                      /* Other users have company data so get from there */
                      <div className="p-3.5 rounded-2xl bg-base-200/40 border border-base-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                            <Building className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-semibold text-base-content block">
                              Assigned Company Scope
                            </span>
                            <span className="text-[11px] text-base-content/60">
                              Role will automatically belong to your company account
                            </span>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-base-300/60 text-base-content/80 font-mono font-semibold text-xs">
                          {userCompanyId ? `Company #${userCompanyId}` : "Company Bound"}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* Edit Mode Scope Indicator */}
                {isEdit && (
                  <div className="p-3.5 rounded-2xl bg-base-200/30 border border-base-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-base-content/60" />
                      <span className="text-base-content/70 font-medium">Assigned Scope:</span>
                    </div>
                    <span className="font-semibold text-base-content">
                      {isSystemRole
                        ? "Global System Role (Cross-Company)"
                        : initialData?.companyName ||
                          initialData?.company_name ||
                          companies.find((c) => Number(c.id) === Number(form.company_id))?.company_name ||
                          (form.company_id ? `Company #${form.company_id}` : "Company Specific")}
                    </span>
                  </div>
                )}

                {/* Active Status Switch */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-base-200/40 border border-base-200">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-base-content">
                      Active Status
                    </span>
                    <p className="text-[11px] text-base-content/60">
                      Users can immediately be assigned to and operate under this role
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => handleChange("is_active", e.target.checked)}
                    className="toggle toggle-success toggle-sm"
                    disabled={saving}
                  />
                </div>
              </div>
            )}

            {/* TAB 2: Module Permissions */}
            {/* {activeTab === "permissions" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-base-200">
                  <p className="text-xs text-base-content/70">
                    Select module permissions granted to users with this role.
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAllPermissions}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Select All
                    </button>
                    <span className="text-base-content/30">•</span>
                    <button
                      type="button"
                      onClick={handleClearAllPermissions}
                      className="text-xs font-semibold text-rose-500 hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {AVAILABLE_MODULE_PERMISSIONS.map((mod) => {
                    const isChecked = form.permissions?.includes(mod.id);
                    return (
                      <div
                        key={mod.id}
                        onClick={() => handleTogglePermission(mod.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isChecked
                            ? "bg-primary/5 border-primary/30 shadow-xs"
                            : "bg-base-100 hover:bg-base-200/50 border-base-200"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by parent onClick
                          className="checkbox checkbox-primary checkbox-xs mt-0.5 rounded-md"
                        />
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <p className="text-xs font-bold text-base-content">{mod.label}</p>
                          <p className="text-[11px] text-base-content/60 leading-tight">
                            {mod.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )} */}
          </div>

          {/* Modal Actions Footer */}
          <div className="px-6 py-4 border-t border-base-200 flex items-center justify-between bg-base-100 shrink-0">
            {activeTab === "general" ? (
              <button
                type="button"
                onClick={() => setActiveTab("permissions")}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                Configure Permissions &rarr;
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab("general")}
                className="text-xs font-semibold text-base-content/60 hover:text-base-content flex items-center gap-1"
              >
                &larr; Back to General
              </button>
            )}

            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handleClose}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="clip-six"
                size="md"
                loading={saving}
                disabled={saving || (isEdit && isSystemRole)}
              >
                {isEdit ? "Update Role" : "Create Role"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
