"use client";

import {
  Database,
  HardDrive,
  FileText,
  ListChecks,
  MemoryStick,
  Plug,
  Users,
  Activity,
  Truck,
  PackageCheck,
} from "lucide-react";
import Header from "@/components/layout/Header";
import StatusCard from "@/components/cards/StatusCard";
import MetricCard from "@/components/cards/MetricCard";
import BarChartCard from "@/components/charts/BarChartCard";
import EventTimeline from "@/components/tables/EventTimeline";
import { useHealth } from "@/hooks/useHealth";
import { useSessions } from "@/hooks/useSessions";
import { useFreightPipeline } from "@/hooks/useFreightPipeline";
import { useDailyReport } from "@/hooks/useDailyReport";
import { useSecurityEvents } from "@/hooks/useSecurityEvents";
import { HEALTH_CHECK_LABELS } from "@/lib/constants";
import type { LucideIcon } from "lucide-react";

const HEALTH_ICONS: Record<string, LucideIcon> = {
  database: Database,
  disk_space: HardDrive,
  log_size: FileText,
  queue_health: ListChecks,
  cache: MemoryStick,
  ssw_integration: Plug,
  sessions: Users,
};

export default function OverviewPage() {
  const { data: health, isLoading: healthLoading } = useHealth();
  const { data: sessions, isLoading: sessionsLoading } = useSessions();
  const { data: pipeline, isLoading: pipelineLoading } = useFreightPipeline();
  const { data: report, isLoading: reportLoading } = useDailyReport();
  const { data: events, isLoading: eventsLoading } = useSecurityEvents({ per_page: 20 });

  const opsChartData = report
    ? [
        {
          name: "24h",
          Criadas: report.operations.freight_orders_created,
          Finalizadas: report.operations.freight_orders_finalized,
          Canceladas: report.operations.freight_orders_cancelled,
        },
      ]
    : [];

  return (
    <>
      <Header title="Overview" subtitle="Visao geral do sistema" />

      {/* Health Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        {health
          ? Object.entries(health.checks).map(([key, check]) => (
              <StatusCard
                key={key}
                label={HEALTH_CHECK_LABELS[key] || key}
                ok={check.ok}
                detail={check.detail}
                icon={HEALTH_ICONS[key] || Activity}
                loading={false}
              />
            ))
          : Array.from({ length: 7 }).map((_, i) => (
              <StatusCard
                key={i}
                label=""
                ok={true}
                detail=""
                icon={Activity}
                loading={healthLoading}
              />
            ))}
      </div>

      {/* Counter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <MetricCard
          label="Sessoes Ativas"
          value={sessions?.total ?? "-"}
          icon={Users}
          color="text-soc-info"
          subtitle="Ultimos 30 min"
          loading={sessionsLoading}
        />
        <MetricCard
          label="OCs em Andamento"
          value={pipeline?.total_active ?? "-"}
          icon={Truck}
          color="text-soc-warning"
          subtitle={`${pipeline?.cancelled ?? 0} canceladas total`}
          loading={pipelineLoading}
        />
        <MetricCard
          label="OCs Criadas (24h)"
          value={report?.operations.freight_orders_created ?? "-"}
          icon={PackageCheck}
          color="text-soc-success"
          subtitle={`${report?.operations.freight_orders_finalized ?? 0} finalizadas`}
          loading={reportLoading}
        />
      </div>

      {/* Timeline + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-soc-border bg-soc-card p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-3">
            Eventos Recentes de Seguranca
          </h3>
          <div className="max-h-[400px] overflow-y-auto">
            <EventTimeline events={events?.data ?? []} loading={eventsLoading} />
          </div>
        </div>

        <BarChartCard
          title="Operacoes (24h)"
          data={opsChartData}
          xDataKey="name"
          bars={[
            { dataKey: "Criadas", color: "#3b82f6", name: "Criadas" },
            { dataKey: "Finalizadas", color: "#10b981", name: "Finalizadas" },
            { dataKey: "Canceladas", color: "#ef4444", name: "Canceladas" },
          ]}
          loading={reportLoading}
          height={340}
        />
      </div>
    </>
  );
}
