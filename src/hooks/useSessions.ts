import { useQuery } from "@tanstack/react-query";
import { socFetch } from "@/lib/api";
import { REFRESH } from "@/lib/constants";
import type { SessionsResponse } from "@/types/api";

export function useSessions() {
  return useQuery({
    queryKey: ["soc", "sessions"],
    queryFn: () => socFetch<SessionsResponse>("/sessions"),
    refetchInterval: REFRESH.FAST,
  });
}
