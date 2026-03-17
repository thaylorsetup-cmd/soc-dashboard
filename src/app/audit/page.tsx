"use client";

import { useState } from "react";
import { FileText, Download } from "lucide-react";
import Header from "@/components/layout/Header";
import DataTable, { type Column } from "@/components/tables/DataTable";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import { useActivityLog } from "@/hooks/useActivityLog";
import { formatDateShort } from "@/lib/formatters";
import type { ActivityLogEntry } from "@/types/api";

export default function AuditPage() {
  const [page, setPage] = useState(1);
  const [logName, setLogName] = useState("");
  const [event, setEvent] = useState("");
  const [since, setSince] = useState("");
  const [until, setUntil] = useState("");

  const { data, isLoading } = useActivityLog({
    log_name: logName || undefined,
    event: event || undefined,
    since: since || undefined,
    until: until || undefined,
    page,
    per_page: 25,
  });

  const [modalData, setModalData] = useState<ActivityLogEntry | null>(null);

  function exportCsv() {
    if (!data?.data.length) return;
    const headers = ["Data", "Usuario", "Evento", "Descricao", "Tipo", "Subject ID"];
    const rows = data.data.map((r) => [
      r.created_at,
      r.causer_name || "",
      r.event,
      r.description,
      r.subject_type?.replace("App\\Models\\", "") || "",
      String(r.subject_id || ""),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const columns: Column<ActivityLogEntry>[] = [
    {
      key: "created_at",
      header: "Data",
      render: (row) => <span className="text-xs tabular-nums">{formatDateShort(row.created_at)}</span>,
      className: "w-28",
    },
    { key: "causer_name", header: "Usuario", render: (row) => <span>{row.causer_name || "-"}</span> },
    {
      key: "event",
      header: "Evento",
      render: (row) => {
        const v = row.event === "deleted" ? "danger" : row.event === "created" ? "success" : "info";
        return <Badge variant={v}>{row.event}</Badge>;
      },
    },
    { key: "description", header: "Descricao", render: (row) => <span className="truncate block max-w-[200px]">{row.description}</span> },
    {
      key: "subject_type",
      header: "Modelo",
      render: (row) => <span className="text-xs text-soc-neutral">{row.subject_type?.replace("App\\Models\\", "") || "-"}</span>,
    },
    {
      key: "actions",
      header: "",
      render: (row) =>
        row.properties?.old || row.properties?.attributes ? (
          <button
            onClick={() => setModalData(row)}
            className="text-xs text-soc-info hover:underline"
          >
            Ver diff
          </button>
        ) : null,
      className: "w-20",
    },
  ];

  return (
    <>
      <Header title="Audit Trail" subtitle="Historico completo de alteracoes" />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select
          value={logName}
          onChange={(e) => { setLogName(e.target.value); setPage(1); }}
          className="rounded-lg bg-soc-card border border-soc-border px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-soc-info"
        >
          <option value="">Todos os canais</option>
          <option value="security">Security</option>
          <option value="default">Default</option>
        </select>
        <select
          value={event}
          onChange={(e) => { setEvent(e.target.value); setPage(1); }}
          className="rounded-lg bg-soc-card border border-soc-border px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-soc-info"
        >
          <option value="">Todos os eventos</option>
          <option value="created">Created</option>
          <option value="updated">Updated</option>
          <option value="deleted">Deleted</option>
        </select>
        <input
          type="date"
          value={since}
          onChange={(e) => { setSince(e.target.value); setPage(1); }}
          className="rounded-lg bg-soc-card border border-soc-border px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-soc-info"
          placeholder="Desde"
        />
        <input
          type="date"
          value={until}
          onChange={(e) => { setUntil(e.target.value); setPage(1); }}
          className="rounded-lg bg-soc-card border border-soc-border px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-soc-info"
          placeholder="Ate"
        />
        <button
          onClick={exportCsv}
          disabled={!data?.data.length}
          className="ml-auto flex items-center gap-1.5 rounded-lg bg-soc-card border border-soc-border px-3 py-1.5 text-sm text-gray-300 hover:bg-soc-card-hover disabled:opacity-40 transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          Exportar CSV
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-soc-border bg-soc-card p-4">
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          loading={isLoading}
          currentPage={data?.meta.current_page}
          lastPage={data?.meta.last_page}
          total={data?.meta.total}
          onPageChange={setPage}
        />
      </div>

      {/* JSON Diff Modal */}
      <Modal
        open={!!modalData}
        onClose={() => setModalData(null)}
        title={`Alteracao: ${modalData?.description || ""}`}
      >
        {modalData && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-medium text-soc-danger mb-2">Antes (old)</h4>
              <pre className="rounded-lg bg-soc-bg p-3 text-xs text-gray-300 overflow-auto max-h-[300px]">
                {JSON.stringify(modalData.properties?.old || {}, null, 2)}
              </pre>
            </div>
            <div>
              <h4 className="text-xs font-medium text-soc-success mb-2">Depois (new)</h4>
              <pre className="rounded-lg bg-soc-bg p-3 text-xs text-gray-300 overflow-auto max-h-[300px]">
                {JSON.stringify(modalData.properties?.attributes || {}, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
