import { useQuery } from "@tanstack/react-query"

import { get } from "@/lib/http"

export function useStatsSummary() {
  return useQuery({
    queryKey: ["stats-summary"],
    queryFn: () => get("/stats/summary"),
  })
}
