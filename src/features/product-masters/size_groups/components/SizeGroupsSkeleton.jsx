/**
 * Shimmering Loading Skeleton for Size Groups Master
 */
export default function SizeGroupsSkeleton({ viewMode = "table" }) {
  if (viewMode === "cards") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {[...Array(8)].map((_, idx) => (
          <div
            key={idx}
            className="rounded-3xl border border-base-300 bg-base-100 p-5 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="h-5 w-16 bg-base-300 animate-pulse rounded-md" />
              <div className="h-6 w-16 bg-base-300 animate-pulse rounded-full" />
            </div>
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-base-300 animate-pulse shrink-0" />
              <div className="space-y-2 flex-1 min-w-0">
                <div className="h-4 w-3/4 bg-base-300 animate-pulse rounded" />
                <div className="h-3 w-1/2 bg-base-300 animate-pulse rounded" />
              </div>
            </div>
            <div className="h-3 w-full bg-base-300 animate-pulse rounded" />
            <div className="flex gap-1 pt-1">
              <div className="h-5 w-8 bg-base-300 animate-pulse rounded" />
              <div className="h-5 w-8 bg-base-300 animate-pulse rounded" />
              <div className="h-5 w-8 bg-base-300 animate-pulse rounded" />
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-base-200">
              <div className="h-4 w-24 bg-base-300 animate-pulse rounded" />
              <div className="flex gap-1.5">
                <div className="h-8 w-8 bg-base-300 animate-pulse rounded-xl" />
                <div className="h-8 w-8 bg-base-300 animate-pulse rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-base-300 bg-base-100 overflow-hidden shadow-2xs">
      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="border-b border-base-300 bg-base-200/50 text-[11px] font-semibold uppercase tracking-wider text-base-content/60">
              <th className="py-3.5 px-5 w-20 text-center">ID</th>
              <th className="py-3.5 px-4">Size Group Details</th>
              <th className="py-3.5 px-4 hidden md:table-cell">Assigned Sizes</th>
              <th className="py-3.5 px-4 hidden lg:table-cell">Company</th>
              <th className="py-3.5 px-4 hidden xl:table-cell">Description</th>
              <th className="py-3.5 px-4">Catalog Status</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200">
            {[...Array(6)].map((_, idx) => (
              <tr key={idx} className="animate-pulse">
                <td className="py-4 px-5 text-center">
                  <div className="h-5 w-9 bg-base-300 rounded-lg mx-auto" />
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-base-300 shrink-0" />
                    <div className="space-y-1.5">
                      <div className="h-4 w-32 bg-base-300 rounded" />
                      <div className="h-3 w-20 bg-base-300 rounded" />
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 hidden md:table-cell">
                  <div className="flex gap-1">
                    <div className="h-5 w-8 bg-base-300 rounded" />
                    <div className="h-5 w-8 bg-base-300 rounded" />
                    <div className="h-5 w-8 bg-base-300 rounded" />
                  </div>
                </td>
                <td className="py-4 px-4 hidden lg:table-cell">
                  <div className="h-4 w-24 bg-base-300 rounded" />
                </td>
                <td className="py-4 px-4 hidden xl:table-cell">
                  <div className="h-3.5 w-44 bg-base-300 rounded" />
                </td>
                <td className="py-4 px-4">
                  <div className="h-6 w-20 bg-base-300 rounded-lg" />
                </td>
                <td className="py-4 px-5 text-right">
                  <div className="h-8 w-24 bg-base-300 rounded-xl ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

