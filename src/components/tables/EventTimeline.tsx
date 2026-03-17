"use client";

import { clsx } from "clsx";
import { formatDateShort } from "@/lib/formatters";
import Skeleton from "@/components/ui/Skeleton";
import type { SecurityEvent } from "@/types/api";

const LEVEL_COLORS: Record<string, string> = {
  CRITICAL: "bg-soc-danger",
  WARNING: "bg-soc-warning",
  INFO: "bg-soc-info",
  ERROR: "bg-soc-danger",
};

const TYPE_LABELS: Record<string, string> = {
  login_failed: "Login falhado",
  login_success: "Login OK",
  permission_denied: "Permissao negada",
  brute_force: "Brute force",
  export: "Export",
  logout: "Logout",
  lockout: "Lockout",
  unknown: "Evento",
};

interface EventTimelineProps {
  events: SecurityEvent[];
  loading?: boolean;
}

export default function EventTimeline({ events, loading }: EventTimelineProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-12" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <p className="text-sm text-soc-neutral py-8 text-center">
        Nenhum evento recente
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {events.map((event, idx) => (
        <div
          key={`${event.timestamp}-${idx}`}
          className="flex items-start gap-3 rounded-lg px-3 py-2 hover:bg-soc-card-hover transition-colors"
        >
          <div className="mt-1.5 flex-shrink-0">
            <span
              className={clsx(
                "block h-2 w-2 rounded-full",
                LEVEL_COLORS[event.level] || "bg-soc-neutral"
              )}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-300">
                {TYPE_LABELS[event.type] || event.type}
              </span>
              <span className="text-xs text-soc-neutral">
                {formatDateShort(event.timestamp)}
              </span>
            </div>
            <p className="text-xs text-soc-neutral mt-0.5 truncate">
              {event.message}
              {event.context?.ip ? ` - ${String(event.context.ip)}` : null}
              {event.context?.email ? ` (${String(event.context.email)})` : null}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
