import { Badge } from "@/components/ui/badge"
import { aqiCategory } from "@/lib/aqi"
import { cn } from "@/lib/cn"

const aqiBadgeClasses = {
  "aqi-good": "border-aqi-good/20 bg-aqi-good/15 text-aqi-good",
  "aqi-moderate":
    "border-aqi-moderate/20 bg-aqi-moderate/15 text-aqi-moderate",
  "aqi-usg": "border-aqi-usg/20 bg-aqi-usg/15 text-aqi-usg",
  "aqi-unhealthy":
    "border-aqi-unhealthy/20 bg-aqi-unhealthy/15 text-aqi-unhealthy",
  "aqi-very-unhealthy":
    "border-aqi-very-unhealthy/20 bg-aqi-very-unhealthy/15 text-aqi-very-unhealthy",
  "aqi-hazardous":
    "border-aqi-hazardous/20 bg-aqi-hazardous/15 text-aqi-hazardous",
}

export function AQIBadge({ value, showValue = true, className }) {
  const category = aqiCategory(value)

  return (
    <Badge
      className={cn(
        aqiBadgeClasses[category.token],
        className,
      )}
    >
      {showValue ? `${value} · ${category.label}` : category.label}
    </Badge>
  )
}
