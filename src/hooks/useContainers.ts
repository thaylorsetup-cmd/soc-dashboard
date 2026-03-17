import { useQuery } from "@tanstack/react-query";
import { socFetch } from "@/lib/api";
import { REFRESH } from "@/lib/constants";
import type { ContainersResponse } from "@/types/api";

export function useContainers() {
  return useQuery({
    queryKey: ["soc", "containers"],
    queryFn: () => socFetch<ContainersResponse>("/containers"),
    refetchInterval: REFRESH.FAST,
  });
}
