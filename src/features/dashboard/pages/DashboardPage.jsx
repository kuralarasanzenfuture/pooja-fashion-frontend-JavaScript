import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Receipt,
  Boxes,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  ShoppingBag,
  Sparkles,
  Shirt,
  Scissors,
} from "lucide-react";
import { selectCurrentUser } from "../../../redux/selectors/authSelectors.js";
import { ROUTES } from "../../../constants/routes.js";
import PageHeader from "../../../common/components/PageHeader.jsx";
import Button from "../../../common/components/Button.jsx";

export default function DashboardPage() {
  const currentUser = useSelector(selectCurrentUser);
  const userName = currentUser?.name || currentUser?.username || "Pooja";

  const stats = [
    {
      title: "Today's Boutique Sales",
      value: "₹68,450",
      change: "+18.4% vs yesterday",
      trend: "up",
      icon: TrendingUp,
      bg: "bg-[#f0f4fc] text-[#0f1c3f] border-[#c7d2fe]",
    },
    {
      title: "Designer Dresses & Sarees",
      value: "842 Pcs",
      change: "24 new bridal arrivals",
      trend: "neutral",
      icon: Shirt,
      bg: "bg-[#e0e7ff] text-[#1e3a8a] border-[#c7d2fe]",
    },
    {
      title: "Today's POS Invoices",
      value: "42",
      change: "Avg ₹1,630 per bill",
      trend: "up",
      icon: Receipt,
      bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    {
      title: "Fabric Bolts & Rolls",
      value: "1,180 m",
      change: "Cotton, Silk, Chanderi",
      trend: "neutral",
      icon: Boxes,
      bg: "bg-slate-50 text-slate-800 border-slate-200",
    },
  ];

  const recentBills = [
    {
      id: "INV-2026-9810",
      customer: "Aarti Boutique & Studio",
      items: "Bridal Lehenga Set (1 Pc), Silk Saree (2 Pcs)",
      amount: "₹34,050",
      status: "Paid",
      time: "8 mins ago",
    },
    {
      id: "INV-2026-9809",
      customer: "Meenakshi Fashion House",
      items: "Designer Anarkali Gown (Navy Blue)",
      amount: "₹14,800",
      status: "Paid",
      time: "26 mins ago",
    },
    {
      id: "INV-2026-9808",
      customer: "Kavita Tailoring & Cuts",
      items: "Pure Mulberry Silk (18.5m cut)",
      amount: "₹11,200",
      status: "Pending",
      time: "1 hour ago",
    },
    {
      id: "INV-2026-9807",
      customer: "Walk-in Retail Customer",
      items: "Chiffon Party Dress (Size L)",
      amount: "₹6,400",
      status: "Paid",
      time: "3 hours ago",
    },
  ];

  const lowStockAlerts = [
    { item: "Royal Navy Bridal Zari Lehenga", remaining: "2 pcs left", min: "10 pcs" },
    { item: "Pure Banarasi Silk Saree (Gold)", remaining: "4 pcs left", min: "15 pcs" },
    { item: "Chanderi Suit Fabric (Indigo)", remaining: "12 metres", min: "50m" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${userName}`}
        subtitle="Manage designer dress inventory, fabric metre cuts, and real-time POS billing."
        actions={
          <div className="flex items-center gap-3">
            <Link to={ROUTES.BILLING}>
              <Button variant="primary" icon={Plus}>
                New Dress Bill / POS
              </Button>
            </Link>
            <Link to={ROUTES.PRODUCTS}>
              <Button variant="secondary" icon={ShoppingBag}>
                Add Dress / Fabric
              </Button>
            </Link>
          </div>
        }
      />

      {/* Metric Cards (White & Navy) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {stat.title}
                </span>
                <div className={`p-2 rounded-lg border ${stat.bg}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#0f1c3f] font-display">
                  {stat.value}
                </div>
                <div className="mt-1 flex items-center text-xs text-slate-500 gap-1 font-semibold">
                  {stat.trend === "up" && (
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Recent Invoices & Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Invoices Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#0f1c3f] font-display">
                Recent POS Dress Invoices
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time transactions recorded at billing counter today
              </p>
            </div>
            <Link
              to={ROUTES.BILLING}
              className="text-xs font-bold text-[#1e3a8a] hover:text-[#0f1c3f] flex items-center gap-1"
            >
              View Invoices <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider font-bold text-slate-400">
                  <th className="pb-3 font-semibold">Bill #</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold hidden md:table-cell">Dress & Items</th>
                  <th className="pb-3 font-semibold text-right">Amount</th>
                  <th className="pb-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 font-mono text-xs font-bold text-slate-800">
                      {bill.id}
                      <span className="block text-[10px] text-slate-400 font-sans font-normal">
                        {bill.time}
                      </span>
                    </td>
                    <td className="py-3 font-semibold text-slate-900">
                      {bill.customer}
                    </td>
                    <td className="py-3 text-xs text-slate-600 hidden md:table-cell max-w-xs truncate">
                      {bill.items}
                    </td>
                    <td className="py-3 font-extrabold text-[#0f1c3f] text-right font-mono">
                      {bill.amount}
                    </td>
                    <td className="py-3 text-right">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${bill.status === "Paid"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                      >
                        {bill.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock & Fast Shortcuts (1 Col) */}
        <div className="space-y-6">
          {/* Low Stock Dress & Fabric Alerts */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-md bg-rose-50 text-rose-600 border border-rose-200">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0f1c3f] font-display">
                  Low Stock Dress Alerts
                </h3>
                <p className="text-[11px] text-slate-500">
                  Dresses & fabrics needing restocking
                </p>
              </div>
            </div>

            <div className="space-y-2.5 mt-4">
              {lowStockAlerts.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                >
                  <div className="truncate pr-2">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {item.item}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Re-order threshold: {item.min}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-rose-600 shrink-0">
                    {item.remaining}
                  </span>
                </div>
              ))}
            </div>

            <Link
              to={ROUTES.STOCK}
              className="mt-4 block text-center py-2 text-xs font-bold text-[#1e3a8a] hover:bg-[#f0f4fc] rounded-lg border border-[#c7d2fe] transition"
            >
              Manage Dress & Fabric Stock
            </Link>
          </div>

          {/* Quick Info Card: Deep Navy Blue Theme */}
          <div className="bg-gradient-to-br from-[#0f1c3f] to-[#1e3a8a] text-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-sky-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-sky-200">
                Pooja Fashion POS Terminal
              </span>
            </div>
            <h4 className="text-lg font-bold font-display leading-snug">
              Instant Dress Billing & Metre Cuts
            </h4>
            <p className="text-xs text-slate-200 mt-1 leading-relaxed">
              Scan dress barcode, compute tailoring/cutting charges, add GST, and print invoices in 1 click.
            </p>
            <Link
              to={ROUTES.BILLING}
              className="mt-4 inline-block bg-white text-[#0f1c3f] font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm hover:bg-slate-100 transition"
            >
              Open Billing Terminal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
