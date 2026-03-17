"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, lastPage, total, onPageChange }: PaginationProps) {
  if (lastPage <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-4">
      <span className="text-sm text-soc-neutral">
        {total} resultado{total !== 1 ? "s" : ""}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={clsx(
            "rounded-lg p-1.5 transition-colors",
            currentPage <= 1
              ? "text-soc-neutral/40 cursor-not-allowed"
              : "text-soc-neutral hover:bg-soc-card hover:text-gray-200"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="px-3 text-sm text-gray-300">
          {currentPage} / {lastPage}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= lastPage}
          className={clsx(
            "rounded-lg p-1.5 transition-colors",
            currentPage >= lastPage
              ? "text-soc-neutral/40 cursor-not-allowed"
              : "text-soc-neutral hover:bg-soc-card hover:text-gray-200"
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
