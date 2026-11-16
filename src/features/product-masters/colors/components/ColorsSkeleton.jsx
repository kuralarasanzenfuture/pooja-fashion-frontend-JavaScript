import React from "react";

export default function ColorsSkeleton({ viewMode = "table" }) {
  if (viewMode === "cards") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-base-200 bg-base-100 space-y-4 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="h-5 w-12 bg-base-200 rounded-md" />
              <div className="h-5 w-16 bg-base-200 rounded-full" />
            </div>

            <div className="flex flex-col items-center space-y-3 py-2">
              <div className="w-16 h-16 rounded-2xl bg-base-200" />
              <div className="h-5 w-28 bg-base-200 rounded-md" />
              <div className="h-4 w-20 bg-base-200 rounded-md" />
            </div>

            <div className="pt-3 border-t border-base-200 flex items-center justify-between">
              <div className="h-4 w-24 bg-base-200 rounded" />
              <div className="flex gap-1.5">
                <div className="w-7 h-7 bg-base-200 rounded-lg" />
                <div className="w-7 h-7 bg-base-200 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-2xl border border-base-200 overflow-hidden shadow-xs animate-pulse">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-base-200 bg-base-200/40">
              <th className="py-3.5 px-4 w-16"><div className="h-4 w-8 bg-base-200 rounded" /></th>
              <th className="py-3.5 px-4"><div className="h-4 w-32 bg-base-200 rounded" /></th>
              <th className="py-3.5 px-4"><div className="h-4 w-24 bg-base-200 rounded" /></th>
              <th className="py-3.5 px-4 hidden lg:table-cell"><div className="h-4 w-28 bg-base-200 rounded" /></th>
              <th className="py-3.5 px-4 hidden xl:table-cell"><div className="h-4 w-36 bg-base-200 rounded" /></th>
              <th className="py-3.5 px-4 w-28"><div className="h-4 w-20 bg-base-200 rounded" /></th>
              <th className="py-3.5 px-4 text-right w-28"><div className="h-4 w-16 bg-base-200 rounded ml-auto" /></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200">
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i}>
                <td className="py-4 px-4"><div className="h-6 w-10 bg-base-200 rounded-md" /></td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-base-200 shrink-0" />
                    <div className="space-y-1.5">
                      <div className="h-4 w-32 bg-base-200 rounded" />
                      <div className="h-3 w-20 bg-base-200 rounded" />
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4"><div className="h-6 w-20 bg-base-200 rounded-md" /></td>
                <td className="py-4 px-4 hidden lg:table-cell"><div className="h-4 w-28 bg-base-200 rounded" /></td>
                <td className="py-4 px-4 hidden xl:table-cell"><div className="h-4 w-40 bg-base-200 rounded" /></td>
                <td className="py-4 px-4"><div className="h-5 w-16 bg-base-200 rounded-full" /></td>
                <td className="py-4 px-4 text-right">
                  <div className="flex justify-end gap-1.5">
                    <div className="w-7 h-7 bg-base-200 rounded-lg" />
                    <div className="w-7 h-7 bg-base-200 rounded-lg" />
                    <div className="w-7 h-7 bg-base-200 rounded-lg" />
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
