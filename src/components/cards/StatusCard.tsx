"use client";

import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";
import LiveDot from "@/components/ui/LiveDot";
import Skeleton from "@/components/ui/Skeleton";

interface StatusCardProps {
  label: string;
  ok: boolean;
  detail: string;
  icon: LucideIcon;
  loading?: boolean;
}

export default function StatusCard({ label, ok, detail, icon: Icon, loading }: StatusCardProps) {
  if (loading) {
    return <Skeleton className="h-24 rounded-xl" />;
  }

  return (
    <div
      className={clsx(
        "rounded-xl border p-4 transition-colors duration-300",
        "bg-soc-card hover:bg-soc-card-hover",
        ok ? "border-soc-success/20" : "border-soc-danger/30"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <Icon className={clsx("h-5 w-5", ok ? "text-soc-success" : "text-soc-danger")} />
        <LiveDot ok={ok} />
      </div>
      <p className="text-sm font-medium text-gray-200">{label}</p>
      <p className="text-xs text-soc-neutral mt-1 truncate">{detail}</p>
    </div>
  );
}
