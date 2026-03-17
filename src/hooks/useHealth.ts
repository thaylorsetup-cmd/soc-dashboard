import { useQuery } from "@tanstack/react-query";
import { socFetch } from "@/lib/api";
import { REFRESH } from "@/lib/constants";
import type { HealthCheckResponse } from "@/types/api";

export function useHealth() {
  return useQuery({
    queryKey: ["soc", "health"],
    queryFn: () => socFetch<HealthCheckResponse>("/health"),
    refetchInterval: REFRESH.FAST,
  });
}
