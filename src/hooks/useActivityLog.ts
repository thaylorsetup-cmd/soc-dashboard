import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { socFetch } from "@/lib/api";
import type { PaginatedResponse, ActivityLogEntry } from "@/types/api";

interface ActivityLogParams {
  log_name?: string;
  subject_type?: string;
  causer_id?: number;
  event?: string;
  since?: string;
  until?: string;
  per_page?: number;
  page?: number;
}

export function useActivityLog(params: ActivityLogParams = {}) {
  return useQuery({
    queryKey: ["soc", "activity-log", params],
    queryFn: () =>
      socFetch<PaginatedResponse<ActivityLogEntry>>("/activity-log", {
        log_name: params.log_name,
        subject_type: params.subject_type,
        causer_id: params.causer_id,
        event: params.event,
        since: params.since,
        until: params.until,
        per_page: params.per_page,
        page: params.page,
      }),
    placeholderData: keepPreviousData,
  });
}
