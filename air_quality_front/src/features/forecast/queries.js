import { useQuery } from "@tanstack/react-query"

import { get } from "@/lib/http"

export function useForecast(districtId, days = 7, model = "ml") {
  return useQuery({
    queryKey: ["forecast", districtId, days, model],
    queryFn: () =>
      get("/forecast", {
        params: {
          district_id: districtId,
          days,
          model,
        },
      }),
    enabled: Boolean(districtId),
  })
}
