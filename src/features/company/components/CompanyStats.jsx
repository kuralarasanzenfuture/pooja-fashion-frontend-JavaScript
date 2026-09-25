import React from "react";
import { Building2, CheckCircle2, AlertTriangle, Globe2, ArrowUpRight } from "lucide-react";

/**
 * Company Overview Statistics Cards - Luxury Boutique Glassmorphism Edition
 */
export default function CompanyStats({ companies = [], total = 0 }) {
  const activeCount = companies.filter((c) => c.status === "active").length;
  const inactiveCount = companies.filter((c) => c.status === "inactive" || c.status === "suspended").length;
  const defaultCurrency = companies[0]?.defaultCurrency || "INR";

  const stats = [
    {
      title: "Total Companies",
      value: total || companies.length,
      subtitle: "Registered business entities",
      icon: Building2,
      hairline: "from-[#1e3a8a] to-[#3b82f6]",
      gradient: "from-blue-600/[0.07] via-indigo-500/[0.03] to-transparent",
      iconColor: "text-[#1e3a8a]",
      iconBg: "bg-blue-50 border border-blue-200/80 shadow-xs",
    },
    {
      title: "Active Enterprises",
      value: activeCount,
      subtitle: "Fully operational & billing",
      icon: CheckCircle2,
      hairline: "from-emerald-500 to-teal-400",
      gradient: "from-emerald-600/[0.07] via-teal-500/[0.03] to-transparent",
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 border border-emerald-200/80 shadow-xs",
    },
    {
      title: "Inactive / Suspended",
      value: inactiveCount,
      subtitle: "Paused or review pending",
      icon: AlertTriangle,
      hairline: "from-amber-500 to-yellow-400",
      gradient: "from-amber-600/[0.07] via-yellow-500/[0.03] to-transparent",
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50 border border-amber-200/80 shadow-xs",
    },
    {
      title: "Base Currency & HQ",
      value: defaultCurrency,
      subtitle: companies[0]?.countryCode ? `Country: ${companies[0].countryCode}` : "India (IN)",
      icon: Globe2,
      hairline: "from-purple-500 to-indigo-500",
      gradient: "from-purple-600/[0.07] via-pink-500/[0.03] to-transparent",
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50 border border-purple-200/80 shadow-xs",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="relative overflow-hidden rounded-2xl bg-base-100 border border-base-300 p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-200 hover:-translate-y-0.5 group"
          >
            {/* Top colored hairline highlight */}
            <div
              className={`absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r ${item.hairline}`}
            />

            {/* Ambient Background Gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${item.gradient} pointer-events-none`}
            />

            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-base-content/60 font-mono">
                  {item.title}
                </p>
                <p className="text-3xl font-black text-base-content mt-1 tracking-tight">
                  {item.value}
                </p>
                <p className="text-xs sm:text-[13px] text-base-content/60 mt-1 font-medium flex items-center gap-1">
                  <span>{item.subtitle}</span>
                </p>
              </div>

              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${item.iconBg} ${item.iconColor} group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
