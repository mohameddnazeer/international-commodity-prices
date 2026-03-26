import { CommodityRecord } from "@/types/domain";
import { toArabicLabel } from "@/utils/field-labels";
import { formatDate } from "@/utils/format";

const DETAIL_KEY_ALIAS: Record<string, string> = {
  indicatorName: "name",
  indictorName: "name",
  avgPrice: "currentPrice",
  insertionDate: "date",
  photo: "imagePath",
  changeRateDaialy: "changeValue",
  changeRatePercentDaialy: "changePercent",
  generalIndicator: "groupName",
};

const HIDDEN_DETAIL_KEYS = new Set([
  "name",
  "currentPrice",
  "changePercent",
  "date",
  "imagePath",
  "marketScope",
  "currency",
  "unit",
  "changeValue",
]);

const csvEscape = (value: string | number) => {
  const text = String(value).replaceAll('"', '""');
  return `"${text}"`;
};

export const exportCommoditiesCsv = (rows: CommodityRecord[], fileName: string) => {
  const detailKeys: string[] = [];
  const seenCanonicalKeys = new Set<string>();
  const seenLabels = new Set<string>();

  rows.forEach((row) => {
    Object.keys(row.details).forEach((key) => {
      const canonicalKey = DETAIL_KEY_ALIAS[key] ?? key;
      if (HIDDEN_DETAIL_KEYS.has(canonicalKey)) {
        return;
      }

      if (seenCanonicalKeys.has(canonicalKey)) {
        return;
      }

      const label = toArabicLabel(key);
      if (seenLabels.has(label)) {
        return;
      }

      detailKeys.push(key);
      seenCanonicalKeys.add(canonicalKey);
      seenLabels.add(label);
    });
  });

  const headers = [
    "الاسم",
    "السعر الحالي",
    "نسبة التغير",
    "التاريخ",
    "العملة",
    "الوحدة",
    "النطاق",
    ...detailKeys.map(toArabicLabel),
  ];
  const body = rows.map((row) =>
    [
      row.name,
      row.currentPrice,
      row.changePercent,
      formatDate(row.date),
      row.currency,
      row.unit,
      row.marketScope ?? "",
      ...detailKeys.map((key) => row.details[key] ?? ""),
    ]
      .map(csvEscape)
      .join(","),
  );

  const content = [headers.join(","), ...body].join("\n");
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
