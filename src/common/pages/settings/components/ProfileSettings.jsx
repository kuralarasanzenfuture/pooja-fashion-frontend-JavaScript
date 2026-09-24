import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { User, Mail, Phone, ShieldCheck, CheckCircle2 } from "lucide-react";
import { selectCurrentUser } from "../../../../redux/selectors/authSelectors.js";
import { setCredentials } from "../../../../redux/auth/authSlice.js";

export default function ProfileSettings() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const [formData, setFormData] = useState({
    name: currentUser?.name || "Pooja Sharma",
    username: currentUser?.username || "pooja.admin",
    email: currentUser?.email || "admin@poojafashion.com",
    phone: currentUser?.phone || "+91 98765 43210",
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (savedSuccess) setSavedSuccess(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...currentUser,
      ...formData,
    };
    dispatch(setCredentials({ user: updatedUser }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const displayName = formData.name || "Pooja Sharma";
  const userRole = currentUser?.role || "ADMIN";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-5 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#f0f4fc] text-[#1e3a8a] flex items-center justify-center border border-[#c7d2fe]">
            <User className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-display">
            Personal Profile & Store Role
          </h3>
        </div>
        <p className="text-xs text-slate-500 mt-1 max-w-xl">
          Manage your boutique staff identity, contact details, and POS counter operator signature.
        </p>
      </div>

      {/* Avatar & Summary Card */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-[#f8faff] via-white to-[#f0f4fc] border border-slate-200/80">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0f1c3f] to-[#1e3a8a] text-white flex items-center justify-center text-xl font-bold uppercase shadow-md shadow-[#0f1c3f]/20 shrink-0">
          {displayName.slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-base font-bold text-slate-900 truncate">
              {displayName}
            </h4>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#e0e7ff] text-[#1e3a8a] border border-[#c7d2fe]">
              <ShieldCheck className="w-3 h-3" /> {userRole}
            </span>
          </div>
          <p className="text-xs text-slate-500 truncate mt-0.5">{formData.email}</p>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3 h-3" /> Authenticated via Session Cookie
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="name">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="username">
              Username / Staff ID
            </label>
            <div className="relative">
              <span className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono">
                @
              </span>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full pl-8 pr-3 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="phone">
              Contact Phone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]"
              />
            </div>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile settings updated successfully!</span>
          </div>
        )}

        <div className="flex items-center justify-end pt-3">
          <button
            type="submit"
            className="px-4 py-2 bg-[#0f1c3f] hover:bg-[#1e3a8a] text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
}
