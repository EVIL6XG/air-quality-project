import { Line, LineChart as RechartsLineChart, ResponsiveContainer } from "recharts"

import { chartColors } from "./chart-utils"

export function SparklineChart({ data, dataKey = "value", height = 48 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data}>
        <Line type="monotone" dataKey={dataKey} stroke={chartColors.accent()} strokeWidth={2} dot={false} />
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}
