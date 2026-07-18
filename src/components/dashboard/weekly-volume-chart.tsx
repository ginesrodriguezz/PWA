"use client"

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useFormatter, useLocale } from "next-intl"

export function WeeklyVolumeChart({
  data,
}: {
  data: { weekStart: string; volume: number }[]
}) {
  const format = useFormatter()
  const locale = useLocale()

  const chartData = data.map((d) => ({
    ...d,
    label: format.dateTime(new Date(d.weekStart), {
      day: "numeric",
      month: "short",
    }),
  }))

  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval={locale === "en" ? 0 : 0}
          />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={32} />
          <Tooltip
            formatter={(value) => [`${Number(value).toLocaleString()} kg`, ""]}
            contentStyle={{ fontSize: 12 }}
          />
          <Bar dataKey="volume" fill="var(--primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
