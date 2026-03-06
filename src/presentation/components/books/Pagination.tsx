import React from 'react';
import { Button } from '../base/Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalEntries: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalEntries,
  pageSize,
  onPageChange,
}) => {
  const startEntry = (currentPage - 1) * pageSize + 1;
  const endEntry = Math.min(currentPage * pageSize, totalEntries);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        start = 2;
        end = 4;
      }

      for (let i = start; i <= end; i++) {
        if (i <= totalPages - 1) pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2">
      <div className="text-description text-[var(--color-text-secondary)] order-2 sm:order-1 text-center sm:text-left">
        Showing{' '}
        <span className="font-semibold text-[var(--color-text-primary)]">
          {startEntry}
        </span>{' '}
        to{' '}
        <span className="font-semibold text-[var(--color-text-primary)]">
          {endEntry}
        </span>{' '}
        of{' '}
        <span className="font-semibold text-[var(--color-text-primary)]">
          {totalEntries}
        </span>{' '}
        entries
      </div>

      <div className="flex items-center gap-1 order-1 sm:order-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3"
        >
          Previous
        </Button>

        {/* Desktop Page Numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {pages.map((page, index) =>
            typeof page === 'number' ? (
              <button
                key={index}
                onClick={() => onPageChange(page)}
                className={`
                          h-8 w-8 rounded flex items-center justify-center text-[0.875rem] font-medium transition-colors
                          ${
                            currentPage === page
                              ? 'bg-[var(--color-success)] text-white shadow-sm'
                              : 'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-main)]'
                          }
                      `}
              >
                {page}
              </button>
            ) : (
              <span key={index} className="px-2 text-[var(--color-text-muted)]">
                ...
              </span>
            )
          )}
        </div>

        {/* Mobile Page Indicator */}
        <div className="flex sm:hidden items-center justify-center h-8 px-4 text-[0.875rem] font-bold text-[var(--color-success)] bg-[var(--color-primary-light)] rounded-lg">
          {currentPage}
        </div>

        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
