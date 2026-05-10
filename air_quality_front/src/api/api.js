const API_BASE = "http://127.0.0.1:5000/api";


export async function getLatestAQI() {
  const res = await fetch(`${API_BASE}/aqi/latest`);
  return res.json();
}

export async function getAQIByDate(date) {
  const res = await fetch(`${API_BASE}/aqi/by-date?date=${date}`);
  return res.json();
}

export async function getDistricts() {
  const res = await fetch(`${API_BASE}/districts`);
  return res.json();
}

export async function getAQIHistory(id) {
  const res = await fetch(`${API_BASE}/aqi/history/${id}`);
  return res.json();
}

export async function getPM25History(id) {
  const res = await fetch(`${API_BASE}/pm25/history/${id}`);
  return res.json();
}

export async function getStatsSummary() {
  const res = await fetch(`${API_BASE}/stats/summary`);
  return res.json();
}

export async function getForecast(districtId, days = 7) {
  const res = await fetch(`${API_BASE}/forecast?district_id=${districtId}&days=${days}`);
  return res.json();
}

export async function sendChatMessage(message) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  return res.json();
}
