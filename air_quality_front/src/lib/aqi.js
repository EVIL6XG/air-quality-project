const AQI_CATEGORIES = [
  {
    max: 50,
    label: "Good",
    token: "aqi-good",
    hex: "#22c55e",
  },
  {
    max: 100,
    label: "Moderate",
    token: "aqi-moderate",
    hex: "#eab308",
  },
  {
    max: 150,
    label: "Unhealthy for Sensitive Groups",
    token: "aqi-usg",
    hex: "#f97316",
  },
  {
    max: 200,
    label: "Unhealthy",
    token: "aqi-unhealthy",
    hex: "#ef4444",
  },
  {
    max: 300,
    label: "Very Unhealthy",
    token: "aqi-very-unhealthy",
    hex: "#a855f7",
  },
]

const HAZARDOUS_AQI = {
  label: "Hazardous",
  token: "aqi-hazardous",
  hex: "#7f1d1d",
}

export function aqiCategory(value) {
  const aqi = Number(value)
  return AQI_CATEGORIES.find((category) => aqi <= category.max) ?? HAZARDOUS_AQI
}

/**
 * @deprecated Use aqiCategory(value) instead.
 */
export const getAQILevel = aqiCategory