import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ShieldCheck } from "lucide-react";
import { selectCurrentUser, selectAuth } from "../../../../redux/selectors/authSelectors.js";
import { logoutUser } from "../../../../redux/auth/authSlice.js";
import { ROUTES } from "../../../../constants/routes.js";
import appConfig from "../../../../config/appConfig.js";
import ProfileMenuContent from "./ProfileMenuContent.jsx";

export default function ProfileDropdown() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentUser = useSelector(selectCurrentUser);
  const authState = useSelector(selectAuth);

  const displayName = currentUser?.name || currentUser?.username || "Pooja Sharma";
  const userRole = currentUser?.role || "ADMIN";
  const storeName = currentUser?.storeName || appConfig.name;

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <div
      ref={dropdownRef}
      className={`dropdown dropdown-bottom dropdown-end ${
        isOpen ? "dropdown-open" : ""
      } relative inline-block text-left`}
    >
      {/* Profile Trigger Button */}
      <button
        type="button"
        role="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-2xl border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 group ${
          isOpen
            ? "bg-primary/15 border-primary/30 shadow-sm"
            : "bg-base-200 hover:bg-base-300 border-base-300 hover:shadow-2xs"
        }`}
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-xl bg-base-200 border border-base-300 overflow-hidden flex items-center justify-center text-xs font-bold uppercase shadow-sm group-hover:scale-105 transition-transform">
            <img
              src={currentUser?.avatarUrl || "/images/pooja-fashion-logo.jpg"}
              alt={displayName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                if (e.currentTarget.nextElementSibling) {
                  e.currentTarget.nextElementSibling.style.display = "flex";
                }
              }}
            />
            <span className="hidden w-full h-full items-center justify-center bg-primary text-primary-content font-bold text-xs">
              {displayName.slice(0, 2)}
            </span>
          </div>
          <span
            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-base-100 ring-1 ring-emerald-400/40"
            title="Online & Cookie Authenticated"
          />
        </div>

        <div className="hidden md:flex flex-col text-left">
          <span className="text-xs font-bold text-base-content leading-tight group-hover:text-primary transition-colors">
            {displayName}
          </span>
          <span className="text-[10px] uppercase font-bold text-primary tracking-wider flex items-center gap-1 mt-0.5">
            <ShieldCheck className="w-2.5 h-2.5" /> {userRole}
          </span>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-base-content/50 transition-transform duration-250 ${
            isOpen ? "rotate-180 text-primary" : "group-hover:text-base-content"
          }`}
        />
      </button>

      {/* DaisyUI Dropdown Content */}
      {isOpen && (
        <div className="dropdown-content absolute right-0 top-full mt-2 z-50 origin-top-right">
          <ProfileMenuContent
            user={currentUser}
            session={authState?.session}
            displayName={displayName}
            userRole={userRole}
            storeName={storeName}
            onLogout={handleLogout}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
