import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import {
  X,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Building,
  Sparkles,
  Layers,
  KeyRound,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../common/hooks/useModalAnimation.js";
import { useRoles } from "../../roles/hooks/useRoles.js";
import { useCompanies } from "../../company/hooks/useCompanies.js";
import { CompanySelect } from "../../company/components/index.js";
import {
  selectIsSuperAdmin,
  selectIsAdmin,
  selectCurrentUserCompanyId,
} from "../../../redux/selectors/authSelectors.js";

const EMPTY_FORM = {
  username: "",
  email: "",
  phone: "",
  password: "",
  role_id: "",
  branch_id: "",
  company_id: "",
  status: "active",
  two_factor_enabled: false,
};

function validateUserForm(values, isEdit = false) {
  const errors = {};
  const username = (values.username || "").trim();
  const email = (values.email || "").trim();
  const password = values.password || "";

  if (!username) {
    errors.username = "Username is required.";
  } else if (username.length < 3) {
    errors.username = "Username must be at least 3 characters.";
  } else if (username.length > 100) {
    errors.username = "Username cannot exceed 100 characters.";
  } else if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
    errors.username = "Only letters, numbers, dots, hyphens, and underscores are allowed.";
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!isEdit) {
    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long.";
    } else if (!/[A-Z]/.test(password)) {
      errors.password = "Must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(password)) {
      errors.password = "Must contain at least one lowercase letter.";
    } else if (!/[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      errors.password = "Must contain at least one number or special character.";
    }
  }

  return errors;
}

/**
 * Add / Edit User Modal
 * Admin and SuperAdmin choose company from dropdown, while other users auto-inherit their company data!
 */
