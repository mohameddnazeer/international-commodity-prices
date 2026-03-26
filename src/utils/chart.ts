import { CommodityRecord, TrendPoint } from "@/types/domain";
import { formatDate } from "@/utils/format";

export const buildTrendPoints = (rows: CommodityRecord[]): TrendPoint[] => {
  const grouped = rows.reduce<Record<string, { total: number; count: number }>>(
    (acc, row) => {
      if (!acc[row.date]) {
        acc[row.date] = { total: 0, count: 0 };
      }
      acc[row.date].total += row.currentPrice;
      acc[row.date].count += 1;
      return acc;
    },
    {},
  );

  return Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, entry]) => ({
      label: formatDate(date),
      value: Number((entry.total / entry.count).toFixed(2)),
    }));
};
