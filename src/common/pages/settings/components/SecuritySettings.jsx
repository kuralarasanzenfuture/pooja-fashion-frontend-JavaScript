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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-5 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#f0f4fc] text-[#1e3a8a] flex items-center justify-center border border-[#c7d2fe]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-display">
            Security & Cookie Authentication
          </h3>
        </div>
        <p className="text-xs text-slate-500 mt-1 max-w-xl">
          Overview of your active cookie session, security keys, and counter access credentials.
        </p>
      </div>

      {/* Cookie Auth Status Box */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#f8faff] via-white to-[#f0f4fc] border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cookie className="w-4 h-4 text-[#1e3a8a]" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Cookie-Based Authentication
            </h4>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active & Secured
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Application API calls are authenticated using secure browser cookies (<code className="font-mono text-[11px] text-[#1e3a8a] bg-sky-50 px-1 py-0.5 rounded">withCredentials: true</code>). Sensitive JWT credentials remain protected against client-side script inspection.
        </p>

        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5 font-medium">
            <Laptop className="w-3.5 h-3.5 text-slate-400" /> Current POS Session:
          </span>
          <span className="font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
            {sessionId}
          </span>
        </div>
      </div>

      {/* Password Change Form */}
      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-[#1e3a8a]" /> Change Store Password
          </h4>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="currentPassword">
              Current Password
            </label>
            <input
              id="currentPassword"
              type={showPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              placeholder="Enter current password"
              className="w-full px-3 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="newPassword">
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
                  className="w-full pr-9 px-3 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter new password"
                className="w-full px-3 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]"
              />
            </div>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`p-3 text-xs font-semibold rounded-xl flex items-center gap-2 ${
              statusMessage.type === "success"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                : "bg-rose-50 border border-rose-200 text-rose-800"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleLogoutAllDevices}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign out all devices
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-[#0f1c3f] hover:bg-[#1e3a8a] text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
