import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { chartColors } from "./chart-utils"

export function AreaChart({ data, dataKey = "value", xKey = "date", height = 280 }) {
  const gradientId = `area-${dataKey}`

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart data={data}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={chartColors.accent()} stopOpacity={0.35} />
            <stop offset="95%" stopColor={chartColors.accent()} stopOpacity={0.03} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid()} />
        <XAxis dataKey={xKey} tick={{ fill: chartColors.text(), fontSize: 12 }} />
        <YAxis tick={{ fill: chartColors.text(), fontSize: 12 }} />
        <Tooltip contentStyle={{ background: chartColors.surface(), borderColor: chartColors.grid() }} />
        <Area type="monotone" dataKey={dataKey} stroke={chartColors.accent()} fill={`url(#${gradientId})`} strokeWidth={2.5} />
      </RechartsAreaChart>
    </ResponsiveContainer>
  )
}
