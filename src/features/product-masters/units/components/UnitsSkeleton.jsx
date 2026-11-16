import React from "react";

export default function UnitsSkeleton({ viewMode = "table" }) {
  if (viewMode === "cards") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-base-200 bg-base-100 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-5 w-12 bg-base-300 rounded-md" />
              <div className="h-5 w-16 bg-base-300 rounded-full" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-base-300 rounded-2xl shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-3/4 bg-base-300 rounded" />
                <div className="h-3 w-1/2 bg-base-300 rounded" />
              </div>
            </div>
            <div className="h-8 bg-base-200 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-2xl border border-base-200 overflow-hidden shadow-xs animate-pulse">
      <div className="p-4 border-b border-base-200 bg-base-200/40">
        <div className="h-4 w-1/4 bg-base-300 rounded" />
      </div>
      <div className="divide-y divide-base-200">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-base-300 rounded-2xl shrink-0" />
              <div className="space-y-1.5">
                <div className="h-4 w-32 bg-base-300 rounded" />
                <div className="h-3 w-20 bg-base-300 rounded" />
              </div>
            </div>
            <div className="h-4 w-20 bg-base-300 rounded hidden md:block" />
            <div className="h-6 w-16 bg-base-300 rounded-full" />
            <div className="h-8 w-20 bg-base-300 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
