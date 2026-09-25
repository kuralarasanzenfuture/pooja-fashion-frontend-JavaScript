import {
  User,
  ShieldCheck,
  Store,
  KeyRound,
  LogOut,
  ExternalLink,
  Laptop,
  CheckCircle2,
  Sparkles,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../../constants/routes.js";

export default function ProfileMenuContent({
  user,
  session,
  displayName,
  userRole,
  storeName,
  onLogout,
  onClose,
}) {
  const email = user?.email || "admin@poojafashion.com";
  const username = user?.username || "pooja.admin";
  const sessionId = session?.id || localStorage.getItem("sessionId") || "sess_active_pos";

  return (
    <div className="w-80 max-w-[90vw] bg-base-100 rounded-2xl shadow-xl border border-base-300 divide-y divide-base-200 overflow-hidden text-base-content animate-in fade-in zoom-in-95 duration-150">
      {/* User Header Profile Card */}
      <div className="p-4 bg-base-200/50">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0f1c3f] to-[#1e3a8a] text-white flex items-center justify-center text-sm font-bold tracking-wide shadow-md shadow-[#0f1c3f]/20">
              {displayName.slice(0, 2).toUpperCase()}
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-base-100 ring-1 ring-emerald-400/40"
              title="Session Active"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <h4 className="text-sm font-bold text-base-content truncate">
                {displayName}
              </h4>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/15 text-primary border border-primary/20">
                <ShieldCheck className="w-3 h-3" />
                {userRole}
              </span>
            </div>

            <p className="text-xs text-base-content/60 truncate mt-0.5">{email}</p>

            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-base-content/70">
              <Store className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate font-medium">{storeName}</span>
            </div>
          </div>
        </div>

        {/* Live Session Pill */}
        <div className="mt-3 pt-2.5 border-t border-base-300 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-base-content/60">
            <Laptop className="w-3 h-3 text-base-content/40" />
            <span className="font-mono text-[10px] text-base-content/70 truncate max-w-[130px]">
              {sessionId}
            </span>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-2.5 h-2.5" /> POS Active
          </span>
        </div>
      </div>

      {/* Navigation & Quick Actions */}
      <div className="p-2 space-y-0.5">
        <Link
          to={ROUTES.SETTINGS}
          onClick={onClose}
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-base-content bg-base-200/60 hover:bg-base-200 transition-colors group cursor-pointer border border-base-300"
        >
          <div className="flex items-center gap-2.5">
            <Settings className="w-4 h-4 text-primary group-hover:rotate-45 transition-transform" />
            <span className="font-bold text-base-content">Settings & Typography</span>
          </div>
          <span className="text-[10px] font-bold text-primary bg-base-100 px-2 py-0.5 rounded-md border border-base-300">
            Fonts & POS
          </span>
        </Link>

        <Link
          to={ROUTES.DASHBOARD}
          onClick={onClose}
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-base-content/80 hover:text-base-content hover:bg-base-200 transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <User className="w-4 h-4 text-base-content/50 group-hover:text-primary transition-colors" />
            <span>Store Account & Profile</span>
          </div>
          <span className="text-[10px] text-base-content/50 font-mono">@{username}</span>
        </Link>

        <Link
          to={ROUTES.EMPLOYEES}
          onClick={onClose}
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-base-content/80 hover:text-base-content hover:bg-base-200 transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-base-content/50 group-hover:text-primary transition-colors" />
            <span>Staff & Counter Permissions</span>
          </div>
          <ExternalLink className="w-3 h-3 text-base-content/50 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>

        <Link
          to={ROUTES.REPORTS}
          onClick={onClose}
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-base-content/80 hover:text-base-content hover:bg-base-200 transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <KeyRound className="w-4 h-4 text-base-content/50 group-hover:text-primary transition-colors" />
            <span>Security & Login Sessions</span>
          </div>
          <span className="text-[10px] font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
            Cookie Auth
          </span>
        </Link>
      </div>

      {/* Logout Action */}
      <div className="p-2 bg-base-200/50">
        <button
          type="button"
          onClick={() => {
            onClose();
            onLogout();
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out of POS Session</span>
        </button>
      </div>
    </div>
  );
}
