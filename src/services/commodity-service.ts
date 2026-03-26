import {
  GeneralIndicatorItemApi,
  GeneralIndicatorResponseApi,
  InternationalGroupApi,
  InternationalIndicatorItemApi,
} from "@/types/api";
import { CategorySlug, CommodityRecord } from "@/types/domain";
import { getTrendByPercent, toIsoDate } from "@/utils/format";
import { externalApi, internalApi } from "./axios";

const IMAGE_BASE_URL = "http://admin.prices.idsc.gov.eg/Upload/MainIndicator/Image";

const resolveImagePath = (mainIndicatorId?: number, fileName?: string) => {
  if (!mainIndicatorId || !fileName) return null;
  const normalizedFileName = fileName.trim();
  if (!normalizedFileName) return null;
  return `${IMAGE_BASE_URL}/${encodeURIComponent(String(mainIndicatorId))}/${encodeURIComponent(
    normalizedFileName,
  )}`;
};

const toCommodityId = (prefix: string, value: string | number) => `${prefix}-${value}`;

const isDetailValue = (value: unknown): value is string | number | null =>
  value === null || typeof value === "string" || typeof value === "number";

const extractDetails = (
  source: object,
  excludedKeys: string[],
) =>
  Object.entries(source).reduce<Record<string, string | number | null>>(
    (result, [key, value]) => {
      if (!excludedKeys.includes(key) && isDetailValue(value)) {
        result[key] = value;
      }
      return result;
    },
    {},
  );

const getMarketGroups = (source: GeneralIndicatorResponseApi) =>
  Object.entries(source).filter((entry): entry is [string, GeneralIndicatorItemApi[]] =>
    Array.isArray(entry[1]),
  );

const mapGeneralRows = (
  category: CategorySlug,
  source: GeneralIndicatorResponseApi,
): CommodityRecord[] => {
  return getMarketGroups(source).flatMap(([groupKey, rows]) =>
    rows.map((item, index) => {
      const details = extractDetails(item, [
        "indictorName",
        "avgPrice",
        "changeRateDaialy",
        "changeRatePercentDaialy",
        "insertionDate",
      ]);

      return {
        id: toCommodityId(category, `${item.indicatorId}-${groupKey}-${index}`),
        category,
        name: item.indictorName,
        currentPrice: item.avgPrice,
        changeValue: item.changeRateDaialy,
        changePercent: item.changeRatePercentDaialy,
        date: toIsoDate(item.insertionDate),
        currency: item.currency,
        unit: item.unit,
        imagePath: null,
        groupName: item.indictorName,
        marketScope: groupKey,
        details: {
          ...details,
          marketScope: groupKey,
        },
      };
    }),
  );
};

const mapInternationalRows = (source: InternationalGroupApi[]): CommodityRecord[] =>
  source.flatMap((group) =>
    group.internationalIndicatorsData.map((item: InternationalIndicatorItemApi) => {
      const details = extractDetails(item, [
        "indicatorName",
        "avgPrice",
        "insertionDate",
      ]);

      return {
        id: toCommodityId("international", item.mainIndicatorId),
        category: "international",
        name: item.indicatorName.trim(),
        currentPrice: item.avgPrice,
        changeValue: 0,
        changePercent: 0,
        date: toIsoDate(item.insertionDate),
        currency: item.currency,
        unit: item.unit,
        imagePath: resolveImagePath(item.mainIndicatorId, item.photo),
        groupName: group.generalIndicator,
        marketScope: "international",
        details: {
          ...details,
          generalIndicatorId: group.generalIndicatorId,
          generalIndicator: group.generalIndicator,
          groupName: group.generalIndicator,
        },
      };
    }),
  );

export const getInternationalData = async () => {
  const { data } = await internalApi.get<InternationalGroupApi[]>("/international");
  return mapInternationalRows(data);
};

export const getInternationalDataDirect = async () => {
  const { data } = await externalApi.get<InternationalGroupApi[]>(
    "/GetInnerInternationalData",
  );
  return mapInternationalRows(data);
};

export const getFertilizersData = async () => {
  const { data } =
    await internalApi.get<GeneralIndicatorResponseApi>("/fertilizers");
  return mapGeneralRows("fertilizers", data);
};

export const getFertilizersDataDirect = async () => {
  const { data } = await externalApi.get<GeneralIndicatorResponseApi>(
    "/GetGeneralIndicatorAllData/19",
  );
  return mapGeneralRows("fertilizers", data);
};

export const getSteelData = async () => {
  const { data } = await internalApi.get<GeneralIndicatorResponseApi>("/steel");
  return mapGeneralRows("steel", data);
};

export const getSteelDataDirect = async () => {
  const { data } = await externalApi.get<GeneralIndicatorResponseApi>(
    "/GetGeneralIndicatorAllData/18",
  );
  return mapGeneralRows("steel", data);
};

export const computeSummaryMetrics = (rows: CommodityRecord[]) => {
  if (!rows.length) {
    return {
      averagePrice: 0,
      averageChangePercent: 0,
      maxPrice: 0,
      minPrice: 0,
      trend: "neutral",
    } as const;
  }

  const totalPrice = rows.reduce((sum, row) => sum + row.currentPrice, 0);
  const totalChangePercent = rows.reduce((sum, row) => sum + row.changePercent, 0);
  const maxPrice = Math.max(...rows.map((row) => row.currentPrice));
  const minPrice = Math.min(...rows.map((row) => row.currentPrice));
  const averageChangePercent = totalChangePercent / rows.length;

  return {
    averagePrice: totalPrice / rows.length,
    averageChangePercent,
    maxPrice,
    minPrice,
    trend: getTrendByPercent(averageChangePercent),
  };
};
