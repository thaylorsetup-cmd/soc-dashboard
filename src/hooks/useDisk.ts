import { useQuery } from "@tanstack/react-query";
import { socFetch } from "@/lib/api";
import { REFRESH } from "@/lib/constants";
import type { DiskUsageResponse } from "@/types/api";

export function useDisk() {
  return useQuery({
    queryKey: ["soc", "disk"],
    queryFn: () => socFetch<DiskUsageResponse>("/system/disk"),
    refetchInterval: REFRESH.NORMAL,
  });
}
