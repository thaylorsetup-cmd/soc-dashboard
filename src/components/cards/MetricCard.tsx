"use client";

import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  subtitle?: string;
  loading?: boolean;
}

export default function MetricCard({
  label,
  value,
  icon: Icon,
  color = "text-soc-info",
  subtitle,
  loading,
}: MetricCardProps) {
  if (loading) {
    return <Skeleton className="h-28 rounded-xl" />;
  }

  return (
    <div className="rounded-xl border border-soc-border bg-soc-card p-4 hover:bg-soc-card-hover transition-colors">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={clsx("h-4 w-4", color)} />
        <span className="text-sm text-soc-neutral">{label}</span>
      </div>
      <p className={clsx("text-3xl font-bold", color)}>{value}</p>
      {subtitle && (
        <p className="text-xs text-soc-neutral mt-1">{subtitle}</p>
      )}
    </div>
  );
}
