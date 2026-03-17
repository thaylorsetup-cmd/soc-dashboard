"use client";

import {
  HardDrive,
  ListChecks,
  AlertTriangle,
  Clock,
  Container,
  FileText,
  Plug,
  Activity,
} from "lucide-react";
import Header from "@/components/layout/Header";
import MetricCard from "@/components/cards/MetricCard";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import LiveDot from "@/components/ui/LiveDot";
import { useDisk } from "@/hooks/useDisk";
import { useQueue } from "@/hooks/useQueue";
import { useLogs } from "@/hooks/useLogs";
import { useContainers } from "@/hooks/useContainers";
import { useHealth } from "@/hooks/useHealth";
import { formatBytes, formatRelativeTime } from "@/lib/formatters";
import { clsx } from "clsx";

function getDiskColor(percent: number): string {
  if (percent < 70) return "text-soc-success";
  if (percent < 85) return "text-soc-warning";
  return "text-soc-danger";
}

function getDiskBarColor(percent: number): string {
  if (percent < 70) return "bg-soc-success";
  if (percent < 85) return "bg-soc-warning";
  return "bg-soc-danger";
}

export default function SystemPage() {
  const { data: disk, isLoading: diskLoading } = useDisk();
  const { data: queue, isLoading: queueLoading } = useQueue();
  const { data: logs, isLoading: logsLoading } = useLogs();
  const { data: containers, isLoading: containersLoading } = useContainers();
  const { data: health } = useHealth();

  const sswCheck = health?.checks?.ssw_integration;

  return (
    <>
      <Header title="System Health" subtitle="Saude e metricas de infraestrutura" />

      {/* Disk + Queue */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {/* Disk Usage */}
        <div className="rounded-xl border border-soc-border bg-soc-card p-4 md:col-span-1">
          {diskLoading ? (
            <Skeleton className="h-28" />
          ) : disk ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                <HardDrive className={clsx("h-4 w-4", getDiskColor(disk.used_percent))} />
                <span className="text-sm text-soc-neutral">Disco</span>
              </div>
              <p className={clsx("text-3xl font-bold", getDiskColor(disk.used_percent))}>
                {disk.used_percent}%
              </p>
              <div className="mt-2 h-2 rounded-full bg-soc-bg overflow-hidden">
                <div
                  className={clsx("h-full rounded-full transition-all", getDiskBarColor(disk.used_percent))}
                  style={{ width: `${disk.used_percent}%` }}
                />
              </div>
              <p className="text-xs text-soc-neutral mt-1">
                {disk.free_gb} GB livre de {disk.total_gb} GB
              </p>
            </>
          ) : null}
        </div>

        {/* Queue Metrics */}
        <MetricCard
          label="Jobs Pendentes"
          value={queue?.pending ?? "-"}
          icon={ListChecks}
          color="text-soc-info"
          loading={queueLoading}
        />
        <MetricCard
          label="Jobs Falhados (total)"
          value={queue?.failed_total ?? "-"}
          icon={AlertTriangle}
          color={queue?.failed_total ? "text-soc-danger" : "text-soc-success"}
          loading={queueLoading}
        />
        <MetricCard
          label="Falhas (24h)"
          value={queue?.failed_24h ?? "-"}
          icon={Clock}
          color={queue?.failed_24h ? "text-soc-warning" : "text-soc-success"}
          subtitle={queue?.oldest_pending_at ? `Mais antigo: ${formatRelativeTime(queue.oldest_pending_at)}` : undefined}
          loading={queueLoading}
        />
      </div>

      {/* Logs + Containers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Log Sizes */}
        <div className="rounded-xl border border-soc-border bg-soc-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-soc-info" />
            <h3 className="text-sm font-medium text-gray-300">Tamanho dos Logs</h3>
          </div>
          {logsLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10" />
              ))}
            </div>
          ) : logs ? (
            <div className="space-y-2">
              {Object.entries(logs.logs).map(([channel, info]) => {
                const isLarge = info.size_mb > 100;
                return (
                  <div key={channel} className="flex items-center justify-between rounded-lg bg-soc-bg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-300 capitalize">{channel}</span>
                      <span className="text-xs text-soc-neutral">({info.files} arquivo{info.files !== 1 ? "s" : ""})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={clsx("text-sm font-medium", isLarge ? "text-soc-warning" : "text-gray-300")}>
                        {formatBytes(info.size_bytes)}
                      </span>
                      {isLarge && <Badge variant="warning">Grande</Badge>}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>

        {/* Container Status */}
        <div className="rounded-xl border border-soc-border bg-soc-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Container className="h-4 w-4 text-soc-info" />
            <h3 className="text-sm font-medium text-gray-300">
              Containers ({containers?.total ?? 0})
            </h3>
          </div>
          {containersLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-14" />
              ))}
            </div>
          ) : containers ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {containers.containers.map((c) => {
                const shortName = c.name.replace(/\.\d+\.[a-z0-9]+$/, "");
                return (
                  <div
                    key={c.name}
                    className={clsx(
                      "flex items-center gap-2 rounded-lg px-3 py-2",
                      c.healthy ? "bg-soc-success/5 border border-soc-success/15" : "bg-soc-danger/5 border border-soc-danger/15"
                    )}
                  >
                    <LiveDot ok={c.healthy} />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-300 truncate">{shortName}</p>
                      <p className="text-[10px] text-soc-neutral truncate">{c.status}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      {/* SSW Integration */}
      <div className="rounded-xl border border-soc-border bg-soc-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Plug className="h-4 w-4 text-soc-info" />
          <h3 className="text-sm font-medium text-gray-300">SSW Integration</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Activity className={clsx("h-5 w-5", sswCheck?.ok ? "text-soc-success" : "text-soc-danger")} />
            <span className="text-sm text-gray-300">
              Status: <strong className={sswCheck?.ok ? "text-soc-success" : "text-soc-danger"}>
                {sswCheck?.ok ? "Online" : "Offline"}
              </strong>
            </span>
          </div>
          <span className="text-sm text-soc-neutral">{sswCheck?.detail || "Verificando..."}</span>
        </div>
      </div>
    </>
  );
}
