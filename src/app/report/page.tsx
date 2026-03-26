"use client";

import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import { CommodityTable } from "@/components/tables/commodity-table";
import { StatCard } from "@/components/ui/stat-card";
import { useAllCategoriesData } from "@/hooks/use-commodity-data";
import { computeSummaryMetrics } from "@/services/commodity-service";
import { CATEGORY_MAP } from "@/utils/category";
import { formatNumber } from "@/utils/format";
import { useMemo, useState } from "react";

export default function ReportPage() {
  const { data, isLoading, isError, refetchAll } = useAllCategoriesData();
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const categorySummaries = useMemo(
    () => [
      {
        key: "international",
        title: CATEGORY_MAP.international.title,
        metrics: computeSummaryMetrics(data.international),
      },
      {
        key: "fertilizers",
        title: CATEGORY_MAP.fertilizers.title,
        metrics: computeSummaryMetrics(data.fertilizers),
      },
      {
        key: "steel",
        title: CATEGORY_MAP.steel.title,
        metrics: computeSummaryMetrics(data.steel),
      },
    ],
    [data],
  );

  const handleExportPdf = async () => {
    try {
      setIsExporting(true);
      setExportError(null);

      const response = await fetch("/api/export-pdf");
      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "global-prices-report.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      setExportError("تعذر تحميل ملف PDF. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="grid min-h-screen md:grid-cols-[16rem_1fr]">
        <div className="">
          <Sidebar />
        </div>
        <div className="min-w-0 overflow-hidden">
          <TopNavbar title="تقرير الأسعار" search="" onSearchChange={() => {}} />
          <main className="space-y-6 px-4 py-5 md:px-6 min-w-0">
            <section className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold">تقرير شامل لكل الفئات</h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  السلع العالمية + الأسمدة + الحديد والأسمنت
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  void handleExportPdf();
                }}
                disabled={isExporting}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isExporting ? "جاري تجهيز PDF..." : "تحميل PDF"}
              </button>
            </section>

            {exportError ? (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
                {exportError}
              </p>
            ) : null}

            {isLoading ? <LoadingState /> : null}
            {isError ? (
              <ErrorState
                title="تعذر تحميل بيانات التقرير"
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

                <CommodityTable
                  rows={data.international}
                  search=""
                  title={CATEGORY_MAP.international.title}
                  showImageColumn
                  includeChangePercent={false}
                />
                <CommodityTable
                  rows={data.fertilizers}
                  search=""
                  title={CATEGORY_MAP.fertilizers.title}
                  showImageColumn={false}
                />
                <CommodityTable
                  rows={data.steel}
                  search=""
                  title={CATEGORY_MAP.steel.title}
                  showImageColumn={false}
                />
              </>
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
}
