/**
 * Shimmer skeleton loaders for table and card views in Sizes module
 */
export default function SizesSkeleton({ viewMode = "table" }) {
  if (viewMode === "cards") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-3xl border border-base-300 bg-base-100 p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-5 w-12 bg-base-300 rounded-lg" />
              <div className="h-5 w-16 bg-base-300 rounded-full" />
            </div>

            <div className="flex flex-col items-center space-y-3 py-2">
              <div className="w-14 h-14 bg-base-300 rounded-2xl" />
              <div className="h-4 w-28 bg-base-300 rounded-lg" />
              <div className="h-3 w-16 bg-base-300 rounded-md" />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-base-200">
              <div className="h-3 w-20 bg-base-300 rounded" />
              <div className="h-6 w-16 bg-base-300 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default: Table skeleton
  return (
    <div className="rounded-3xl border border-base-300 bg-base-100 overflow-hidden shadow-xs animate-pulse">
      <div className="p-4 border-b border-base-200 flex items-center justify-between bg-base-200/30">
        <div className="h-4 w-32 bg-base-300 rounded" />
        <div className="h-4 w-20 bg-base-300 rounded" />
      </div>

      <div className="divide-y divide-base-200">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-base-300 rounded-2xl shrink-0" />
              <div className="space-y-2">
                <div className="h-4 w-36 bg-base-300 rounded" />
                <div className="h-3 w-20 bg-base-300 rounded" />
              </div>
            </div>

            <div className="hidden sm:block">
              <div className="h-4 w-28 bg-base-300 rounded" />
            </div>

            <div className="hidden md:block">
              <div className="h-4 w-16 bg-base-300 rounded" />
            </div>

            <div className="flex items-center gap-2">
              <div className="h-6 w-14 bg-base-300 rounded-lg" />
              <div className="h-8 w-8 bg-base-300 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

