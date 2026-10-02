import React from "react";
import { useSelector } from "react-redux";
import { Trash2, AlertTriangle, ShieldAlert, X } from "lucide-react";
import { Button } from "../../../common/components/ui/buttons/index.js";
import { useModalAnimation } from "../../../common/hooks/useModalAnimation.js";
import { selectCurrentUser } from "../../../redux/selectors/authSelectors.js";

/**
 * User Account Deletion Modal
 */
export default function UserDeleteModal({
  isOpen = false,
  onClose,
  user = null,
  onConfirm,
  isDeleting = false,
}) {
  const { isRendered, handleClose, backdropClasses, cardClasses } = useModalAnimation(
    isOpen && Boolean(user),
    onClose
  );
  const loggedInUser = useSelector(selectCurrentUser);

  if (!isRendered || !user) return null;

  const isSelf = loggedInUser && Number(loggedInUser.id) === Number(user.id);
  const username = user.username || "Unnamed User";
  const email = user.email || "No email";
  const roleName = user.roleName || user.roleCode || "User";

  return (
    <div className={backdropClasses} onClick={handleClose} role="dialog" aria-modal="true">
      <div
        className={`relative w-full max-w-md bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden ${cardClasses}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-base-200">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs ${
                isSelf
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
              }`}
            >
              {isSelf ? <ShieldAlert className="w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-base-content tracking-tight">
                {isSelf ? "Action Prohibited" : "Delete User Account"}
              </h2>
              <p className="text-xs text-base-content/60">
                {isSelf ? "Self-account safeguard active" : "Permanent removal action"}
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

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {isSelf ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 space-y-1.5 leading-relaxed">
              <p className="font-semibold text-sm">Cannot Delete Your Own Account</p>
              <p>
                You are currently signed in as <strong>{username}</strong>. You cannot delete your own active administrator profile from this console.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-base-content/75 leading-relaxed">
                Are you sure you want to delete the user account for{" "}
                <span className="font-bold text-base-content">{username}</span>{" "}
                (<span className="text-xs text-base-content/60">{email}</span>)?
              </p>

              <div className="p-3.5 rounded-2xl bg-base-200/50 border border-base-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-base-content/60">Assigned Role:</span>
                  <span className="font-semibold text-base-content">{roleName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/60">User ID:</span>
                  <span className="font-mono text-base-content/80">#{user.id}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-500/5 border border-rose-500/15 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  All active sessions, login history, and token delegations will be immediately terminated.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="px-6 py-4 border-t border-base-200 flex items-center justify-end gap-2.5 bg-base-100">
          <Button variant="outline" size="md" onClick={handleClose} disabled={isDeleting}>
            {isSelf ? "Close" : "Cancel"}
          </Button>
          {!isSelf && (
            <Button
              variant="danger"
              size="md"
              loading={isDeleting}
              disabled={isDeleting}
              onClick={() => onConfirm(user.id)}
            >
              Confirm Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
