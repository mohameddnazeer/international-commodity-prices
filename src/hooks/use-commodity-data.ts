"use client";

import { useMemo } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  getFertilizersData,
  getInternationalData,
  getSteelData,
} from "@/services/commodity-service";
import { CategorySlug, CommodityRecord } from "@/types/domain";

export const commodityQueryKeys = {
  international: ["international-data"] as const,
  fertilizers: ["fertilizers-data"] as const,
  steel: ["steel-data"] as const,
  all: ["all-categories-data"] as const,
};

export const useInternationalData = () =>
  useQuery({
    queryKey: commodityQueryKeys.international,
    queryFn: getInternationalData,
    staleTime: 1000 * 60 * 5,
  });

export const useFertilizersData = () =>
  useQuery({
    queryKey: commodityQueryKeys.fertilizers,
    queryFn: getFertilizersData,
    staleTime: 1000 * 60 * 5,
  });

export const useSteelData = () =>
  useQuery({
    queryKey: commodityQueryKeys.steel,
    queryFn: getSteelData,
    staleTime: 1000 * 60 * 5,
  });

export const useCategoryData = (slug: CategorySlug) => {
  if (slug === "international") return useInternationalData();
  if (slug === "fertilizers") return useFertilizersData();
  return useSteelData();
};

export const useAllCategoriesData = () => {
  const queries = useQueries({
    queries: [
      {
        queryKey: commodityQueryKeys.international,
        queryFn: getInternationalData,
        staleTime: 1000 * 60 * 5,
      },
      {
        queryKey: commodityQueryKeys.fertilizers,
        queryFn: getFertilizersData,
        staleTime: 1000 * 60 * 5,
      },
      {
        queryKey: commodityQueryKeys.steel,
        queryFn: getSteelData,
        staleTime: 1000 * 60 * 5,
      },
    ],
  });

  const isLoading = queries.some((query) => query.isLoading);
  const isError = queries.some((query) => query.isError);
  const error = queries.find((query) => query.error)?.error;

  const data = useMemo(
    () =>
      queries.reduce<Record<CategorySlug, CommodityRecord[]>>(
        (result, query, index) => {
          if (index === 0) result.international = query.data ?? [];
          if (index === 1) result.fertilizers = query.data ?? [];
          if (index === 2) result.steel = query.data ?? [];
          return result;
        },
        { international: [], fertilizers: [], steel: [] },
      ),
    [queries],
  );

  return {
    data,
    isLoading,
    isError,
    error,
    refetchAll: () => Promise.all(queries.map((query) => query.refetch())),
  };
};
