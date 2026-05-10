import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import almaty from "../data/almaty.json";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { getLatestAQI } from "../api/api";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet.heat";
import { useTheme } from "../context/ThemeContext";

const DISTRICT_COORDS = {
  Bostandyk: [43.235, 76.855],
  Medeu:     [43.195, 76.935],
  Auezov:    [43.260, 76.840],
  Alatau:    [43.305, 76.855],
  Jetisu:    [43.265, 76.940],
};

const DISTRICT_IDS = {
  Bostandyk: 1, Medeu: 2, Auezov: 3, Alatau: 4, Jetisu: 5,
};

function getColor(pm) {
  if (pm <= 12)  return "#00e400";
  if (pm <= 35)  return "#ffff00";
  if (pm <= 55)  return "#ff7e00";
  if (pm <= 150) return "#ff0000";
  return "#7e0023";
}

function getLabel(pm) {
  if (pm <= 12)  return "Good";
  if (pm <= 35)  return "Moderate";
  if (pm <= 55)  return "Unhealthy for Sensitive";
  if (pm <= 150) return "Unhealthy";
  return "Hazardous";
}

function makeIcon(pm) {
  const color = getColor(pm);
  const value = Math.round(pm);
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width:48px; height:48px;
        background:${color};
        border:3px solid rgba(255,255,255,0.9);
        border-radius:50%;
        display:flex; align-items:center; justify-content:center;
        font-family:sans-serif; font-weight:700; font-size:13px;
        color:#fff;
        text-shadow:0 1px 3px rgba(0,0,0,0.6);
        box-shadow:0 3px 10px rgba(0,0,0,0.35);
        cursor:pointer;
        transition:transform 0.15s;
      ">${value}</div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });
}

function FixMapResize() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 400);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

function HeatmapLayer({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    const heat = L.heatLayer(points, {
      radius: 90,
      blur: 60,
      maxZoom: 13,
      gradient: { 0.0: "#00e400", 0.3: "#ffff00", 0.5: "#ff7e00", 0.7: "#ff0000", 1.0: "#7e0023" },
    }).addTo(map);
    return () => map.removeLayer(heat);
  }, [map, points]);
  return null;
}

export default function AQIMap({ selectedDate, fullHeight = false, fullscreen = false }) {
  const [districts, setDistricts] = useState([]);
  const [heatPoints, setHeatPoints] = useState([]);
  const { dark } = useTheme();
  const navigate = useNavigate();

  const tileUrl = dark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  useEffect(() => {
    getLatestAQI(selectedDate)
      .then((res) => {
        const data = res?.data || res;
        const list = Array.isArray(data) ? data : [];

        const points = [];
        const districtList = [];

        list.forEach((d) => {
          if (!DISTRICT_COORDS[d.district]) return;
          const val = d.pm25_median || d.aqi || 0;
          const [lat, lng] = DISTRICT_COORDS[d.district];
          points.push([lat, lng, Math.min(val / 150, 1)]);
          districtList.push({ name: d.district, lat, lng, pm25: val });
        });

        setHeatPoints(points);
        setDistricts(districtList);
      })
      .catch(() => {});
  }, [selectedDate]);

  return (
    <div
      style={{
        height: fullscreen ? "100vh" : fullHeight ? "calc(100vh - 280px)" : "500px",
        minHeight: "450px",
        width: "100%",
        borderRadius: fullscreen ? "0" : "20px",
        overflow: "hidden",
        border: fullscreen ? "none" : "1px solid #eee",
      }}
    >
      <MapContainer
        center={[43.2389, 76.8897]}
        zoom={11}
        style={{ height: "100%", width: "100%" }}
      >
        <FixMapResize />
        <TileLayer key={tileUrl} url={tileUrl} />
        <HeatmapLayer points={heatPoints} />

        <GeoJSON
          key={JSON.stringify(districts)}
          data={almaty}
          style={() => ({ fillOpacity: 0, weight: 0, color: "transparent" })}
          onEachFeature={(feature, layer) => {
            const name = feature.properties.name;
            const d = districts.find((x) => x.name === name);
            if (!d) return;

            layer.bindPopup(`
              <div style="min-width:150px;line-height:1.7">
                <div style="font-weight:700;font-size:13px">${name} district</div>
                <div>PM₂.₅: <b>${d.pm25} μg/m³</b></div>
                <div style="color:${getColor(d.pm25)};font-weight:600">${getLabel(d.pm25)}</div>
                <div style="font-size:11px;color:#999;margin-top:4px">Click to open dashboard →</div>
              </div>
            `);

            layer.on({
              mouseover: (e) => { e.target.setStyle({ fillOpacity: 0.08, weight: 1, color: "#fff" }); layer.openPopup(); },
              mouseout:  (e) => { e.target.setStyle({ fillOpacity: 0, weight: 0, color: "transparent" }); layer.closePopup(); },
              click: () => navigate(`/dashboard?district=${DISTRICT_IDS[name]}`),
            });
          }}
        />

      </MapContainer>
    </div>
  );
}
