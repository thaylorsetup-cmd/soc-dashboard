import { useQuery } from "@tanstack/react-query";
import { socFetch } from "@/lib/api";
import { REFRESH } from "@/lib/constants";
import type { FreightPipelineResponse } from "@/types/api";

export function useFreightPipeline() {
  return useQuery({
    queryKey: ["soc", "freight-pipeline"],
    queryFn: () => socFetch<FreightPipelineResponse>("/freight/pipeline"),
    refetchInterval: REFRESH.NORMAL,
  });
}
