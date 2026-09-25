import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Camera,
  UploadCloud,
  Eye,
  Maximize2,
  Trash2,
  Sparkles,
} from "lucide-react";
import { selectCurrentUser } from "../../../../redux/selectors/authSelectors.js";
import { setCredentials } from "../../../../redux/auth/authSlice.js";
import { Button } from "../../../../common/components/ui/buttons/index.js";
import ImageViewerModal from "../../../../common/components/ui/ImageViewerModal.jsx";

export default function ProfileSettings() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const [formData, setFormData] = useState({
    name: currentUser?.name || "Pooja Sharma",
    username: currentUser?.username || "pooja.admin",
    email: currentUser?.email || "admin@poojafashion.com",
    phone: currentUser?.phone || "+91 98765 43210",
    avatarUrl: currentUser?.avatarUrl || "/images/pooja-fashion-logo.jpg",
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (savedSuccess) setSavedSuccess(false);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({
        ...prev,
        avatarUrl: event.target.result,
      }));
    };
    reader.readAsDataURL(file);
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
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const labelClass = "block text-xs font-bold text-base-content/80 mb-1.5";
  const inputClass =
    "w-full px-3 py-2 text-xs font-semibold rounded-xl border border-base-300 bg-base-200/50 text-base-content placeholder-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-base-100 transition-colors";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-5 border-b border-base-300">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
            <User className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-base-content font-display">
            Personal Profile & Store Role
          </h3>
        </div>
        <p className="text-xs text-base-content/60 mt-1 max-w-xl">
          Manage your boutique staff identity, contact details, and POS counter operator signature.
        </p>
      </div>

      {/* Avatar & Summary Card */}
      <div className="flex flex-col sm:flex-row items-center gap-4 p-5 rounded-2xl bg-base-200/60 border border-base-300">
        {/* Avatar with click-to-view and camera upload button */}
        <div className="relative group shrink-0">
          <div
            onClick={() => setIsImageViewerOpen(true)}
            title="Click to view full high-resolution image"
            className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-base-100 border-2 border-primary/20 shadow-md overflow-hidden flex items-center justify-center cursor-pointer relative group hover:border-primary transition-all"
          >
            <img
              src={formData.avatarUrl || "/images/pooja-fashion-logo.jpg"}
              alt={displayName}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                if (e.currentTarget.nextElementSibling) {
                  e.currentTarget.nextElementSibling.style.display = "flex";
                }
              }}
            />
            <span className="hidden w-full h-full items-center justify-center bg-primary text-primary-content font-bold text-lg">
              {initials}
            </span>

            {/* Hover hint */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-2xs">
              <Maximize2 className="w-5 h-5 text-amber-300 animate-pulse" />
              <span className="text-[9px] font-bold mt-0.5">View HD</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Upload custom avatar image"
            className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-primary text-primary-content shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer border-2 border-base-100 z-10"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageFileChange}
          accept="image/*"
          className="hidden"
        />

        <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <h4 className="text-base font-bold text-base-content truncate">
              {displayName}
            </h4>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/15 text-primary border border-primary/20">
              <ShieldCheck className="w-3 h-3" /> {userRole}
            </span>
          </div>

          <p className="text-xs text-base-content/60 truncate">{formData.email}</p>

          <div className="flex items-center justify-center sm:justify-start gap-3 pt-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              Upload Photo
            </button>
            <span className="text-base-content/30">•</span>
            <button
              type="button"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  avatarUrl: "/images/pooja-fashion-logo.jpg",
                }));
              }}
              className="inline-flex items-center gap-1 text-xs text-base-content/60 hover:text-base-content font-medium cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              Use Boutique Emblem
            </button>
            <span className="text-base-content/30">•</span>
            <button
              type="button"
              onClick={() => setIsImageViewerOpen(true)}
              className="inline-flex items-center gap-1 text-xs text-base-content/60 hover:text-base-content font-medium cursor-pointer"
            >
              <Eye className="w-3 h-3" />
              Inspect
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="name">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-base-content/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="username">
              Username / Staff ID
            </label>
            <div className="relative">
              <span className="text-base-content/40 absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono">
                @
              </span>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                className={`${inputClass} pl-8`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-base-content/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="phone">
              Contact Phone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-base-content/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-success/15 border border-success/30 text-success text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Profile settings updated successfully across your session!</span>
          </div>
        )}

        <div className="flex items-center justify-end pt-3 border-t border-base-300">
          <Button type="submit" variant="clip-six" size="md">
            Save Profile Changes
          </Button>
        </div>
      </form>

      {/* Lightbox Modal */}
      <ImageViewerModal
        isOpen={isImageViewerOpen}
        onClose={() => setIsImageViewerOpen(false)}
        src={formData.avatarUrl || "/images/pooja-fashion-logo.jpg"}
        title={displayName}
        subtitle={`${userRole} • High-Resolution Profile Photo`}
      />
    </div>
  );
}
