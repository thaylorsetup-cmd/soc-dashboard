import { useQuery } from "@tanstack/react-query";
import { socFetch } from "@/lib/api";
import { REFRESH } from "@/lib/constants";
import type { QueueMetricsResponse } from "@/types/api";

export function useQueue() {
  return useQuery({
    queryKey: ["soc", "queue"],
    queryFn: () => socFetch<QueueMetricsResponse>("/system/queue"),
    refetchInterval: REFRESH.FAST,
  });
}
