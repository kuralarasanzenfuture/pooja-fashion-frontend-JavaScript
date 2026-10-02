import React from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  Building,
  Calendar,
  Clock,
  KeyRound,
  X,
  Edit2,
  CheckCircle2,
  XCircle,
  Lock,
} from "lucide-react";
import { Button } from "../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../common/hooks/useModalAnimation.js";

/**
 * User Details Drawer / Modal
 */
export default function UserDetailsModal({
  isOpen = false,
  onClose,
  user = null,
  onEdit,
  onResetPassword,
}) {
  const { isRendered, handleClose, backdropClasses, cardClasses } = useModalAnimation(
    isOpen && Boolean(user),
    onClose
  );

  if (!isRendered || !user) return null;

  const username = user.username || "—";
  const email = user.email || "—";
  const phone = user.phone || "—";
  const roleName = user.roleName || user.roleCode || "User";
  const roleCode = user.roleCode || "—";
  const status = user.status || "active";
  const branchName = user.branchName || (user.branchId ? `Branch #${user.branchId}` : "Main Branch");
  const companyName = user.companyName || (user.companyId ? `Company #${user.companyId}` : "Pooja Fashion");
  const lastLogin = user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "Never";
  const createdAt = user.createdAt ? new Date(user.createdAt).toLocaleString() : "—";
  const twoFactor = Boolean(user.twoFactorEnabled ?? user.two_factor_enabled);

  const getStatusBadge = (st) => {
    switch (st) {
      case "active":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "inactive":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "blocked":
      case "locked":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      default:
        return "bg-base-200 text-base-content/60 border-base-300";
    }
  };

  return (
    <div className={backdropClasses} onClick={handleClose} role="dialog" aria-modal="true">
      <div
        className={`relative w-full max-w-lg bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden ${cardClasses}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-base-200">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-base font-bold shadow-xs">
              {username.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-base-content tracking-tight">
                  {username}
                </h2>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getStatusBadge(
                    status
                  )}`}
                >
                  {status}
                </span>
              </div>
              <p className="text-xs text-base-content/60">{email}</p>
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

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[calc(85vh-140px)] overflow-y-auto">
          {/* Quick Badges Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Shield className="w-3.5 h-3.5" />
              {roleName} ({roleCode})
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-base-200/80 text-base-content border border-base-300">
              <Building className="w-3.5 h-3.5 text-base-content/60" />
              {companyName} • {branchName}
            </span>
          </div>

          {/* Contact & Profile Info */}
          <div className="p-4 rounded-2xl bg-base-200/40 border border-base-200 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-base-content/60 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email
              </span>
              <span className="font-medium text-base-content">{email}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-base-content/60 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Phone
              </span>
              <span className="font-medium text-base-content">{phone}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-base-content/60 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Two-Factor (2FA)
              </span>
              <span className="font-medium text-base-content flex items-center gap-1">
                {twoFactor ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Enabled
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-base-content/40" /> Disabled
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Timeline & Security Audit */}
          <div className="space-y-2 pt-2 border-t border-base-200">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
              Login & Activity Audit
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-base-200/30 border border-base-200 space-y-1">
                <span className="text-[11px] text-base-content/50 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Last Login
                </span>
                <p className="text-xs font-medium text-base-content truncate">{lastLogin}</p>
              </div>
              <div className="p-3 rounded-xl bg-base-200/30 border border-base-200 space-y-1">
                <span className="text-[11px] text-base-content/50 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Account Created
                </span>
                <p className="text-xs font-medium text-base-content truncate">{createdAt}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-base-200 flex items-center justify-between bg-base-100">
          <Button variant="outline" size="md" onClick={handleClose}>
            Close
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                handleClose();
                setTimeout(() => onResetPassword(user), 200);
              }}
            >
              <KeyRound className="w-4 h-4 mr-1.5" />
              Reset Password
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                handleClose();
                setTimeout(() => onEdit(user), 200);
              }}
            >
              <Edit2 className="w-4 h-4 mr-1.5" />
              Edit User
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
