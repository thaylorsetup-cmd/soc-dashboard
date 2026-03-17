import { useQuery } from "@tanstack/react-query";
import { socFetch } from "@/lib/api";
import { REFRESH } from "@/lib/constants";
import type { DailyReportResponse } from "@/types/api";

export function useDailyReport() {
  return useQuery({
    queryKey: ["soc", "daily-report"],
    queryFn: () => socFetch<DailyReportResponse>("/report/daily"),
    refetchInterval: REFRESH.NORMAL,
  });
}
