import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { socFetch } from "@/lib/api";
import type { GuardianAlertsResponse } from "@/types/api";

interface GuardianAlertsParams {
  severity?: string;
  workflow?: string;
  since?: string;
  per_page?: number;
  page?: number;
}

export function useGuardianAlerts(params: GuardianAlertsParams = {}) {
  return useQuery({
    queryKey: ["soc", "guardian-alerts", params],
    queryFn: () =>
      socFetch<GuardianAlertsResponse>("/guardian-alerts", {
        severity: params.severity,
        workflow: params.workflow,
        since: params.since,
        per_page: params.per_page,
        page: params.page,
      }),
    placeholderData: keepPreviousData,
  });
}
