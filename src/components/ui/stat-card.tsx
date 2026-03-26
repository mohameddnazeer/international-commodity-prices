import { PriceTrend } from "@/types/domain";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  trend: PriceTrend;
}

const trendStyleMap: Record<PriceTrend, string> = {
  up: "text-emerald-600 dark:text-emerald-400",
  down: "text-rose-600 dark:text-rose-400",
  neutral: "text-zinc-500 dark:text-zinc-400",
};

const TrendIcon = ({ trend }: { trend: PriceTrend }) => {
  if (trend === "up") return <ArrowUpRight size={16} />;
  if (trend === "down") return <ArrowDownRight size={16} />;
  return <ArrowRight size={16} />;
};

export const StatCard = ({ label, value, change, trend }: StatCardProps) => (
  <article className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
    <p className="text-right text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
    <p className="mt-2 text-right text-2xl font-semibold">{value}</p>
    <p
      className={`mt-3 inline-flex items-center gap-1 text-sm ${trendStyleMap[trend]}`}
    >
      <TrendIcon trend={trend} />
      {change}
    </p>
  </article>
);
