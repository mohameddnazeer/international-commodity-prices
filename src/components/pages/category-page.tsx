"use client";

import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import { CommodityTable } from "@/components/tables/commodity-table";
import { useCategoryData } from "@/hooks/use-commodity-data";
import { useDebounce } from "@/hooks/use-debounce";
import { CategorySlug } from "@/types/domain";
import { CATEGORY_MAP } from "@/utils/category";
import { useState } from "react";

export const CategoryPage = ({ slug }: { slug: CategorySlug }) => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const { data = [], isLoading, isError, refetch } = useCategoryData(slug);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="grid min-h-screen md:grid-cols-[16rem_1fr]">
        <div>
          <Sidebar />
        </div>
        <div>
          <TopNavbar
            title={CATEGORY_MAP[slug].title}
            search={search}
            onSearchChange={setSearch}
          />
          <main className="px-4 py-5 md:px-6">
            {isLoading ? <LoadingState rows={8} /> : null}
            {isError ? (
              <ErrorState
                title={`تعذر تحميل ${CATEGORY_MAP[slug].title}`}
                description="فشل تحميل البيانات. حاول مرة أخرى."
                onRetry={() => {
                  void refetch();
                }}
              />
            ) : null}
            {!isLoading && !isError ? (
              <CommodityTable
                rows={data}
                search={debouncedSearch}
                title={CATEGORY_MAP[slug].title}
                showImageColumn={slug === "international"}
              />
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
};
