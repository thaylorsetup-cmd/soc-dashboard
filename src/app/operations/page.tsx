"use client";

import { useState, useMemo } from "react";
import { Truck, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import MetricCard from "@/components/cards/MetricCard";
import DataTable, { type Column } from "@/components/tables/DataTable";
import Badge from "@/components/ui/Badge";
import { useFreightPipeline } from "@/hooks/useFreightPipeline";
import { useFreightTransitions } from "@/hooks/useFreightTransitions";
import { FREIGHT_STATUS_LABELS, STATUS_COLORS } from "@/lib/constants";
import { formatDateShort } from "@/lib/formatters";
import type { FreightTransition } from "@/types/api";
import { clsx } from "clsx";

const PIPELINE_COLORS = [
  STATUS_COLORS.info,
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  STATUS_COLORS.warning,
  "#f97316",
  STATUS_COLORS.success,
  STATUS_COLORS.neutral,
  STATUS_COLORS.neutral,
];

export default function OperationsPage() {
  const { data: pipeline, isLoading: pipelineLoading } = useFreightPipeline();
  const [page, setPage] = useState(1);
  const { data: transitions, isLoading: transLoading } = useFreightTransitions({ page, per_page: 20 });

  const pipelineEntries = useMemo(() => {
    if (!pipeline) return [];
    return Object.entries(pipeline.pipeline).filter(([key]) => key !== "finalizada");
  }, [pipeline]);

  const maxCount = useMemo(() => {
    return Math.max(...pipelineEntries.map(([, v]) => v), 1);
  }, [pipelineEntries]);

  const transColumns: Column<FreightTransition>[] = [
    {
      key: "created_at",
      header: "Data",
      render: (row) => <span className="text-xs tabular-nums">{formatDateShort(row.created_at)}</span>,
      className: "w-28",
    },
    {
      key: "reference_code",
      header: "OC",
      render: (row) => <span className="font-medium">{row.reference_code || `#${row.freight_order_id}`}</span>,
    },
    { key: "user_name", header: "Usuario", render: (row) => <span>{row.user_name || "-"}</span> },
    {
      key: "transition",
      header: "Transicao",
      render: (row) => (
        <div className="flex items-center gap-1 text-xs">
          <span className="text-soc-neutral">{FREIGHT_STATUS_LABELS[row.from_status || ""] || row.from_status || "-"}</span>
          <ArrowRight className="h-3 w-3 text-soc-neutral" />
          <span className="text-gray-200">{FREIGHT_STATUS_LABELS[row.to_status] || row.to_status}</span>
        </div>
      ),
    },
    {
      key: "action_type",
      header: "Tipo",
      render: (row) => {
        const variant = row.action_type === "cancellation" ? "danger" : row.action_type === "transition" ? "info" : "neutral";
        return <Badge variant={variant}>{row.action_type}</Badge>;
      },
    },
  ];

  return (
    <>
      <Header title="Operations Monitor" subtitle="Pipeline e transicoes de freight orders" />

      {/* Pipeline Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <MetricCard
          label="OCs Ativas"
          value={pipeline?.total_active ?? "-"}
          icon={Truck}
          color="text-soc-info"
          loading={pipelineLoading}
        />
        <MetricCard
          label="Canceladas"
          value={pipeline?.cancelled ?? "-"}
          icon={Truck}
          color="text-soc-danger"
          loading={pipelineLoading}
        />
        <MetricCard
          label="Finalizadas"
          value={pipeline?.pipeline?.finalizada ?? "-"}
          icon={Truck}
          color="text-soc-success"
          loading={pipelineLoading}
        />
        <MetricCard
          label="Etapas Ativas"
          value={pipelineEntries.filter(([, v]) => v > 0).length}
          icon={Truck}
          color="text-soc-warning"
          loading={pipelineLoading}
        />
      </div>

      {/* Pipeline Visualization */}
      <div className="rounded-xl border border-soc-border bg-soc-card p-4 mb-6">
        <h3 className="text-sm font-medium text-gray-300 mb-4">Pipeline de Status</h3>
        <div className="space-y-2">
          {pipelineEntries.map(([status, count], idx) => (
            <div key={status} className="flex items-center gap-3">
              <span className="w-28 text-xs text-soc-neutral text-right flex-shrink-0">
                {FREIGHT_STATUS_LABELS[status] || status}
              </span>
              <div className="flex-1 h-7 bg-soc-bg rounded-lg overflow-hidden">
                <div
                  className={clsx("h-full rounded-lg flex items-center px-2 transition-all duration-500")}
                  style={{
                    width: `${Math.max((count / maxCount) * 100, count > 0 ? 8 : 0)}%`,
                    backgroundColor: PIPELINE_COLORS[idx % PIPELINE_COLORS.length],
                  }}
                >
                  {count > 0 && (
                    <span className="text-xs font-bold text-white">{count}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transitions Table */}
      <div className="rounded-xl border border-soc-border bg-soc-card p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Transicoes Recentes</h3>
        <DataTable
          columns={transColumns}
          data={transitions?.data ?? []}
          loading={transLoading}
          currentPage={transitions?.meta.current_page}
          lastPage={transitions?.meta.last_page}
          total={transitions?.meta.total}
          onPageChange={setPage}
        />
      </div>
    </>
  );
}
