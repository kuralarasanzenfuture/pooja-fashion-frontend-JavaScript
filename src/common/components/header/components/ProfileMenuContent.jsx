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
    <div className="w-80 max-w-[90vw] bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/90 divide-y divide-slate-100 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-150">
      {/* User Header Profile Card */}
      <div className="p-4 bg-gradient-to-br from-[#f8faff] via-white to-[#f0f4fc]">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0f1c3f] to-[#1e3a8a] text-white flex items-center justify-center text-sm font-bold tracking-wide shadow-md shadow-[#0f1c3f]/20">
              {displayName.slice(0, 2).toUpperCase()}
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-400/40"
              title="Session Active"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <h4 className="text-sm font-bold text-slate-900 truncate">
                {displayName}
              </h4>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#e0e7ff] text-[#1e3a8a] border border-[#c7d2fe]">
                <ShieldCheck className="w-3 h-3" />
                {userRole}
              </span>
            </div>

            <p className="text-xs text-slate-500 truncate mt-0.5">{email}</p>

            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-600">
              <Store className="w-3.5 h-3.5 text-[#1e3a8a] shrink-0" />
              <span className="truncate font-medium">{storeName}</span>
            </div>
          </div>
        </div>

        {/* Live Session Pill */}
        <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Laptop className="w-3 h-3 text-slate-400" />
            <span className="font-mono text-[10px] text-slate-600 truncate max-w-[130px]">
              {sessionId}
            </span>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
            <CheckCircle2 className="w-2.5 h-2.5" /> POS Active
          </span>
        </div>
      </div>

      {/* Navigation & Quick Actions */}
      <div className="p-2 space-y-0.5">
        <Link
          to={ROUTES.SETTINGS}
          onClick={onClose}
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 bg-[#f0f4fc]/60 hover:bg-[#f0f4fc] hover:text-[#0f1c3f] transition-colors group cursor-pointer border border-[#c7d2fe]/50"
        >
          <div className="flex items-center gap-2.5">
            <Settings className="w-4 h-4 text-[#1e3a8a] group-hover:rotate-45 transition-transform" />
            <span className="font-bold text-[#0f1c3f]">Settings & Typography</span>
          </div>
          <span className="text-[10px] font-bold text-[#1e3a8a] bg-white px-2 py-0.5 rounded-md border border-[#c7d2fe]">
            Fonts & POS
          </span>
        </Link>

        <Link
          to={ROUTES.DASHBOARD}
          onClick={onClose}
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-[#0f1c3f] hover:bg-[#f0f4fc] transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <User className="w-4 h-4 text-slate-400 group-hover:text-[#1e3a8a] transition-colors" />
            <span>Store Account & Profile</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">@{username}</span>
        </Link>

        <Link
          to={ROUTES.EMPLOYEES}
          onClick={onClose}
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-[#0f1c3f] hover:bg-[#f0f4fc] transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-slate-400 group-hover:text-[#1e3a8a] transition-colors" />
            <span>Staff & Counter Permissions</span>
          </div>
          <ExternalLink className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>

        <Link
          to={ROUTES.REPORTS}
          onClick={onClose}
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-[#0f1c3f] hover:bg-[#f0f4fc] transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <KeyRound className="w-4 h-4 text-slate-400 group-hover:text-[#1e3a8a] transition-colors" />
            <span>Security & Login Sessions</span>
          </div>
          <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
            Cookie Auth
          </span>
        </Link>
      </div>


      {/* Logout Action */}
      <div className="p-2 bg-slate-50/70">
        <button
          type="button"
          onClick={() => {
            onClose();
            onLogout();
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50/80 hover:bg-rose-100 border border-rose-200/90 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out of POS Session</span>
        </button>
      </div>
    </div>
  );
}
