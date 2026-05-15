import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { chartColors } from "./chart-utils"

export function BarChart({ data, dataKey = "value", xKey = "date", height = 280 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid()} />
        <XAxis dataKey={xKey} tick={{ fill: chartColors.text(), fontSize: 12 }} />
        <YAxis tick={{ fill: chartColors.text(), fontSize: 12 }} />
        <Tooltip contentStyle={{ background: chartColors.surface(), borderColor: chartColors.grid() }} />
        <Bar dataKey={dataKey} fill={chartColors.accent()} radius={[6, 6, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
