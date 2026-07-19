"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useFormatter, useTranslations } from "next-intl"
import type { ExerciseProgressPoint } from "@/types/domain"

export function ExerciseProgressCharts({
  data,
}: {
  data: ExerciseProgressPoint[]
}) {
  const t = useTranslations("statistics")
  const tWorkout = useTranslations("workout")
  const tHistory = useTranslations("history")
  const format = useFormatter()

  const tooltipContentStyle = {
    fontSize: 12,
    background: "var(--popover)",
    color: "var(--popover-foreground)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
  }
  const tooltipLabelStyle = { color: "var(--popover-foreground)" }
  const tooltipItemStyle = { color: "var(--popover-foreground)" }

  const chartData = data.map((d) => ({
    ...d,
    label: format.dateTime(new Date(d.date), { day: "numeric", month: "short" }),
  }))

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border bg-card p-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          {t("weightChart")}
        </p>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={32} />
              <Tooltip
                formatter={(value) => [`${Number(value)} kg`, tWorkout("weight")]}
                contentStyle={tooltipContentStyle}
                labelStyle={tooltipLabelStyle}
                itemStyle={tooltipItemStyle}
              />
              <Line
                type="monotone"
                dataKey="maxWeight"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          {t("volumeChart")}
        </p>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={32} />
              <Tooltip
                formatter={(value) => [`${Number(value)} kg`, tHistory("volume")]}
                contentStyle={tooltipContentStyle}
                labelStyle={tooltipLabelStyle}
                itemStyle={tooltipItemStyle}
              />
              <Line
                type="monotone"
                dataKey="volume"
                stroke="var(--chart-2, var(--primary))"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
