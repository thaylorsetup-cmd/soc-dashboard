import { useQuery } from "@tanstack/react-query";
import { socFetch } from "@/lib/api";
import { REFRESH } from "@/lib/constants";
import type { IntegrityCheckResponse } from "@/types/api";

export function useIntegrity() {
  return useQuery({
    queryKey: ["soc", "integrity"],
    queryFn: () => socFetch<IntegrityCheckResponse>("/integrity"),
    refetchInterval: REFRESH.NORMAL,
  });
}
