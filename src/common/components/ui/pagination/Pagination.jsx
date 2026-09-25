import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

/**
 * buildPageNumbers
 * Always shows page 1 and last page.
 * Shows siblings around the active page with "..." gaps.
 *
 * Example — 20 pages, current = 7, siblings = 1:
 *   1  …  6  [7]  8  …  20
 *
 * Example — current = 2:
 *   [1]  [2]  3  …  20
 *
 * Example — current = 19:
 *   1  …  18  [19]  20
 */
export function buildPageNumbers(currentPage, totalPages, siblings = 1) {
  const totalSlots = siblings * 2 + 5;
  if (totalPages <= totalSlots) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const leftSiblingStart = Math.max(currentPage - siblings, 2);
  const rightSiblingEnd = Math.min(currentPage + siblings, totalPages - 1);

  const showLeftDots = leftSiblingStart > 2;
  const showRightDots = rightSiblingEnd < totalPages - 1;

  const pageList = [];

  pageList.push(1);

  if (showLeftDots) {
    pageList.push("left-dots");
  } else {
    for (let pageNum = 2; pageNum < leftSiblingStart; pageNum++) {
      pageList.push(pageNum);
    }
  }

  for (let pageNum = leftSiblingStart; pageNum <= rightSiblingEnd; pageNum++) {
    pageList.push(pageNum);
  }

  if (showRightDots) {
    pageList.push("right-dots");
  } else {
    for (let pageNum = rightSiblingEnd + 1; pageNum < totalPages; pageNum++) {
      pageList.push(pageNum);
    }
  }

  pageList.push(totalPages);

  return pageList;
}

/**
 * Global Pagination Component for Pooja Fashion POS & ERP
 *
 * Props:
 *   @param {number}   currentPage          - 1-based active page
 *   @param {number}   totalItems           - total record count
 *   @param {number}   pageSize             - rows per page (default 10)
 *   @param {number[]} pageSizeOptions      - rows-per-page choices (default [5,10,20,50])
 *   @param {number}   siblings             - pages on each side of current (default 1)
 *   @param {function} onPageChange         - fn(page: number)
 *   @param {function} onPageSizeChange     - fn(size: number)
 *   @param {boolean}  showPageSizeSelector - show rows-per-page dropdown (default true)
 *   @param {boolean}  showFirstLast        - show jump buttons (default true)
 *   @param {string}   className            - additional CSS classes
 */
export default function Pagination({
  currentPage = 1,
  totalItems = 0,
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  siblings = 1,
  onPageChange,
  onPageSizeChange,
  showPageSizeSelector = true,
  showFirstLast = true,
  className = "",
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const rangeStart = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalItems);

  const pageNumbers = buildPageNumbers(currentPage, totalPages, siblings);

  const goToPage = (targetPage) => {
    if (
      !onPageChange ||
      targetPage < 1 ||
      targetPage > totalPages ||
      targetPage === currentPage
    ) {
      return;
    }
    onPageChange(targetPage);
  };

  const handlePageSizeChange = (event) => {
    const newSize = Number(event.target.value);
    onPageSizeChange?.(newSize);
    onPageChange?.(1);
  };

  if (totalItems === 0) return null;

  const navBtnClass =
    "w-9 h-9 rounded-xl flex items-center justify-center border border-base-300 bg-base-100 text-base-content/70 text-sm font-semibold transition-all hover:bg-base-200 hover:text-base-content hover:border-primary/40 hover:scale-105 active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-base-100 disabled:hover:text-base-content/40 disabled:hover:border-base-300 shadow-2xs cursor-pointer";

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-base-200 bg-base-100 text-base-content ${className}`}
    >
      {/* ── Left: summary + rows-per-page ── */}
      <div className="flex items-center gap-3.5 flex-wrap">
        <p className="text-sm text-base-content/70 font-medium">
          Showing{" "}
          <span className="font-bold text-base-content">
            {rangeStart}–{rangeEnd}
          </span>{" "}
          of{" "}
          <span className="font-bold text-base-content">
            {totalItems}
          </span>{" "}
          results
        </p>

        {showPageSizeSelector && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-base-content/60 font-medium">Rows:</span>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="w-20 h-8 text-xs sm:text-sm font-semibold rounded-lg px-2 bg-base-200/60 border border-base-300 text-base-content shadow-2xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              {pageSizeOptions.map((sizeOption) => (
                <option key={sizeOption} value={sizeOption} className="bg-base-100 text-base-content">
                  {sizeOption}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ── Right: navigation ── */}
      <div className="flex items-center gap-1.5 select-none">
        {/* Jump to first */}
        {showFirstLast && (
          <button
            type="button"
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            className={navBtnClass}
            title="First page"
            aria-label="First page"
          >
            <ChevronsLeft size={16} />
          </button>
        )}

        {/* Previous */}
        <button
          type="button"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={navBtnClass}
          title="Previous page"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page number buttons */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((pageItem, idx) => {
            if (pageItem === "left-dots" || pageItem === "right-dots") {
              return (
                <span
                  key={`${pageItem}-${idx}`}
                  className="w-8 h-9 flex items-center justify-center text-sm font-extrabold text-base-content/40 select-none tracking-widest"
                >
                  …
                </span>
              );
            }

            const isActive = pageItem === currentPage;
            return (
              <button
                type="button"
                key={pageItem}
                onClick={() => goToPage(pageItem)}
                className={
                  isActive
                    ? "w-9 h-9 rounded-xl text-sm font-bold bg-primary text-primary-content shadow-md cursor-default transition-all"
                    : "w-9 h-9 rounded-xl text-sm font-semibold border border-base-300 bg-base-100 text-base-content/70 hover:bg-base-200 hover:text-base-content hover:border-primary/40 shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                }
                aria-current={isActive ? "page" : undefined}
              >
                {pageItem}
              </button>
            );
          })}
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={navBtnClass}
          title="Next page"
          aria-label="Next page"
        >
          <ChevronRight size={15} />
        </button>

        {/* Jump to last */}
        {showFirstLast && (
          <button
            type="button"
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            className={navBtnClass}
            title="Last page"
            aria-label="Last page"
          >
            <ChevronsRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
}
