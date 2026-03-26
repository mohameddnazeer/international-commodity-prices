"use client";

import { CommodityRecord, TableColumnMeta } from "@/types/domain";
import { toArabicLabel } from "@/utils/field-labels";
import {
  formatCurrency,
  formatDate,
  formatNumber,
  formatUnknownValue,
} from "@/utils/format";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type SortKey = "name" | "currentPrice" | "changePercent" | "date";
type SortDirection = "asc" | "desc";

interface CommodityTableProps {
  rows: CommodityRecord[];
  search: string;
  title: string;
  showImageColumn?: boolean;
}

const PAGE_SIZE = 10;
const COLUMNS_STORAGE_PREFIX = "commodity-table:hidden-columns:";

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

const MARKET_SCOPE_AR: Record<string, string> = {
  retail: "تجزئة",
  wholesale: "جملة",
  port: "الميناء",
  field: "حقل",
  international: "دولي",
};

const getMarketScopeLabel = (value?: string) => {
  if (!value) return "—";
  return MARKET_SCOPE_AR[value] ?? value;
};

export const CommodityTable = ({
  rows,
  search,
  title,
  showImageColumn = true,
}: CommodityTableProps) => {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter((row) => {
      const searchable = `${row.name} ${row.groupName ?? ""}`.toLowerCase();
      return term ? searchable.includes(term) : true;
    });
  }, [rows, search]);

  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;

      if (sortKey === "name") return a.name.localeCompare(b.name) * direction;
      if (sortKey === "currentPrice") return (a.currentPrice - b.currentPrice) * direction;
      if (sortKey === "changePercent") return (a.changePercent - b.changePercent) * direction;
      return a.date.localeCompare(b.date) * direction;
    });
  }, [filteredRows, sortDirection, sortKey]);

  const detailColumns = useMemo<TableColumnMeta[]>(() => {
    const selectedKeys: string[] = [];
    const seenCanonicalKeys = new Set<string>();
    const seenLabels = new Set<string>();

    sortedRows.forEach((row) => {
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

        selectedKeys.push(key);
        seenCanonicalKeys.add(canonicalKey);
        seenLabels.add(label);
      });
    });

    return selectedKeys.map((key) => ({
      key,
      label: toArabicLabel(key),
    }));
  }, [sortedRows]);

  const allColumns = useMemo(
    () => [
      ...(showImageColumn
        ? ([{ key: "image", label: "الصورة" }] satisfies TableColumnMeta[])
        : []),
      { key: "name", label: "الاسم" },
      { key: "marketScope", label: "النطاق" },
      { key: "currentPrice", label: "السعر الحالي" },
      { key: "changePercent", label: "التغير" },
      { key: "date", label: "التاريخ" },
      ...detailColumns.map((column) => ({
        key: `detail:${column.key}`,
        label: column.label,
      })),
    ],
    [detailColumns, showImageColumn],
  );

  const [hiddenColumnKeys, setHiddenColumnKeys] = useState<string[]>([]);
  const storageKey = useMemo(
    () => `${COLUMNS_STORAGE_PREFIX}${title}:${showImageColumn ? "image" : "no-image"}`,
    [showImageColumn, title],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const saved = window.localStorage.getItem(storageKey);
      if (!saved) {
        setHiddenColumnKeys([]);
        return;
      }

      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        setHiddenColumnKeys(parsed.filter((item): item is string => typeof item === "string"));
        return;
      }

      setHiddenColumnKeys([]);
    } catch {
      setHiddenColumnKeys([]);
    }
  }, [storageKey]);

  useEffect(() => {
    setHiddenColumnKeys((current) =>
      current.filter((key) => allColumns.some((column) => column.key === key)),
    );
  }, [allColumns]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(hiddenColumnKeys));
  }, [hiddenColumnKeys, storageKey]);

  const hiddenSet = useMemo(() => new Set(hiddenColumnKeys), [hiddenColumnKeys]);
  const isVisible = (key: string) => !hiddenSet.has(key);

  useEffect(() => {
    setPage(1);
  }, [search, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedRows = sortedRows.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDirection("desc");
  };

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-right text-lg font-semibold">{title}</h2>
        <details className="rounded-lg border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950">
          <summary className="cursor-pointer text-sm font-medium">
            إظهار/إخفاء الأعمدة
          </summary>
          <div className="mt-2 grid gap-2 text-sm">
            {allColumns.map((column) => (
              <label key={column.key} className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isVisible(column.key)}
                  onChange={() =>
                    setHiddenColumnKeys((current) =>
                      current.includes(column.key)
                        ? current.filter((key) => key !== column.key)
                        : [...current, column.key],
                    )
                  }
                />
                <span>{column.label}</span>
              </label>
            ))}
          </div>
        </details>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
          <thead>
            <tr className="text-right text-zinc-500 dark:text-zinc-400">
              {showImageColumn && isVisible("image") ? (
                <th className="px-3 py-3">الصورة</th>
              ) : null}
              {isVisible("name") ? (
                <th className="px-3 py-3">
                  <button
                    type="button"
                    onClick={() => toggleSort("name")}
                    className="inline-flex items-center gap-1"
                  >
                    الاسم
                    <ArrowUpDown size={14} />
                  </button>
                </th>
              ) : null}
              {isVisible("marketScope") ? <th className="px-3 py-3">النطاق</th> : null}
              {isVisible("currentPrice") ? (
                <th className="px-3 py-3">
                  <button
                    type="button"
                    onClick={() => toggleSort("currentPrice")}
                    className="inline-flex items-center gap-1"
                  >
                    السعر الحالي
                    <ArrowUpDown size={14} />
                  </button>
                </th>
              ) : null}
              {isVisible("changePercent") ? (
                <th className="px-3 py-3">
                  <button
                    type="button"
                    onClick={() => toggleSort("changePercent")}
                    className="inline-flex items-center gap-1"
                  >
                    التغير
                    <ArrowUpDown size={14} />
                  </button>
                </th>
              ) : null}
              {isVisible("date") ? (
                <th className="px-3 py-3">
                  <button
                    type="button"
                    onClick={() => toggleSort("date")}
                    className="inline-flex items-center gap-1"
                  >
                    التاريخ
                    <ArrowUpDown size={14} />
                  </button>
                </th>
              ) : null}
              {detailColumns.map((column) => (
                isVisible(`detail:${column.key}`) ? (
                  <th key={column.key} className="px-3 py-3">
                    {column.label}
                  </th>
                ) : null
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {pagedRows.map((row) => (
              <tr
                key={row.id}
                className="transition hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
              >
                {showImageColumn && isVisible("image") ? (
                  <td className="px-3 py-3">
                    {row.imagePath ? (
                      <Image
                        src={row.imagePath}
                        alt={row.name}
                        width={42}
                        height={42}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
                    )}
                  </td>
                ) : null}
                {isVisible("name") ? (
                  <td className="px-3 py-3 font-medium">{row.name}</td>
                ) : null}
                {isVisible("marketScope") ? (
                  <td className="px-3 py-3">{getMarketScopeLabel(row.marketScope)}</td>
                ) : null}
                {isVisible("currentPrice") ? (
                  <td className="px-3 py-3">
                    {formatCurrency(row.currentPrice, row.currency)} / {row.unit}
                  </td>
                ) : null}
                {isVisible("changePercent") ? (
                  <td
                    className={`px-3 py-3 ${
                      row.changePercent > 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : row.changePercent < 0
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-zinc-500"
                    }`}
                  >
                    {formatNumber(row.changePercent)}%
                  </td>
                ) : null}
                {isVisible("date") ? (
                  <td className="px-3 py-3">{formatDate(row.date)}</td>
                ) : null}
                {detailColumns.map((column) => (
                  isVisible(`detail:${column.key}`) ? (
                    <td key={`${row.id}-${column.key}`} className="px-3 py-3">
                      {formatUnknownValue(row.details[column.key] ?? null)}
                    </td>
                  ) : null
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!pagedRows.length ? (
        <p className="px-3 py-6 text-sm text-zinc-500">لا توجد نتائج مطابقة.</p>
      ) : null}

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setPage((value) => Math.max(1, value - 1))}
          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm dark:border-zinc-700"
        >
          السابق
        </button>
        <span className="text-sm text-zinc-500">
          الصفحة {currentPage} من {totalPages}
        </span>
        <button
          type="button"
          onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm dark:border-zinc-700"
        >
          التالي
        </button>
      </div>
    </section>
  );
};
