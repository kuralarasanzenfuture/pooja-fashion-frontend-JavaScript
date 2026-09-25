import { useState, useRef, useEffect } from "react";
import { Bell, CheckCircle2, Clock, Sparkles } from "lucide-react";

const sampleNotifications = [
  {
    id: 1,
    title: "Bridal Lehenga low stock",
    description: "Royal Navy Bridal Zari Lehenga is down to 2 pieces.",
    time: "10 mins ago",
    unread: true,
  },
  {
    id: 2,
    title: "GST Invoice #INV-9810 Paid",
    description: "₹34,050 settled via QR / UPI for Aarti Boutique.",
    time: "25 mins ago",
    unread: true,
  },
  {
    id: 3,
    title: "Weaver Inward Arrived",
    description: "Banarasi silk sarees batch inwards verified.",
    time: "2 hours ago",
    unread: false,
  },
];

export default function HeaderNotifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(sampleNotifications);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div
      ref={dropdownRef}
      className={`dropdown dropdown-bottom dropdown-end ${
        isOpen ? "dropdown-open" : ""
      } relative inline-block text-left`}
    >
      <button
        type="button"
        role="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`p-2 rounded-xl border transition-all cursor-pointer focus:outline-none relative ${
          isOpen
            ? "bg-primary/15 text-primary border-primary/30 shadow-xs"
            : "bg-base-200 hover:bg-base-300 text-base-content/70 hover:text-base-content border-base-300"
        }`}
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4 transition-transform active:scale-90" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-base-100">
            <span className="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-75" />
          </span>
        )}
      </button>

      {isOpen && (
        <div className="dropdown-content absolute right-0 top-full mt-2.5 w-84 max-w-[92vw] bg-base-100/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-base-300 divide-y divide-base-200 z-50 overflow-hidden text-base-content animate-in fade-in zoom-in-95 duration-150">
          <div className="p-3.5 flex items-center justify-between bg-base-200/70 border-b border-base-300">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-primary text-primary-content flex items-center justify-center shadow-2xs">
                <Sparkles className="w-3 h-3" />
              </div>
              <span className="text-xs font-bold text-base-content font-display">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.2 bg-primary/15 text-primary text-[10px] font-bold rounded-full border border-primary/20">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-[11px] font-bold text-primary hover:underline transition-colors cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="divide-y divide-base-200/80 max-h-72 overflow-y-auto scrollbar-thin">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 text-xs transition-colors hover:bg-base-200/60 ${
                  n.unread ? "bg-primary/5" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-base-content leading-snug">{n.title}</span>
                  {n.unread && (
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1 ring-2 ring-primary/30" />
                  )}
                </div>
                <p className="text-[11px] text-base-content/60 mt-1 leading-relaxed">
                  {n.description}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-base-content/40 mt-2 font-medium">
                  <Clock className="w-3 h-3 text-base-content/40" />
                  <span>{n.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 text-center bg-base-200/60">
            <span className="text-[11px] text-base-content/60 font-semibold flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> POS Notification Center Active
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
