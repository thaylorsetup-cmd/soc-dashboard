"use client";

import Skeleton from "@/components/ui/Skeleton";
import Pagination from "@/components/ui/Pagination";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  currentPage?: number;
  lastPage?: number;
  total?: number;
  onPageChange?: (page: number) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading,
  currentPage,
  lastPage,
  total,
  onPageChange,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-soc-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-3 py-2 text-left text-xs font-medium text-soc-neutral uppercase tracking-wider ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-8 text-center text-soc-neutral">
                  Nenhum registro encontrado
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={(row.id as string | number) ?? idx}
                  className="border-b border-soc-border/50 hover:bg-soc-card-hover transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-3 py-2 text-gray-300 ${col.className || ""}`}>
                      {col.render ? col.render(row) : String(row[col.key] ?? "-")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {currentPage !== undefined && lastPage !== undefined && total !== undefined && onPageChange && (
        <Pagination
          currentPage={currentPage}
          lastPage={lastPage}
          total={total}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
