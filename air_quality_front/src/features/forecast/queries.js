import { useQuery } from "@tanstack/react-query"

import { get } from "@/lib/http"

export function useForecast(districtId, days = 7) {
  return useQuery({
    queryKey: ["forecast", districtId, days],
    queryFn: () =>
      get("/forecast", {
        params: {
          district_id: districtId,
          days,
        },
      }),
    enabled: Boolean(districtId),
  })
}
