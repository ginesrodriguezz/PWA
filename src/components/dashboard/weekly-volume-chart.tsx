"use client"

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useFormatter, useLocale, useTranslations } from "next-intl"

export function WeeklyVolumeChart({
  data,
}: {
  data: { weekStart: string; volume: number }[]
}) {
  const format = useFormatter()
  const locale = useLocale()
  const tHistory = useTranslations("history")

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
            formatter={(value) => [
              `${Number(value).toLocaleString()} kg`,
              tHistory("volume"),
            ]}
            contentStyle={{
              fontSize: 12,
              background: "var(--popover)",
              color: "var(--popover-foreground)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
            }}
            labelStyle={{ color: "var(--popover-foreground)" }}
            itemStyle={{ color: "var(--popover-foreground)" }}
          />
          <Bar dataKey="volume" fill="var(--primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
