import React from "react";

/**
 * ProductTypesSkeleton
 * Skeleton placeholders matching table and cards layout
 */
export default function ProductTypesSkeleton({ viewMode = "table", rows = 6 }) {
  if (viewMode === "cards") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-base-200 bg-base-100 flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-5 w-16 bg-base-200 rounded-md" />
              <div className="h-4 w-10 bg-base-200 rounded-full" />
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-base-200 rounded-2xl shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-base-200 rounded-md w-3/4" />
                <div className="h-3 bg-base-200 rounded-md w-1/2" />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-base-200">
              <div className="h-5 w-16 bg-base-200 rounded-md" />
              <div className="h-5 w-16 bg-base-200 rounded-md" />
              <div className="h-5 w-16 bg-base-200 rounded-md" />
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
            <tr className="border-b border-base-200 bg-base-200/50">
              <th className="py-3.5 px-4 w-16">
                <div className="h-3.5 w-8 bg-base-200 rounded mx-auto" />
              </th>
              <th className="py-3.5 px-4">
                <div className="h-3.5 w-28 bg-base-200 rounded" />
              </th>
              <th className="py-3.5 px-4">
                <div className="h-3.5 w-20 bg-base-200 rounded" />
              </th>
              <th className="py-3.5 px-4">
                <div className="h-3.5 w-32 bg-base-200 rounded" />
              </th>
              <th className="py-3.5 px-4 hidden lg:table-cell">
                <div className="h-3.5 w-24 bg-base-200 rounded" />
              </th>
              <th className="py-3.5 px-4 w-28">
                <div className="h-3.5 w-20 bg-base-200 rounded" />
              </th>
              <th className="py-3.5 px-4 text-right w-28">
                <div className="h-3.5 w-16 bg-base-200 rounded ml-auto" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200">
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i}>
                <td className="py-4 px-4 text-center">
                  <div className="h-5 w-10 bg-base-200 rounded mx-auto" />
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-base-200 rounded-2xl shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-4 bg-base-200 rounded w-44" />
                      <div className="h-3 bg-base-200 rounded w-28" />
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="h-5 w-24 bg-base-200 rounded-md" />
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-1.5">
                    <div className="h-5 w-14 bg-base-200 rounded-md" />
                    <div className="h-5 w-14 bg-base-200 rounded-md" />
                    <div className="h-5 w-14 bg-base-200 rounded-md" />
                  </div>
                </td>
                <td className="py-4 px-4 hidden lg:table-cell">
                  <div className="h-4 w-28 bg-base-200 rounded" />
                </td>
                <td className="py-4 px-4">
                  <div className="h-4 w-12 bg-base-200 rounded-full" />
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
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
