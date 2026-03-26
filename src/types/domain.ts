export type CategorySlug = "international" | "fertilizers" | "steel";

export type PriceTrend = "up" | "down" | "neutral";

export interface CommodityRecord {
  id: string;
  category: CategorySlug;
  name: string;
  currentPrice: number;
  changeValue: number;
  changePercent: number;
  date: string;
  currency: string;
  unit: string;
  imagePath: string | null;
  groupName?: string;
  marketScope?: string;
  details: Record<string, string | number | null>;
}

export interface SummaryMetrics {
  averagePrice: number;
  averageChangePercent: number;
  maxPrice: number;
  minPrice: number;
  trend: PriceTrend;
}

export interface CategoryMeta {
  slug: CategorySlug;
  title: string;
}

export interface TrendPoint {
  label: string;
  value: number;
}

export interface TableColumnMeta {
  key: string;
  label: string;
}
