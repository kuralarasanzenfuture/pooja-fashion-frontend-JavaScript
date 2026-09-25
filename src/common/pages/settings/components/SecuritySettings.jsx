import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ShieldCheck,
  KeyRound,
  Cookie,
  Laptop,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
} from "lucide-react";
import { updatePassword, logoutAll } from "../../../../redux/auth/authSlice.js";
import { selectAuth } from "../../../../redux/selectors/authSelectors.js";
import { Button } from "../../../../common/components/ui/buttons/index.js";

export default function SecuritySettings() {
  const dispatch = useDispatch();
  const authState = useSelector(selectAuth);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const sessionId = authState?.session?.id || localStorage.getItem("sessionId") || "sess_cookie_pos_active";

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (newPassword.length < 6) {
      setStatusMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      await dispatch(
        updatePassword({ currentPassword, newPassword })
      ).unwrap();
      setStatusMessage({ type: "success", text: "Password updated successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setStatusMessage({ type: "error", text: typeof err === "string" ? err : "Failed to update password." });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    if (window.confirm("Are you sure you want to sign out of all active store devices?")) {
      await dispatch(logoutAll());
    }
  };

  const labelClass = "block text-xs font-bold text-base-content/80 mb-1.5";
  const inputClass =
    "w-full px-3 py-2 text-xs font-semibold rounded-xl border border-base-300 bg-base-200/50 text-base-content placeholder-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-base-100 transition-colors";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-5 border-b border-base-300">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-base-content font-display">
            Security & Cookie Authentication
          </h3>
        </div>
        <p className="text-xs text-base-content/60 mt-1 max-w-xl">
          Overview of your active cookie session, security keys, and counter access credentials.
        </p>
      </div>

      {/* Cookie Auth Status Box */}
      <div className="p-5 rounded-2xl bg-base-200/50 border border-base-300 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cookie className="w-4 h-4 text-primary" />
            <h4 className="text-xs font-bold text-base-content uppercase tracking-wider">
              Cookie-Based Authentication
            </h4>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Active & Secured
          </span>
        </div>

        <p className="text-xs text-base-content/70 leading-relaxed">
          Application API calls are authenticated using secure browser cookies (<code className="font-mono text-[11px] text-primary bg-base-300/80 px-1 py-0.5 rounded">withCredentials: true</code>). Sensitive JWT credentials remain protected against client-side script inspection.
        </p>

        <div className="pt-2 border-t border-base-300 flex items-center justify-between text-xs text-base-content/60">
          <span className="flex items-center gap-1.5 font-medium">
            <Laptop className="w-3.5 h-3.5 text-base-content/40" /> Current POS Session:
          </span>
          <span className="font-mono font-semibold text-base-content bg-base-300/60 border border-base-300 px-2 py-0.5 rounded text-[11px]">
            {sessionId}
          </span>
        </div>
      </div>

      {/* Password Change Form */}
      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-base-content uppercase tracking-wider flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-primary" /> Change Store Password
          </h4>
        </div>

        <div className="space-y-3">
          <div>
            <label className={labelClass} htmlFor="currentPassword">
              Current Password
            </label>
            <input
              id="currentPassword"
              type={showPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              placeholder="Enter current password"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass} htmlFor="newPassword">
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Min 6 characters"
                  className={`${inputClass} pr-9`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter new password"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`p-3 text-xs font-semibold rounded-xl flex items-center gap-2 ${
              statusMessage.type === "success"
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500"
                : "bg-rose-500/10 border border-rose-500/20 text-rose-500"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-500" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={LogOut}
            onClick={handleLogoutAllDevices}
            className="text-rose-500 hover:text-rose-600 border-rose-500/30 hover:bg-rose-500/10"
          >
            Sign out all devices
          </Button>

          <Button
            type="submit"
            variant="clip-six"
            size="md"
            loading={loading}
          >
            Update Account Password
          </Button>
        </div>
      </form>
    </div>
  );
}
