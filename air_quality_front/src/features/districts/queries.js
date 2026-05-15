import { useQuery } from "@tanstack/react-query"

import { get } from "@/lib/http"

export function useDistricts() {
  return useQuery({
    queryKey: ["districts"],
    queryFn: () => get("/districts"),
    staleTime: 10 * 60 * 1000,
  })
}
