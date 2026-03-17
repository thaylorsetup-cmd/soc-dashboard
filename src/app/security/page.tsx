"use client";

import { useState, useMemo } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  Skull,
  FileWarning,
} from "lucide-react";
import Header from "@/components/layout/Header";
import MetricCard from "@/components/cards/MetricCard";
import BarChartCard from "@/components/charts/BarChartCard";
import DataTable, { type Column } from "@/components/tables/DataTable";
import Badge from "@/components/ui/Badge";
import { useDailyReport } from "@/hooks/useDailyReport";
import { useSecurityEvents } from "@/hooks/useSecurityEvents";
import { useIntegrity } from "@/hooks/useIntegrity";
import { useActivityLog } from "@/hooks/useActivityLog";
import { formatDateTime, formatDateShort } from "@/lib/formatters";
import { INTEGRITY_STATUS_CONFIG } from "@/lib/constants";
import type { ActivityLogEntry, IntegrityStatus } from "@/types/api";

export default function SecurityPage() {
  const { data: report, isLoading: reportLoading } = useDailyReport();
  const { data: events, isLoading: eventsLoading } = useSecurityEvents({ per_page: 100 });
  const { data: integrity, isLoading: integrityLoading } = useIntegrity();
  const [logPage, setLogPage] = useState(1);
  const [logFilter, setLogFilter] = useState<string>("");
  const { data: activityLog, isLoading: logLoading } = useActivityLog({
    log_name: logFilter || undefined,
    page: logPage,
    per_page: 20,
  });

  // Aggregate logins by hour for chart
  const loginChartData = useMemo(() => {
    if (!events?.data) return [];
    const hours: Record<string, { hour: string; Sucesso: number; Falha: number }> = {};
    for (let h = 0; h < 24; h++) {
      const label = `${h.toString().padStart(2, "0")}h`;
      hours[label] = { hour: label, Sucesso: 0, Falha: 0 };
    }
    events.data.forEach((e) => {
      const h = new Date(e.timestamp).getHours();
      const label = `${h.toString().padStart(2, "0")}h`;
      if (hours[label]) {
        if (e.type === "login_success") hours[label].Sucesso++;
        if (e.type === "login_failed") hours[label].Falha++;
      }
    });
    return Object.values(hours);
  }, [events]);

  // Brute force events
  const bruteForceEvents = useMemo(() => {
    if (!events?.data) return [];
    return events.data.filter((e) => e.type === "brute_force");
  }, [events]);

  // Permission denials
  const permissionDenials = useMemo(() => {
    if (!events?.data) return [];
    return events.data.filter((e) => e.type === "permission_denied").slice(0, 10);
  }, [events]);

  // Activity log columns
  const logColumns: Column<ActivityLogEntry>[] = [
    {
      key: "created_at",
      header: "Data",
      render: (row) => <span className="text-xs tabular-nums">{formatDateShort(row.created_at)}</span>,
      className: "w-32",
    },
    {
      key: "causer_name",
      header: "Usuario",
      render: (row) => <span>{row.causer_name || "-"}</span>,
    },
    { key: "event", header: "Evento" },
    {
      key: "description",
      header: "Descricao",
      render: (row) => <span className="truncate max-w-[200px] block">{row.description}</span>,
    },
    {
      key: "subject_type",
      header: "Tipo",
      render: (row) => (
        <span className="text-xs text-soc-neutral">
          {row.subject_type?.replace("App\\Models\\", "") || "-"}
        </span>
      ),
    },
  ];

  return (
    <>
      <Header title="Security Monitor" subtitle="Monitoramento de seguranca em tempo real" />

      {/* Security Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <MetricCard
          label="Logins Falhados"
          value={report?.security.failed_logins ?? "-"}
          icon={ShieldOff}
          color={report?.security.failed_logins ? "text-soc-danger" : "text-soc-success"}
          loading={reportLoading}
        />
        <MetricCard
          label="Logins OK"
          value={report?.security.successful_logins ?? "-"}
          icon={ShieldCheck}
          color="text-soc-success"
          loading={reportLoading}
        />
        <MetricCard
          label="Perm. Negadas"
          value={report?.security.permission_denials ?? "-"}
          icon={ShieldAlert}
          color={report?.security.permission_denials ? "text-soc-warning" : "text-soc-success"}
          loading={reportLoading}
        />
        <MetricCard
          label="Brute Force"
          value={report?.security.brute_force_alerts ?? "-"}
          icon={Skull}
          color={report?.security.brute_force_alerts ? "text-soc-danger" : "text-soc-success"}
          loading={reportLoading}
        />
      </div>

      {/* Login Activity Chart */}
      <div className="mb-6">
        <BarChartCard
          title="Atividade de Login (24h por hora)"
          data={loginChartData}
          xDataKey="hour"
          bars={[
            { dataKey: "Sucesso", color: "#10b981", name: "Sucesso" },
            { dataKey: "Falha", color: "#ef4444", name: "Falha" },
          ]}
          loading={eventsLoading}
          height={250}
        />
      </div>

      {/* Brute Force + Permission Denials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl border border-soc-border bg-soc-card p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-3">
            Alertas Brute Force
          </h3>
          {bruteForceEvents.length === 0 ? (
            <p className="text-sm text-soc-neutral py-4 text-center">
              Nenhum alerta
            </p>
          ) : (
            <div className="space-y-2">
              {bruteForceEvents.map((e, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-soc-danger/5 px-3 py-2 border border-soc-danger/20">
                  <div>
                    <span className="text-sm text-soc-danger font-medium">
                      {String(e.context?.ip || "IP desconhecido")}
                    </span>
                    <span className="text-xs text-soc-neutral ml-2">
                      {String(e.context?.attempts || "?")} tentativas
                    </span>
                  </div>
                  <span className="text-xs text-soc-neutral">{formatDateShort(e.timestamp)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-soc-border bg-soc-card p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-3">
            Permissoes Negadas (Top 10)
          </h3>
          {permissionDenials.length === 0 ? (
            <p className="text-sm text-soc-neutral py-4 text-center">
              Nenhuma negacao
            </p>
          ) : (
            <div className="space-y-2">
              {permissionDenials.map((e, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-soc-card-hover">
                  <div>
                    <span className="text-sm text-soc-warning">{e.message}</span>
                    <span className="text-xs text-soc-neutral ml-2">
                      {String(e.context?.user_id ? `User #${e.context.user_id}` : "")}
                    </span>
                  </div>
                  <span className="text-xs text-soc-neutral">{formatDateShort(e.timestamp)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Integrity Status */}
      <div className="rounded-xl border border-soc-border bg-soc-card p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FileWarning className="h-4 w-4 text-soc-info" />
          <h3 className="text-sm font-medium text-gray-300">
            Integridade de Arquivos
          </h3>
          {integrity?.has_changes && (
            <Badge variant="danger">Alteracoes detectadas</Badge>
          )}
        </div>
        {integrityLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse h-8 bg-soc-border/30 rounded" />
            ))}
          </div>
        ) : integrity ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {Object.entries(integrity.files).map(([file, status]) => {
              const config = INTEGRITY_STATUS_CONFIG[status as IntegrityStatus];
              return (
                <div
                  key={file}
                  className={`flex items-center justify-between rounded-lg px-3 py-1.5 ${config.bg}`}
                >
                  <span className="text-xs text-gray-300 truncate mr-2">{file}</span>
                  <span className={`text-xs font-medium ${config.color} flex-shrink-0`}>
                    {config.label}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-soc-neutral text-center py-4">
            Baseline nao configurado
          </p>
        )}
        {integrity?.checked_at && (
          <p className="text-xs text-soc-neutral mt-2">
            Ultimo check: {formatDateTime(integrity.checked_at)}
          </p>
        )}
      </div>

      {/* Activity Log Table */}
      <div className="rounded-xl border border-soc-border bg-soc-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-300">Activity Log</h3>
          <select
            value={logFilter}
            onChange={(e) => { setLogFilter(e.target.value); setLogPage(1); }}
            className="rounded-lg bg-soc-bg border border-soc-border px-3 py-1 text-sm text-gray-300 focus:outline-none focus:border-soc-info"
          >
            <option value="">Todos os canais</option>
            <option value="security">Security</option>
            <option value="default">Default</option>
          </select>
        </div>
        <DataTable
          columns={logColumns}
          data={activityLog?.data ?? []}
          loading={logLoading}
          currentPage={activityLog?.meta.current_page}
          lastPage={activityLog?.meta.last_page}
          total={activityLog?.meta.total}
          onPageChange={setLogPage}
        />
      </div>
    </>
  );
}
