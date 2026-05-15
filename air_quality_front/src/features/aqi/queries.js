import { useQuery } from "@tanstack/react-query"

import { get } from "@/lib/http"

export const aqiKeys = {
  all: ["aqi"],
  latest: () => [...aqiKeys.all, "latest"],
  byDate: (date) => [...aqiKeys.all, "by-date", date],
  history: (districtId) => [...aqiKeys.all, "history", districtId],
  pm25History: (districtId) => ["pm25-history", districtId],
}

export function useLatestAQI() {
  return useQuery({
    queryKey: aqiKeys.latest(),
    queryFn: () => get("/aqi/latest"),
  })
}

export function useAQIByDate(date) {
  return useQuery({
    queryKey: aqiKeys.byDate(date),
    queryFn: () => get("/aqi/by-date", { params: { date } }),
    enabled: Boolean(date),
  })
}

export function useAQIHistory(districtId) {
  return useQuery({
    queryKey: aqiKeys.history(districtId),
    queryFn: () => get(`/aqi/history/${districtId}`),
    enabled: Boolean(districtId),
  })
}

export function useAQIForDate(date) {
  return date ? useAQIByDate(date) : useLatestAQI()
}

export function usePM25History(districtId) {
  return useQuery({
    queryKey: aqiKeys.pm25History(districtId),
    queryFn: () => get(`/pm25/history/${districtId}`),
    enabled: Boolean(districtId),
  })
}
