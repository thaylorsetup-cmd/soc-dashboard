import { useQuery } from "@tanstack/react-query";
import { socFetch } from "@/lib/api";
import { REFRESH } from "@/lib/constants";
import type { SystemLogsResponse } from "@/types/api";

export function useLogs() {
  return useQuery({
    queryKey: ["soc", "logs"],
    queryFn: () => socFetch<SystemLogsResponse>("/system/logs"),
    refetchInterval: REFRESH.NORMAL,
  });
}
