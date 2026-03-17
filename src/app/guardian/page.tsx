"use client";

import { useState } from "react";
import { Bell, ChevronDown, ChevronUp } from "lucide-react";
import Header from "@/components/layout/Header";
import MetricCard from "@/components/cards/MetricCard";
import Badge from "@/components/ui/Badge";
import Pagination from "@/components/ui/Pagination";
import Skeleton from "@/components/ui/Skeleton";
import { useGuardianAlerts } from "@/hooks/useGuardianAlerts";
import { formatDateShort } from "@/lib/formatters";
import { SEVERITY_CONFIG } from "@/lib/constants";
import type { AlertSeverity, GuardianAlert } from "@/types/api";
import { clsx } from "clsx";

function AlertRow({ alert }: { alert: GuardianAlert }) {
  const [expanded, setExpanded] = useState(false);
  const config = SEVERITY_CONFIG[alert.severity as AlertSeverity] || SEVERITY_CONFIG.info;

  return (
    <div className={clsx("rounded-lg border mb-2 overflow-hidden", config.border, config.bg)}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <Badge variant={alert.severity === "danger" ? "danger" : alert.severity === "warning" ? "warning" : "info"}>
            {config.label}
          </Badge>
          <span className="text-sm text-gray-200 truncate">{alert.title}</span>
          <span className="text-xs text-soc-neutral flex-shrink-0">{alert.workflow_name}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-soc-neutral">{formatDateShort(alert.triggered_at)}</span>
          {expanded ? <ChevronUp className="h-4 w-4 text-soc-neutral" /> : <ChevronDown className="h-4 w-4 text-soc-neutral" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-3 border-t border-soc-border/50">
          {alert.summary && (
            <p className="text-sm text-gray-300 mt-2 mb-3">{alert.summary}</p>
          )}
          {alert.columns && alert.rows && alert.rows.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-soc-border/50">
                    {alert.columns.map((col) => (
                      <th key={col} className="px-2 py-1 text-left text-soc-neutral font-medium">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {alert.rows.map((row, i) => (
                    <tr key={i} className="border-b border-soc-border/30">
                      {(row as unknown[]).map((cell, j) => (
                        <td key={j} className="px-2 py-1 text-gray-300">{String(cell ?? "-")}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {alert.row_count > 0 && (
            <p className="text-xs text-soc-neutral mt-2">{alert.row_count} registro(s)</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function GuardianPage() {
  const [page, setPage] = useState(1);
  const [severity, setSeverity] = useState("");
  const { data, isLoading } = useGuardianAlerts({ severity: severity || undefined, page, per_page: 20 });

  return (
    <>
      <Header title="Guardian Alerts" subtitle="Alertas do N8N Guardian" />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <MetricCard
          label="Criticos (30d)"
          value={data?.stats_30d?.danger ?? 0}
          icon={Bell}
          color="text-soc-danger"
          loading={isLoading}
        />
        <MetricCard
          label="Alertas (30d)"
          value={data?.stats_30d?.warning ?? 0}
          icon={Bell}
          color="text-soc-warning"
          loading={isLoading}
        />
        <MetricCard
          label="Info (30d)"
          value={data?.stats_30d?.info ?? 0}
          icon={Bell}
          color="text-soc-info"
          loading={isLoading}
        />
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 mb-4">
        <select
          value={severity}
          onChange={(e) => { setSeverity(e.target.value); setPage(1); }}
          className="rounded-lg bg-soc-card border border-soc-border px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-soc-info"
        >
          <option value="">Todas as severidades</option>
          <option value="danger">Critico</option>
          <option value="warning">Alerta</option>
          <option value="info">Info</option>
        </select>
      </div>

      {/* Alert List */}
      <div>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14" />
            ))}
          </div>
        ) : data?.data.length === 0 ? (
          <div className="rounded-xl border border-soc-border bg-soc-card p-8 text-center">
            <Bell className="h-8 w-8 text-soc-neutral mx-auto mb-2" />
            <p className="text-sm text-soc-neutral">Nenhum alerta encontrado</p>
          </div>
        ) : (
          data?.data.map((alert) => <AlertRow key={alert.id} alert={alert} />)
        )}

        {data?.meta && (
          <Pagination
            currentPage={data.meta.current_page}
            lastPage={data.meta.last_page}
            total={data.meta.total}
            onPageChange={setPage}
          />
        )}
      </div>
    </>
  );
}
