import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { chartColors } from "./chart-utils"

export function LineChart({ data, dataKey = "value", xKey = "date", height = 280 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid()} />
        <XAxis dataKey={xKey} tick={{ fill: chartColors.text(), fontSize: 12 }} />
        <YAxis tick={{ fill: chartColors.text(), fontSize: 12 }} />
        <Tooltip contentStyle={{ background: chartColors.surface(), borderColor: chartColors.grid() }} />
        <Line type="monotone" dataKey={dataKey} stroke={chartColors.accent()} strokeWidth={2.5} dot={false} />
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}
