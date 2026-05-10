// src/components/Pm.jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Добавляем dataKey в параметры (деструктуризация)
export default function PmLineChart({ data, dataKey = "pm25" }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm text-sm text-gray-500">
        No data for selected period
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      {/* Заголовок может быть динамическим или статичным */}
      <h3 className="text-lg font-semibold mb-4">Historical Air Quality Data</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis 
            dataKey="date" 
            tick={{fontSize: 10}} 
            tickMargin={10}
          />
          <YAxis tick={{fontSize: 10}} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={dataKey} // ИСПОЛЬЗУЕМ ДИНАМИЧЕСКИЙ КЛЮЧ
            stroke="#6366F1"
            strokeWidth={3}
            dot={{ r: 2, fill: "#6366F1" }}
            activeDot={{ r: 6 }}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}