import React from "react";
import { Building2, CheckCircle2, AlertTriangle, Globe2 } from "lucide-react";

/**
 * Company Overview Statistics Cards
 */
export default function CompanyStats({ companies = [], total = 0 }) {
  const totalCount = total || companies.length;
  const activeCount = companies.filter((c) => c.status === "active").length;
  const inactiveCount = companies.filter(
    (c) => c.status === "inactive" || c.status === "suspended"
  ).length;
  const defaultCurrency = companies[0]?.defaultCurrency || "INR";

  const activePct = totalCount ? Math.round((activeCount / totalCount) * 100) : 0;

  const stats = [
    {
      title: "Total companies",
      value: totalCount,
      subtitle: "Registered business entities",
      icon: Building2,
      accent: "text-slate-500",
      ring: "group-hover:border-slate-300",
    },
    {
      title: "Active",
      value: activeCount,
      subtitle: totalCount ? `${activePct}% of all companies` : "Fully operational",
      icon: CheckCircle2,
      accent: "text-emerald-600",
      ring: "group-hover:border-emerald-200",
      valueAccent: "text-emerald-700",
    },
    {
      title: "Inactive / suspended",
      value: inactiveCount,
      subtitle: inactiveCount ? "Needs review" : "None pending review",
      icon: AlertTriangle,
      accent: inactiveCount ? "text-amber-600" : "text-slate-400",
      ring: "group-hover:border-amber-200",
      valueAccent: inactiveCount ? "text-amber-700" : "text-slate-900",
    },
    {
      title: "Base currency",
      value: defaultCurrency,
      subtitle: companies[0]?.countryCode
        ? `Headquartered in ${companies[0].countryCode}`
        : "Headquartered in IN",
      icon: Globe2,
      accent: "text-indigo-500",
      ring: "group-hover:border-indigo-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {stats.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className={`group relative rounded-xl bg-white border border-slate-200 p-4.5 transition-colors duration-150 ${item.ring}`}
          >
            <div className="flex items-start justify-between">
              <span className="text-[12.5px] font-medium text-slate-500 tracking-[-0.01em]">
                {item.title}
              </span>
              <Icon className={`w-4 h-4 ${item.accent} shrink-0 mt-0.5`} strokeWidth={2} />
            </div>

            <p
              className={`mt-2.5 text-[26px] font-semibold tracking-[-0.02em] leading-none ${
                item.valueAccent || "text-slate-900"
              }`}
            >
              {item.value}
            </p>

            <p className="text-[11.5px] text-slate-400 mt-2">{item.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
}