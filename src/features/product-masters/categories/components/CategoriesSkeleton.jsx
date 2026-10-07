import React from "react";

/**
 * CategoriesSkeleton
 * Shimmering Loading Skeleton for Categories
 * Matches both Table and Card layouts with smooth pulsating placeholder elements.
 */
export default function CategoriesSkeleton({ viewMode = "table" }) {
  if (viewMode === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl p-5 bg-base-100 border border-base-300 space-y-4 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="h-6 w-20 bg-base-300/70 animate-pulse rounded-lg" />
              <div className="h-6 w-16 bg-base-300/70 animate-pulse rounded-lg" />
            </div>
            <div className="h-36 w-full bg-base-300/60 animate-pulse rounded-xl" />
            <div className="space-y-2">
              <div className="h-5 w-3/4 bg-base-300/80 animate-pulse rounded" />
              <div className="h-3.5 w-full bg-base-300/50 animate-pulse rounded" />
            </div>
            <div className="pt-3 border-t border-base-200 flex items-center justify-between">
              <div className="h-4 w-24 bg-base-300/60 animate-pulse rounded" />
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-base-300/70 animate-pulse rounded-lg" />
                <div className="h-8 w-8 bg-base-300/70 animate-pulse rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Table Skeleton
  return (
    <div className="bg-base-100 rounded-2xl border border-base-300 overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-base-300 bg-base-200/50 text-[11px] font-semibold uppercase tracking-wider text-base-content/60">
              <th className="py-3 px-5 w-20 text-center">Order</th>
              <th className="py-3 px-4">Category Details</th>
              <th className="py-3 px-4 hidden lg:table-cell">Description</th>
              <th className="py-3 px-4">Catalog Status</th>
              <th className="py-3 px-4 hidden md:table-cell">Last Updated</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200">
            {[...Array(6)].map((_, idx) => (
              <tr key={idx} className="hover:bg-base-200/30 transition-colors">
                <td className="py-4 px-5 text-center">
                  <div className="h-6 w-10 bg-base-300/70 animate-pulse rounded-lg mx-auto" />
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-base-300/80 animate-pulse shrink-0" />
                    <div className="space-y-1.5 flex-1 min-w-[140px]">
                      <div className="h-4 w-36 bg-base-300/80 animate-pulse rounded" />
                      <div className="h-3.5 w-20 bg-base-300/50 animate-pulse rounded" />
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 hidden lg:table-cell">
                  <div className="h-3.5 w-64 bg-base-300/60 animate-pulse rounded" />
                </td>
                <td className="py-4 px-4">
                  <div className="h-6 w-24 bg-base-300/70 animate-pulse rounded-lg" />
                </td>
                <td className="py-4 px-4 hidden md:table-cell">
                  <div className="h-3.5 w-28 bg-base-300/60 animate-pulse rounded" />
                </td>
                <td className="py-4 px-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="h-8 w-8 bg-base-300/70 animate-pulse rounded-lg" />
                    <div className="h-8 w-8 bg-base-300/70 animate-pulse rounded-lg" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
