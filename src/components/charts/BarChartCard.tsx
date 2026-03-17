"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Skeleton from "@/components/ui/Skeleton";

interface BarConfig {
  dataKey: string;
  color: string;
  name: string;
}

interface BarChartCardProps {
  title: string;
  data: Record<string, unknown>[];
  bars: BarConfig[];
  xDataKey: string;
  loading?: boolean;
  height?: number;
}

export default function BarChartCard({
  title,
  data,
  bars,
  xDataKey,
  loading,
  height = 280,
}: BarChartCardProps) {
  if (loading) {
    return <div style={{ height }}><Skeleton className="rounded-xl h-full" /></div>;
  }

  return (
    <div className="rounded-xl border border-soc-border bg-soc-card p-4">
      <h3 className="text-sm font-medium text-gray-300 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey={xDataKey} tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} />
          <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#e2e8f0",
            }}
          />
          <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 12 }} />
          {bars.map((bar) => (
            <Bar key={bar.dataKey} dataKey={bar.dataKey} fill={bar.color} name={bar.name} radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
