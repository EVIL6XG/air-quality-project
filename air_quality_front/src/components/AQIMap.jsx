import { useEffect, useMemo } from "react"
import {
  CircleMarker,
  GeoJSON,
  MapContainer,
  TileLayer,
  ZoomControl,
  useMap,
} from "react-leaflet"
import { useNavigate } from "react-router-dom"
import L from "leaflet"
import "leaflet.heat"

import almaty from "@/data/almaty.json"
import { useAQIForDate } from "@/features/aqi/queries"
import { useTheme } from "@/providers/theme-provider"

const DISTRICT_COORDS = {
  Bostandyk: [43.235, 76.855],
  Medeu: [43.195, 76.935],
  Auezov: [43.26, 76.84],
  Alatau: [43.305, 76.855],
  Jetisu: [43.265, 76.94],
}

const DISTRICT_IDS = {
  Bostandyk: 1,
  Medeu: 2,
  Auezov: 3,
  Alatau: 4,
  Jetisu: 5,
}

function getColor(pm) {
  if (pm <= 12) return "#22c55e"
  if (pm <= 35) return "#eab308"
  if (pm <= 55) return "#f97316"
  if (pm <= 150) return "#ef4444"
  return "#881337"
}

function getLabel(pm) {
  if (pm <= 12) return "Good"
  if (pm <= 35) return "Moderate"
  if (pm <= 55) return "Unhealthy for Sensitive"
  if (pm <= 150) return "Unhealthy"
  return "Hazardous"
}

function FixMapResize() {
  const map = useMap()

  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 400)
    return () => clearTimeout(timer)
  }, [map])

  return null
}

function HeatmapLayer({ points }) {
  const map = useMap()

  useEffect(() => {
    if (!points.length) return undefined

    const heat = L.heatLayer(points, {
      radius: 72,
      blur: 46,
      maxZoom: 13,
      gradient: {
        0.0: "#22c55e",
        0.3: "#eab308",
        0.5: "#f97316",
        0.7: "#ef4444",
        1.0: "#881337",
      },
    }).addTo(map)

    return () => map.removeLayer(heat)
  }, [map, points])

  return null
}

export default function AQIMap({
  selectedDate,
  fullHeight = false,
  fullscreen = false,
}) {
  const { data } = useAQIForDate(selectedDate)
  const { theme } = useTheme()
  const navigate = useNavigate()
  const dark = theme === "dark"

  const { districts, heatPoints } = useMemo(() => {
    const list = Array.isArray(data) ? data : []
    const points = []
    const districtList = []

    list.forEach((district) => {
      if (!DISTRICT_COORDS[district.district]) return

      const value = district.pm25_median || district.aqi || 0
      const [lat, lng] = DISTRICT_COORDS[district.district]

      points.push([lat, lng, Math.min(value / 150, 1)])
      districtList.push({ name: district.district, lat, lng, pm25: value })
    })

    return { districts: districtList, heatPoints: points }
  }, [data])

  const tileUrl = dark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

  const attribution = dark
    ? '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap contributors'
    : '&copy; OpenStreetMap contributors'

  return (
    <div
      className="relative overflow-hidden"
      style={{
        height: fullscreen ? "100vh" : fullHeight ? "calc(100vh - 260px)" : "620px",
        minHeight: fullscreen ? "100vh" : "560px",
        width: "100%",
        borderRadius: fullscreen ? "0" : "28px",
        border: fullscreen ? "none" : "1px solid rgb(255 255 255 / 0.12)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 z-[450] bg-[radial-gradient(ellipse_at_center,rgb(34_211_238/0.05),transparent_58%)]" />
      <MapContainer
        center={[43.2389, 76.8897]}
        zoom={11}
        minZoom={10}
        maxZoom={15}
        scrollWheelZoom
        doubleClickZoom
        touchZoom
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <FixMapResize />
        <ZoomControl position="topright" />
        <TileLayer key={tileUrl} url={tileUrl} attribution={attribution} />
        <HeatmapLayer points={heatPoints} />

        <GeoJSON
          key={JSON.stringify(districts)}
          data={almaty}
          style={() => ({
            fillOpacity: 0.03,
            fillColor: "#22d3ee",
            weight: 1.8,
            color: "#22d3ee",
            opacity: 0.9,
          })}
          onEachFeature={(feature, layer) => {
            const name = feature.properties.name
            const district = districts.find((item) => item.name === name)
            if (!district) return

            layer.bindPopup(`
              <div style="min-width:170px;line-height:1.7;font-family:Inter,system-ui">
                <div style="font-weight:800;font-size:13px">${name} district</div>
                <div>PM2.5: <b>${district.pm25} ug/m3</b></div>
                <div style="color:${getColor(district.pm25)};font-weight:700">${getLabel(district.pm25)}</div>
                <div style="font-size:11px;color:#64748b;margin-top:4px">Click to open dashboard</div>
              </div>
            `)

            layer.on({
              mouseover: (event) => {
                event.target.setStyle({
                  fillOpacity: 0.22,
                  weight: 3,
                  color: "#a5f3fc",
                })
                layer.openPopup()
              },
              mouseout: (event) => {
                event.target.setStyle({
                  fillOpacity: 0.03,
                  weight: 1.8,
                  color: "#22d3ee",
                })
                layer.closePopup()
              },
              click: () => navigate(`/dashboard?district=${DISTRICT_IDS[name]}`),
            })
          }}
        />

        {districts.map((district) => (
          <CircleMarker
            key={district.name}
            center={[district.lat, district.lng]}
            radius={10}
            pathOptions={{
              color: getColor(district.pm25),
              fillColor: getColor(district.pm25),
              fillOpacity: 0.72,
              opacity: 0.95,
              weight: 2,
            }}
          />
        ))}
      </MapContainer>
    </div>
  )
}
