import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { socFetch } from "@/lib/api";
import type { PaginatedResponse, SecurityEvent } from "@/types/api";

interface SecurityEventsParams {
  since?: string;
  until?: string;
  type?: string;
  page?: number;
  per_page?: number;
}

export function useSecurityEvents(params: SecurityEventsParams = {}) {
  return useQuery({
    queryKey: ["soc", "security-events", params],
    queryFn: () =>
      socFetch<PaginatedResponse<SecurityEvent>>("/security/events", {
        since: params.since,
        until: params.until,
        type: params.type,
        page: params.page,
        per_page: params.per_page,
      }),
    placeholderData: keepPreviousData,
  });
}
