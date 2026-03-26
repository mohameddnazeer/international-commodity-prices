"use client";

import { TrendPoint } from "@/types/domain";
import { formatNumber } from "@/utils/format";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PriceTrendChartProps {
  data: TrendPoint[];
  title: string;
}

export const PriceTrendChart = ({ data, title }: PriceTrendChartProps) => (
  <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
    <h3 className="text-right text-base font-semibold">{title}</h3>
    <div className="mt-4 h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#71717A33" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={formatNumber} />
          <Tooltip
            formatter={(value) =>
              typeof value === "number" ? formatNumber(value) : value
            }
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #27272A",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#6366F1"
            strokeWidth={2.5}
            dot={{ r: 2 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </section>
);
