export function cssVar(name) {
  if (typeof window === "undefined") return ""
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

export function rgbVar(name, alpha = 1) {
  const value = cssVar(name)
  return value ? `rgb(${value} / ${alpha})` : undefined
}

export const chartColors = {
  accent: () => rgbVar("--accent"),
  grid: () => rgbVar("--border-subtle", 0.6),
  text: () => rgbVar("--text-secondary"),
  surface: () => rgbVar("--surface-1"),
}
