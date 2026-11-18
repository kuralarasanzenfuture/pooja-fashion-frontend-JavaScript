import React from "react";

/**
 * TaxesSkeleton Component
 * Placeholder animation for table and cards view while tax data is loading.
 */
export default function TaxesSkeleton({ viewMode = "table", count = 5 }) {
  if (viewMode === "cards") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-3xl bg-base-100 border border-base-200 space-y-4 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-base-200" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 bg-base-200 rounded w-3/4" />
                <div className="h-3 bg-base-200 rounded w-1/2" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="h-10 bg-base-200 rounded-xl" />
              <div className="h-10 bg-base-200 rounded-xl" />
              <div className="h-10 bg-base-200 rounded-xl" />
            </div>
            <div className="h-8 bg-base-200 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-2xl border border-base-200 overflow-hidden shadow-xs animate-pulse">
      <div className="p-4 border-b border-base-200 flex items-center justify-between">
        <div className="h-4 bg-base-200 rounded w-48" />
        <div className="h-4 bg-base-200 rounded w-24" />
      </div>
      <div className="divide-y divide-base-200">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-base-200 shrink-0" />
              <div className="space-y-1">
                <div className="h-4 bg-base-200 rounded w-40" />
                <div className="h-3 bg-base-200 rounded w-28" />
              </div>
            </div>
            <div className="h-4 bg-base-200 rounded w-20 hidden sm:block" />
            <div className="h-4 bg-base-200 rounded w-24 hidden md:block" />
            <div className="h-6 bg-base-200 rounded-full w-16" />
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 bg-base-200 rounded-lg" />
              <div className="w-7 h-7 bg-base-200 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

