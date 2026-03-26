import { PriceTrend } from "@/types/domain";

export const toIsoDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toISOString().slice(0, 10);
};

export const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "غير متاح";
  }
  return new Intl.DateTimeFormat("ar-EG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export const formatNumber = (value: number) =>
  new Intl.NumberFormat("ar-EG", {
    maximumFractionDigits: 2,
  }).format(value);

export const formatCurrency = (value: number, currencyLabel: string) =>
  `${formatNumber(value)} ${currencyLabel}`;

export const getTrendByPercent = (value: number): PriceTrend => {
  if (value > 0) return "up";
  if (value < 0) return "down";
  return "neutral";
};

export const formatUnknownValue = (value: string | number | null) => {
  if (value === null) return "—";
  if (typeof value === "number") return formatNumber(value);
  if (!value.trim()) return "—";
  const dateValue = new Date(value);
  if (!Number.isNaN(dateValue.getTime())) {
    return formatDate(value);
  }
  return value;
};