export default function UserFormModal({
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
  const isPrivilegedAdmin = isSuperAdmin || isAdmin;
  const usernameInputRef = useRef(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("credentials"); // "credentials" | "assignment"

  const isEdit = mode === "edit";

  // Fetch available roles to populate role dropdown
  const { data: rolesResponse } = useRoles({ limit: 50, is_active: "true" });
  const availableRoles = rolesResponse?.data || rolesResponse?.roles || [];

  // Fetch available companies for Admin and SuperAdmin
  const { data: companiesResponse, isLoading: companiesLoading } = useCompanies({
    limit: 100,
    status: "active",
  });
  const companies = companiesResponse?.data || [];

  // Reset form whenever modal opens or initialData changes
  useEffect(() => {
    if (!isModalOpen) return;

    if (initialData) {
      setForm({
        username: initialData.username || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        password: "",
        role_id: initialData.roleId ?? initialData.role_id ?? "",
        branch_id: initialData.branchId ?? initialData.branch_id ?? "",
        company_id: initialData.companyId ?? initialData.company_id ?? "",
        status: initialData.status || "active",
        two_factor_enabled: Boolean(initialData.twoFactorEnabled ?? initialData.two_factor_enabled),
      });
    } else {
      setForm({
        ...EMPTY_FORM,
        company_id: isSuperAdmin ? "" : userCompanyId || "",
      });
    }
    setErrors({});
    setTouched({});
    setShowPassword(false);
    setActiveTab("credentials");

    setTimeout(() => {
      usernameInputRef.current?.focus();
    }, 150);
  }, [isModalOpen, initialData, isSuperAdmin, userCompanyId]);

  if (!isRendered) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateUserForm(form, isEdit);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouched({
        username: true,
        email: true,
        password: true,
      });
      setActiveTab("credentials");
      return;
    }

    const payload = {
      username: form.username.trim(),
      email: form.email.trim() ? form.email.trim().toLowerCase() : null,
      phone: form.phone.trim() ? form.phone.trim() : null,
      role_id: form.role_id ? Number(form.role_id) : null,
      branch_id: form.branch_id ? Number(form.branch_id) : null,
      two_factor_enabled: Boolean(form.two_factor_enabled),
    };

    if (!isEdit) {
      payload.password = form.password;
      payload.status = form.status;
      // If Admin or SuperAdmin specified a company_id, pass it; otherwise for other users use userCompanyId or backend auto-assigns
      if (isPrivilegedAdmin && form.company_id) {
        payload.company_id = Number(form.company_id);
      } else if (!isPrivilegedAdmin && userCompanyId) {
        payload.company_id = Number(userCompanyId);
      }
    }

    onSubmit(payload);
  };

  return (
    <div className={backdropClasses} onClick={handleClose} role="dialog" aria-modal="true">
      <div
        className={`relative w-full max-w-xl bg-base-100 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.22)] border border-base-300 overflow-hidden flex flex-col max-h-[90vh] ${cardClasses}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-200/80 bg-base-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-base-content tracking-tight">
                {isEdit ? "Edit User Account" : "Create New User"}
              </h2>
              <p className="text-xs text-base-content/60">
                {isEdit
                  ? `Update ${form.username || "user details"}`
                  : "Provision staff login credentials and access scope"}
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

        {/* Tabs */}
        <div className="flex items-center px-6 pt-2 border-b border-base-200/80 bg-base-200/20 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("credentials")}
            className={`pb-3 pt-1 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "credentials"
                ? "border-primary text-primary"
                : "border-transparent text-base-content/60 hover:text-base-content"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            Login & Account
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("assignment")}
            className={`pb-3 pt-1 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "assignment"
                ? "border-primary text-primary"
                : "border-transparent text-base-content/60 hover:text-base-content"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Role & Security
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-4 flex-1 overflow-y-auto">
            {/* TAB 1: Credentials */}
            {activeTab === "credentials" && (
              <div className="space-y-4">
                {/* Username */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/70">
                    Username <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
                    <input
                      ref={usernameInputRef}
                      type="text"
                      value={form.username}
                      onChange={(e) => handleChange("username", e.target.value)}
                      onBlur={() => handleBlur("username")}
                      placeholder="e.g. kural_admin, pooja_staff"
                      className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-base-100 text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                        errors.username && touched.username
                          ? "border-rose-500 focus:border-rose-500"
                          : "border-base-300 focus:border-primary"
                      }`}
                      disabled={saving}
                    />
                  </div>
                  {errors.username && touched.username && (
                    <p className="text-[11px] text-rose-500 font-medium">{errors.username}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/70">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      placeholder="e.g. user@poojafashion.com"
                      className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-base-100 text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                        errors.email && touched.email
                          ? "border-rose-500 focus:border-rose-500"
                          : "border-base-300 focus:border-primary"
                      }`}
                      disabled={saving}
                    />
                  </div>
                  {errors.email && touched.email && (
                    <p className="text-[11px] text-rose-500 font-medium">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/70">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-base-300 bg-base-100 text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      disabled={saving}
                    />
                  </div>
                </div>

                {/* Password (Only required on Add mode) */}
                {!isEdit && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/70">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        onBlur={() => handleBlur("password")}
                        placeholder="Min. 8 chars, 1 uppercase, 1 lowercase & 1 number"
                        className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border bg-base-100 text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                          errors.password && touched.password
                            ? "border-rose-500 focus:border-rose-500"
                            : "border-base-300 focus:border-primary"
                        }`}
                        disabled={saving}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && touched.password && (
                      <p className="text-[11px] text-rose-500 font-medium">{errors.password}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Role & Security */}
            {activeTab === "assignment" && (
              <div className="space-y-4">
                {/* Role Selection */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/70">
                    System Role <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={form.role_id}
                    onChange={(e) => handleChange("role_id", e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-base-300 bg-base-100 text-base-content focus:outline-none focus:border-primary"
                    disabled={saving}
                  >
                    <option value="">Select a Role...</option>
                    {availableRoles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.roleName} ({r.roleCode}) {r.isSystemRole ? "— System" : ""}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-base-content/50">
                    Determines user permissions, access scopes, and module visibility.
                  </p>
                </div>

                {/* Company Context: Asked for Admin and SuperAdmin; for other users get from user data */}
                {!isEdit && (
                  isPrivilegedAdmin ? (
                    <CompanySelect
                      value={form.company_id}
                      onChange={(companyId) => handleChange("company_id", companyId)}
                      disabled={saving}
                      label="Target Company"
                      placeholder="-- Auto-Assign Active Company --"
                      helperText="As Administrator, select which company to assign this user to, or leave blank for default tenant."
                    />
                  ) : (
                    <div className="p-3 rounded-2xl bg-base-200/40 border border-base-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-primary" />
                        <span className="text-base-content/70 font-medium">Assigned Company Scope:</span>
                      </div>
                      <span className="font-semibold text-base-content font-mono">
                        {userCompanyId ? `Company #${userCompanyId}` : "Company Bound"}
                      </span>
                    </div>
                  )
                )}

                {/* Status Selection (only on Add mode, Edit has dedicated action) */}
                {!isEdit && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/70">
                      Account Status
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) => handleChange("status", e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-base-300 bg-base-100 text-base-content focus:outline-none focus:border-primary"
                      disabled={saving}
                    >
                      <option value="active">Active (Full Access)</option>
                      <option value="inactive">Inactive (Suspended)</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </div>
                )}

                {/* 2FA Toggle */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-base-200/40 border border-base-200">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-base-content">
                      Two-Factor Authentication (2FA)
                    </span>
                    <p className="text-[11px] text-base-content/60">
                      Require OTP verification upon signing in
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.two_factor_enabled}
                    onChange={(e) => handleChange("two_factor_enabled", e.target.checked)}
                    className="toggle toggle-primary toggle-sm"
                    disabled={saving}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Modal Actions Footer */}
          <div className="px-6 py-4 border-t border-base-200 flex items-center justify-between bg-base-100 shrink-0">
            {activeTab === "credentials" ? (
              <button
                type="button"
                onClick={() => setActiveTab("assignment")}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                Role & Security &rarr;
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab("credentials")}
                className="text-xs font-semibold text-base-content/60 hover:text-base-content flex items-center gap-1"
              >
                &larr; Back to Credentials
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
                disabled={saving}
              >
                {isEdit ? "Update User" : "Create User"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
