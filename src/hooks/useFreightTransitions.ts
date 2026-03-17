import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { socFetch } from "@/lib/api";
import type { PaginatedResponse, FreightTransition } from "@/types/api";

interface FreightTransitionsParams {
  since?: string;
  per_page?: number;
  page?: number;
}

export function useFreightTransitions(params: FreightTransitionsParams = {}) {
  return useQuery({
    queryKey: ["soc", "freight-transitions", params],
    queryFn: () =>
      socFetch<PaginatedResponse<FreightTransition>>("/freight/transitions", {
        since: params.since,
        per_page: params.per_page,
        page: params.page,
      }),
    placeholderData: keepPreviousData,
  });
}
