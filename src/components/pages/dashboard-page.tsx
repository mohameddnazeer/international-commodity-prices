"use client";

import { PriceTrendChart } from "@/components/charts/price-trend-chart";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import { StatCard } from "@/components/ui/stat-card";
import { useAllCategoriesData } from "@/hooks/use-commodity-data";
import { useDebounce } from "@/hooks/use-debounce";
import { computeSummaryMetrics } from "@/services/commodity-service";
import { CATEGORY_MAP } from "@/utils/category";
import { buildTrendPoints } from "@/utils/chart";
import { formatNumber } from "@/utils/format";
import { useMemo, useState } from "react";

export const DashboardPage = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const { data, isError, isLoading, refetchAll } = useAllCategoriesData();

  const filteredData = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    if (!term) return data;
    return {
      international: data.international.filter((item) =>
        item.name.toLowerCase().includes(term),
      ),
      fertilizers: data.fertilizers.filter((item) =>
        item.name.toLowerCase().includes(term),
      ),
      steel: data.steel.filter((item) => item.name.toLowerCase().includes(term)),
    };
  }, [data, debouncedSearch]);

  const categorySummaries = useMemo(
    () => [
      {
        key: "international",
        title: CATEGORY_MAP.international.title,
        metrics: computeSummaryMetrics(filteredData.international),
      },
      {
        key: "fertilizers",
        title: CATEGORY_MAP.fertilizers.title,
        metrics: computeSummaryMetrics(filteredData.fertilizers),
      },
      {
        key: "steel",
        title: CATEGORY_MAP.steel.title,
        metrics: computeSummaryMetrics(filteredData.steel),
      },
    ],
    [filteredData],
  );

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="grid min-h-screen md:grid-cols-[16rem_1fr]">
        <div className="min-w-0">
          <Sidebar />
        </div>
        <div className="min-w-0 overflow-hidden">
          <TopNavbar
            title="لوحة متابعة أسعار السلع العالمية"
            search={search}
            onSearchChange={setSearch}
          />
          <main className="space-y-6 px-4 py-5 md:px-6 min-w-0">
            {isLoading ? <LoadingState /> : null}
            {isError ? (
              <ErrorState
                title="تعذر تحميل لوحة المعلومات"
                description="فشل الاتصال بواجهات البيانات. يرجى المحاولة مرة أخرى."
                onRetry={() => {
                  void refetchAll();
                }}
              />
            ) : null}
            {!isLoading && !isError ? (
              <>
                <section className="grid gap-3 md:grid-cols-3">
                  {categorySummaries.map((entry) => (
                    <StatCard
                      key={entry.key}
                      label={`متوسط سعر ${entry.title}`}
                      value={formatNumber(entry.metrics.averagePrice)}
                      change={`متوسط التغير ${formatNumber(
                        entry.metrics.averageChangePercent,
                      )}%`}
                      trend={entry.metrics.trend}
                    />
                  ))}
                </section>
                <section className="grid gap-4 xl:grid-cols-3">
                  <PriceTrendChart
                    data={buildTrendPoints(filteredData.international)}
                    title="اتجاه السلع العالمية"
                  />
                  <PriceTrendChart
                    data={buildTrendPoints(filteredData.fertilizers)}
                    title="اتجاه الأسمدة"
                  />
                  <PriceTrendChart
                    data={buildTrendPoints(filteredData.steel)}
                    title="اتجاه الحديد والأسمنت"
                  />
                </section>
              </>
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
};
