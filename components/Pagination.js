import React from "react";

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  showFirstLast = true,
  maxVisiblePages = 5,
}) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - delta);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  const handlePageClick = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const PaginationButton = ({
    page,
    children,
    disabled = false,
    active = false,
  }) => (
    <button
      onClick={() => handlePageClick(page)}
      disabled={disabled}
      className={`
        px-3 py-2 mx-1 rounded-lg font-medium transition-all duration-200 min-w-[40px]
        ${
          active
            ? "bg-primary-600 text-white shadow-lg transform scale-105"
            : disabled
            ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
        }
      `}
    >
      {children}
    </button>
  );

  return (
    <div className="flex justify-center items-center mt-8 mb-4">
      <div className="flex items-center space-x-1">
        {/* First Page */}
        {showFirstLast && currentPage > 1 && (
          <>
            <PaginationButton page={1}>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7M21 19l-7-7 7-7"
                />
              </svg>
            </PaginationButton>
          </>
        )}

        {/* Previous Page */}
        <PaginationButton page={currentPage - 1} disabled={currentPage === 1}>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </PaginationButton>

        {/* Show ellipsis if there are hidden pages at the start */}
        {visiblePages[0] > 1 && (
          <span className="px-3 py-2 text-gray-500 dark:text-gray-400">
            ...
          </span>
        )}

        {/* Page Numbers */}
        {visiblePages.map((page) => (
          <PaginationButton
            key={page}
            page={page}
            active={page === currentPage}
          >
            {page}
          </PaginationButton>
        ))}

        {/* Show ellipsis if there are hidden pages at the end */}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <span className="px-3 py-2 text-gray-500 dark:text-gray-400">
            ...
          </span>
        )}

        {/* Next Page */}
        <PaginationButton
          page={currentPage + 1}
          disabled={currentPage === totalPages}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </PaginationButton>

        {/* Last Page */}
        {showFirstLast && currentPage < totalPages && (
          <>
            <PaginationButton page={totalPages}>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M3 5l7 7-7 7"
                />
              </svg>
            </PaginationButton>
          </>
        )}
      </div>

      {/* Page Info */}
      <div className="ml-6 text-sm text-gray-500 dark:text-gray-400">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}
