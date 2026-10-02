import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Shield,
  Building,
  Calendar,
  Clock,
  KeyRound,
  Edit2,
  CheckCircle2,
  Lock,
  Image as ImageIcon,
  Upload,
  Trash2,
  Globe,
  MapPin,
  Plus,
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  Sparkles,
  MessageSquare,
  Video,
  ChevronLeft,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  X,
} from "lucide-react";
import { Button } from "../../../common/components/ui/buttons/index.js";
import { useUser } from "../hooks/useUsers.js";
import { UserFormModal, UserPasswordModal } from "../components/index.js";

/**
 * User Profile Full Page View
 * Full-page implementation of the Connext profile design reference.
 * Supports direct route viewing (/users/:id) as well as embedded page viewing from UsersPage.
 */
export default function UserViewPage({
  userId: propUserId,
  initialUser = null,
  onBack,
  onEdit: propOnEdit,
  onResetPassword: propOnResetPassword,
}) {
  const { id: routeId } = useParams();
  const navigate = useNavigate();
  const effectiveUserId = propUserId || routeId;

  // Modals for editing / reset password when viewed as a standalone route
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Fetch fresh user data if accessed via URL without initialUser
  const {
    data: userResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useUser(effectiveUserId, {
    enabled: Boolean(effectiveUserId) && !initialUser,
  });

  const user = initialUser || userResponse?.data || userResponse;

  const [skills, setSkills] = useState([
    "Retail Management",
    "POS Billing",
    "Inventory Control",
    "GST Invoicing",
    "Store Operations",
    "Customer Relations",
  ]);
  const [newSkillText, setNewSkillText] = useState("");
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/users");
    }
  };

  const handleEditClick = () => {
    if (propOnEdit) {
      propOnEdit(user);
    } else {
      setIsEditModalOpen(true);
    }
  };

  const handlePasswordClick = () => {
    if (propOnResetPassword) {
      propOnResetPassword(user);
    } else {
      setIsPasswordModalOpen(true);
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkillText.trim() && !skills.includes(newSkillText.trim())) {
      setSkills([...skills, newSkillText.trim()]);
      setNewSkillText("");
      setIsAddingSkill(false);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Loading State
  if (isLoading && !user) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-sm font-semibold text-base-content/60">Loading staff profile...</p>
      </div>
    );
  }

  // Error State
  if ((isError || !user) && !isLoading) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-base-content">User Profile Not Found</h2>
        <p className="text-xs text-base-content/60 max-w-sm">
          {error?.message || "The requested user account could not be retrieved from the directory."}
        </p>
        <div className="flex items-center gap-3 pt-2">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Users
          </Button>
          <Button variant="primary" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  const username = user.username || "—";
  const fullName = user.fullName || user.name || user.username || "Staff Member";
  const email = user.email || "staff@poojafashion.in";
  const phone = user.phone || "+91 98765 43210";
  const roleName = user.roleName || user.role?.role_name || user.roleCode || "Operator";
  const roleCode = (user.roleCode || user.role?.role_code || "USER").toUpperCase();
  const status = user.status || "active";
  const branchName = user.branchName || user.branch?.branch_name || (user.branchId ? `Branch #${user.branchId}` : "Main Flagship Store");
  const companyName = user.companyName || user.company?.company_name || "Pooja Fashion Retail Ltd.";
  const lastLogin = user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "Never logged in";
  const createdAt = user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" }) : "October 2026";
  const twoFactor = Boolean(user.twoFactorEnabled ?? user.two_factor_enabled);

  const isSystemRole = Boolean(
    user.isSystemRole ||
    user.is_system_role ||
    user.role?.is_system_role ||
    ["SUPERADMIN", "ADMIN"].includes(roleCode)
  );

  const defaultBio =
    user.bio ||
    `${roleName} at ${companyName}. Dedicated to seamless POS retail operations, accurate inventory management, and delivering exceptional boutique customer experiences.`;

  return (
    <div className="w-full min-h-screen bg-base-200/30 pb-20">
      {/* Top Page Header & Navigation Bar */}
      <div className="bg-base-100 border-b border-base-300 sticky top-0 z-20 shadow-2xs backdrop-blur-md bg-base-100/90">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Breadcrumb & Back */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-base-200 hover:bg-base-300 text-base-content transition-all shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Users</span>
            </button>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-base-content/60 font-medium">
              <span>Users</span>
              <span>/</span>
              <span className="text-base-content font-bold">{username}</span>
              <span>/</span>
              <span className="text-primary font-semibold">Profile View</span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2.5">
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                status === "active"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25"
              }`}
            >
              {status}
            </span>

            <Button variant="outline" size="sm" onClick={handlePasswordClick}>
              <KeyRound className="w-3.5 h-3.5 mr-1 text-amber-500" />
              <span className="hidden sm:inline">Reset Password</span>
            </Button>

            <Button variant="clip-six" size="sm" onClick={handleEditClick}>
              <Edit2 className="w-3.5 h-3.5 mr-1" />
              <span>Edit Profile</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Page Content Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        <div className="bg-base-100 rounded-3xl border border-base-300 shadow-sm overflow-hidden">
          {/* Cover Banner Area (from Reference Image) */}
          <div className="relative overflow-hidden bg-gradient-to-r from-primary/95 via-purple-700 to-indigo-900 h-52 sm:h-64 shadow-inner border-b border-base-300">
            {/* Ambient decorative lighting */}
            <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-pink-500/25 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-primary/35 blur-3xl pointer-events-none" />

            {/* Subtle Brand Watermark */}
            <div className="absolute top-6 left-8 text-white/20 font-black text-3xl tracking-widest select-none uppercase">
              Pooja Fashion
            </div>

            {/* "Add cover image" Button (Top right in reference) */}
            <div className="absolute top-5 right-5">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-base-100/90 hover:bg-base-100 text-base-content backdrop-blur-md border border-white/20 shadow-sm transition-all"
              >
                <ImageIcon className="w-3.5 h-3.5 text-primary" />
                <span>Add cover image</span>
              </button>
            </div>

            {/* Large Squircle Avatar Overlapping Banner */}
            <div className="absolute -bottom-12 left-8 sm:left-12 z-10">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl shadow-2xl border-4 border-base-100 bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 flex items-center justify-center text-white font-black text-3xl sm:text-4xl select-none tracking-wider">
                {username.slice(0, 2).toUpperCase()}
              </div>
            </div>
          </div>

          {/* User Headline & Context Tags */}
          <div className="pt-16 px-6 sm:px-12 pb-8 border-b border-base-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-base-content tracking-tight">
                    {fullName}
                  </h1>
                  <span className="text-sm text-base-content/50 font-mono font-medium">
                    @{username}
                  </span>
                  {isSystemRole && (
                    <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold flex items-center gap-1">
                      <Lock className="w-3 h-3" /> System Account
                    </span>
                  )}
                </div>

                <p className="text-xs text-base-content/70 font-medium flex items-center gap-2.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-primary font-semibold">
                    <Shield className="w-3.5 h-3.5" /> {roleName}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-base-content/40" /> {companyName}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-base-content/40" /> {branchName}
                  </span>
                </p>
              </div>

              {/* Action Buttons in Header */}
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="md" onClick={handlePasswordClick}>
                  <KeyRound className="w-4 h-4 mr-1.5 text-amber-500" />
                  Reset Password
                </Button>
                <Button variant="clip-six" size="md" onClick={handleEditClick}>
                  <Edit2 className="w-4 h-4 mr-1.5" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Structured Two-Column Reference Rows (Reference Design Layout) */}
          <div className="p-6 sm:p-12 space-y-8">
            {/* ROW 1: Full name */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 items-start pb-7 border-b border-base-200">
              <div className="md:col-span-4 space-y-1">
                <h3 className="text-sm font-bold text-base-content">Full name</h3>
                <p className="text-xs text-base-content/60">Your display name.</p>
              </div>
              <div className="md:col-span-8">
                <input
                  type="text"
                  readOnly
                  value={fullName}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-base-300 bg-base-100 text-base-content font-medium focus:outline-none"
                />
              </div>
            </div>

            {/* ROW 2: Username */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 items-start pb-7 border-b border-base-200">
              <div className="md:col-span-4 space-y-1">
                <h3 className="text-sm font-bold text-base-content">Username</h3>
                <p className="text-xs text-base-content/60">A unique name for your profile.</p>
              </div>
              <div className="md:col-span-8">
                <div className="flex items-center rounded-xl border border-base-300 bg-base-100 overflow-hidden px-4 py-2.5">
                  <span className="text-xs text-base-content/50 font-mono select-none pr-1">
                    poojafashion.com/
                  </span>
                  <input
                    type="text"
                    readOnly
                    value={username}
                    className="flex-1 bg-transparent text-sm font-semibold text-base-content focus:outline-none"
                  />
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                </div>
              </div>
            </div>

            {/* ROW 3: Profile photo */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 items-start pb-7 border-b border-base-200">
              <div className="md:col-span-4 space-y-1">
                <h3 className="text-sm font-bold text-base-content">Profile photo</h3>
                <p className="text-xs text-base-content/60">This photo will be visible to others.</p>
              </div>
              <div className="md:col-span-8 flex items-center gap-5 flex-wrap">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 flex items-center justify-center text-white font-black text-xl shadow-sm shrink-0">
                  {username.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleEditClick}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-base-200 hover:bg-base-300 text-base-content border border-base-300 transition-colors shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-primary" />
                    Upload new image
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-base-100 hover:bg-rose-500/10 text-base-content/60 hover:text-rose-600 border border-base-300 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete current image
                  </button>
                </div>
              </div>
            </div>

            {/* ROW 4: About you */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 items-start pb-7 border-b border-base-200">
              <div className="md:col-span-4 space-y-1">
                <h3 className="text-sm font-bold text-base-content">About you</h3>
                <p className="text-xs text-base-content/60">
                  Write a description for your profile. URLs are hyperlinked.
                </p>
              </div>
              <div className="md:col-span-8 space-y-2">
                <div className="rounded-2xl border-2 border-primary/40 focus-within:border-primary bg-base-100 p-4 shadow-2xs transition-all">
                  <p className="text-sm leading-relaxed text-base-content/90 font-medium min-h-[70px]">
                    {defaultBio}
                  </p>
                  {/* Rich Text Toolbar */}
                  <div className="flex items-center justify-end gap-1.5 pt-2.5 border-t border-base-200 text-primary">
                    <button type="button" className="p-1 hover:bg-primary/10 rounded transition-colors" title="Bold">
                      <Bold className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-1 hover:bg-primary/10 rounded transition-colors" title="Italic">
                      <Italic className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-1 hover:bg-primary/10 rounded transition-colors" title="Underline">
                      <Underline className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-1 hover:bg-primary/10 rounded transition-colors" title="Link">
                      <LinkIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 5: What do you do? / Skills */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 items-start pb-7 border-b border-base-200">
              <div className="md:col-span-4 space-y-1">
                <h3 className="text-sm font-bold text-base-content">What do you do?</h3>
                <p className="text-xs text-base-content/60">Your main skills (up to 20).</p>
              </div>
              <div className="md:col-span-8">
                <div className="p-3.5 rounded-2xl border border-base-300 bg-base-100 flex flex-wrap items-center gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-base-200/80 hover:bg-base-200 text-base-content border border-base-300 transition-colors"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-base-content/40 hover:text-rose-500 transition-colors ml-0.5"
                        title="Remove skill"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {isAddingSkill ? (
                    <form onSubmit={handleAddSkill} className="inline-flex items-center gap-1.5">
                      <input
                        type="text"
                        value={newSkillText}
                        onChange={(e) => setNewSkillText(e.target.value)}
                        placeholder="Type skill name..."
                        className="px-3 py-1.5 text-xs rounded-xl border border-primary bg-base-100 text-base-content focus:outline-none"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-primary text-primary-content hover:bg-primary/90"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingSkill(false)}
                        className="px-2 py-1 text-xs text-base-content/50 hover:text-base-content"
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsAddingSkill(true)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center border border-dashed border-base-300 text-base-content/50 hover:text-primary hover:border-primary transition-colors"
                      title="Add skill tag"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ROW 6: Staff Portal */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 items-start pb-7 border-b border-base-200">
              <div className="md:col-span-4 space-y-1">
                <h3 className="text-sm font-bold text-base-content">Staff portal</h3>
                <p className="text-xs text-base-content/60">Your online page, store portal, or internal site.</p>
              </div>
              <div className="md:col-span-8">
                <div className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-base-300 bg-base-100">
                  <span className="text-xs font-medium text-base-content font-mono truncate">
                    poojafashion.in/portal/{username}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                </div>
              </div>
            </div>

            {/* ROW 7: Location & Timezone */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 items-start pb-7 border-b border-base-200">
              <div className="md:col-span-4 space-y-1">
                <h3 className="text-sm font-bold text-base-content">Location & Timezone</h3>
                <p className="text-xs text-base-content/60">Store branch & regional operating hours.</p>
              </div>
              <div className="md:col-span-8">
                <div className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-base-300 bg-base-100">
                  <span className="text-xs font-semibold text-base-content flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    {branchName}, India / Indian Standard Time (IST UTC +5:30)
                  </span>
                  <Clock className="w-4 h-4 text-base-content/40 shrink-0" />
                </div>
              </div>
            </div>

            {/* ROW 8: Connect with work channels */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 items-start pb-7 border-b border-base-200">
              <div className="md:col-span-4 space-y-1">
                <h3 className="text-sm font-bold text-base-content">Connect with work socials</h3>
                <p className="text-xs text-base-content/60">Direct staff communication & collaboration links.</p>
              </div>
              <div className="md:col-span-8 space-y-3">
                {/* Email Channel */}
                <div className="flex items-center rounded-xl border border-base-300 bg-base-100 px-4 py-2.5">
                  <Mail className="w-4 h-4 text-primary shrink-0 mr-2.5" />
                  <span className="text-xs text-base-content/50 font-mono pr-1 select-none">email/</span>
                  <span className="text-xs font-semibold text-base-content flex-1 truncate">{email}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                </div>

                {/* Phone Channel */}
                <div className="flex items-center rounded-xl border border-base-300 bg-base-100 px-4 py-2.5">
                  <Phone className="w-4 h-4 text-emerald-500 shrink-0 mr-2.5" />
                  <span className="text-xs text-base-content/50 font-mono pr-1 select-none">phone/</span>
                  <span className="text-xs font-semibold text-base-content flex-1 truncate">{phone}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                </div>

                {/* Internal Slack Channel */}
                <div className="flex items-center rounded-xl border border-base-300 bg-base-100 px-4 py-2.5">
                  <MessageSquare className="w-4 h-4 text-amber-500 shrink-0 mr-2.5" />
                  <span className="text-xs text-base-content/50 font-mono pr-1 select-none">slack.com/</span>
                  <span className="text-xs font-semibold text-base-content flex-1 truncate">poojafashion-{username}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                </div>

                {/* Google Meet Channel */}
                <div className="flex items-center rounded-xl border border-base-300 bg-base-100 px-4 py-2.5">
                  <Video className="w-4 h-4 text-sky-500 shrink-0 mr-2.5" />
                  <span className="text-xs text-base-content/50 font-mono pr-1 select-none">meet.google.com/</span>
                  <span className="text-xs font-semibold text-base-content flex-1 truncate">{username}-room</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                </div>
              </div>
            </div>

            {/* ROW 9: Security Audit & Footprint */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 items-start">
              <div className="md:col-span-4 space-y-1">
                <h3 className="text-sm font-bold text-base-content">Security & Access Audit</h3>
                <p className="text-xs text-base-content/60">System credentials and session status.</p>
              </div>
              <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-2xl bg-base-200/50 border border-base-200 space-y-1">
                  <span className="text-xs text-base-content/55 flex items-center gap-1.5 font-medium">
                    <Lock className="w-3.5 h-3.5 text-primary" /> Two-Factor (2FA)
                  </span>
                  <p className="text-xs font-bold text-base-content flex items-center gap-1 mt-0.5">
                    {twoFactor ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Enabled
                      </span>
                    ) : (
                      <span className="text-base-content/50">Disabled</span>
                    )}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-base-200/50 border border-base-200 space-y-1">
                  <span className="text-xs text-base-content/55 flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-500" /> Last Login
                  </span>
                  <p className="text-xs font-bold text-base-content truncate mt-0.5">{lastLogin}</p>
                </div>

                <div className="p-4 rounded-2xl bg-base-200/50 border border-base-200 space-y-1">
                  <span className="text-xs text-base-content/55 flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-emerald-500" /> Account Created
                  </span>
                  <p className="text-xs font-bold text-base-content truncate mt-0.5">{createdAt}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Page Bottom Footer Bar */}
          <div className="px-6 sm:px-12 py-5 border-t border-base-200 flex items-center justify-between bg-base-100">
            <Button variant="outline" size="md" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Users Directory
            </Button>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="md" onClick={handlePasswordClick}>
                <KeyRound className="w-4 h-4 mr-1.5 text-amber-500" />
                Reset Password
              </Button>
              <Button variant="clip-six" size="md" onClick={handleEditClick}>
                <Edit2 className="w-4 h-4 mr-1.5" />
                Edit User Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Internal Modals for Edit & Password if opened directly via URL */}
      {isEditModalOpen && (
        <UserFormModal
          isOpen={isEditModalOpen}
          initialData={user}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => {
            setIsEditModalOpen(false);
            refetch();
          }}
        />
      )}

      {isPasswordModalOpen && (
        <UserPasswordModal
          isOpen={isPasswordModalOpen}
          user={user}
          onClose={() => setIsPasswordModalOpen(false)}
          onSuccess={() => {
            setIsPasswordModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
