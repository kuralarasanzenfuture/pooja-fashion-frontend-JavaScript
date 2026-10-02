import React, { useState, useRef, useEffect } from "react";
import { Shield, ChevronDown, Check, Search, AlertCircle, ShieldAlert, Sparkles, Lock } from "lucide-react";

/**
 * Premium DaisyUI Role Select Component
 * Matches Pooja Fashion's Royal Purple theme (#2A0081) and CompanySelect aesthetic.
 */
export default function RoleSelect({
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  disabledRoleIds = [],
  label = "System Role",
  required = true,
  helperText = "Determines user permissions, access scopes, and module visibility.",
  placeholder = "-- Select System Role --",
  roles = [],
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  const selectedRole = roles.find((r) => String(r.id) === String(value));

  // Filter roles if search term is entered
  const filteredRoles = roles.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const name = (r.roleName || r.role_name || "").toLowerCase();
    const code = (r.roleCode || r.role_code || "").toLowerCase();
    const desc = (r.description || "").toLowerCase();
    return name.includes(q) || code.includes(q) || desc.includes(q);
  });

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        if (onBlur) onBlur();
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        if (onBlur) onBlur();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onBlur]);

  const handleSelect = (role) => {
    if (disabled) return;
    onChange(role.id);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className={`space-y-1.5 relative ${className}`} ref={dropdownRef}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/70">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
          <span className="text-[11px] text-base-content/50">
            {roles.length} active {roles.length === 1 ? "role" : "roles"}
          </span>
        </div>
      )}

      {/* DaisyUI Styled Trigger Box */}
      <div
        tabIndex={0}
        role="button"
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 bg-base-100 ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-base-200"
            : isOpen
            ? "border-primary ring-2 ring-primary/20 shadow-sm"
            : error
            ? "border-rose-500 ring-2 ring-rose-500/20"
            : "border-base-300 hover:border-primary/50"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-2xs">
            <Shield className="w-4 h-4" />
          </div>

          {selectedRole ? (
            <div className="flex items-center gap-2 min-w-0 flex-wrap">
              <span className="font-semibold text-base-content text-xs sm:text-sm truncate">
                {selectedRole.roleName || selectedRole.role_name}
              </span>
              {(selectedRole.roleCode || selectedRole.role_code) && (
                <span className="badge badge-sm bg-base-200 border-base-300 text-base-content/70 font-mono text-[10px] uppercase font-bold tracking-wider shrink-0">
                  {selectedRole.roleCode || selectedRole.role_code}
                </span>
              )}
              {(selectedRole.isSystemRole || selectedRole.is_system_role) && (
                <span className="badge badge-sm badge-primary text-[10px] uppercase font-bold tracking-wider shrink-0">
                  System
                </span>
              )}
            </div>
          ) : (
            <span className="text-base-content/40 text-xs sm:text-sm font-normal">
              {placeholder}
            </span>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 text-base-content/50 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </div>

      {/* DaisyUI Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-base-100 rounded-2xl border border-base-300 shadow-2xl shadow-slate-950/15 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {roles.length > 3 && (
            <div className="p-2 border-b border-base-200 bg-base-200/40">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search role name, code or description..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-base-300 bg-base-100 text-base-content focus:outline-none focus:border-primary"
                  autoFocus
                />
              </div>
            </div>
          )}

          <div className="max-h-60 overflow-y-auto p-1.5 space-y-1">
            {filteredRoles.length === 0 ? (
              <div className="py-6 text-center text-xs text-base-content/50">
                No matching active roles found
              </div>
            ) : (
              filteredRoles.map((role) => {
                const isSelected = String(role.id) === String(value);
                const isSystem = Boolean(role.isSystemRole || role.is_system_role);
                const isRoleDisabled =
                  !isSelected &&
                  (disabledRoleIds.includes(role.id) ||
                    disabledRoleIds.includes(Number(role.id)) ||
                    disabledRoleIds.includes(String(role.id)));

                const roleName = role.roleName || role.role_name;
                const roleCode = role.roleCode || role.role_code;
                const desc = role.description;

                return (
                  <div
                    key={role.id}
                    onClick={() => {
                      if (!isRoleDisabled) handleSelect(role);
                    }}
                    title={
                      isRoleDisabled
                        ? "System roles can only have one assigned user and this role is already assigned."
                        : undefined
                    }
                    className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      isRoleDisabled
                        ? "opacity-50 cursor-not-allowed bg-base-200/30"
                        : isSelected
                        ? "bg-primary text-primary-content shadow-xs font-semibold cursor-pointer"
                        : "hover:bg-base-200/80 text-base-content cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : isRoleDisabled
                            ? "bg-base-300 text-base-content/40"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {isRoleDisabled ? (
                          <Lock className="w-4 h-4 text-base-content/50" />
                        ) : (
                          <Shield className="w-4 h-4" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="truncate text-xs sm:text-sm font-semibold">
                            {roleName}
                          </span>
                          {roleCode && (
                            <span
                              className={`badge badge-xs text-[9px] font-mono uppercase font-bold tracking-wider ${
                                isSelected
                                  ? "badge-ghost bg-white/20 text-white"
                                  : "badge-ghost bg-base-200 text-base-content/70 border-base-300"
                              }`}
                            >
                              {roleCode}
                            </span>
                          )}
                          {isSystem && (
                            <span
                              className={`badge badge-xs text-[9px] uppercase font-bold tracking-wider ${
                                isSelected
                                  ? "bg-white/30 text-white border-transparent"
                                  : "badge-primary"
                              }`}
                            >
                              System
                            </span>
                          )}
                          {isRoleDisabled && (
                            <span className="badge badge-xs bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold text-[9px] uppercase tracking-wider">
                              Assigned (1 Max)
                            </span>
                          )}
                        </div>

                        {desc && (
                          <p
                            className={`text-[11px] truncate mt-0.5 max-w-[280px] sm:max-w-md ${
                              isSelected ? "text-white/80" : "text-base-content/50"
                            }`}
                          >
                            {desc}
                          </p>
                        )}
                      </div>
                    </div>

                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    ) : isRoleDisabled ? (
                      <Lock className="w-3.5 h-3.5 text-base-content/40 shrink-0" />
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Error or Helper text */}
      {error ? (
        <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-base-content/50">{helperText}</p>
      ) : null}
    </div>
  );
}
