import {
  computeSummaryMetrics,
  getFertilizersDataDirect,
  getInternationalDataDirect,
  getSteelDataDirect,
} from "@/services/commodity-service";
import { CommodityRecord } from "@/types/domain";
import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import path from "path";
import puppeteer from "puppeteer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));

const formatNumber = (value: number) =>
  new Intl.NumberFormat("ar-EG", {
    maximumFractionDigits: 2,
  }).format(value);

const MARKET_SCOPE_AR: Record<string, string> = {
  retail: "تجزئة",
  wholesale: "جملة",
  port: "الميناء",
  field: "حقل",
  international: "دولي",
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const buildRows = (rows: CommodityRecord[], includeChangePercent: boolean) =>
  rows
    .map(
      (row) => `
        <tr>
          <td>${escapeHtml(row.name)}</td>
          <td>${escapeHtml(row.marketScope ? (MARKET_SCOPE_AR[row.marketScope] ?? row.marketScope) : "—")}</td>
          <td>${formatNumber(row.currentPrice)} ${escapeHtml(row.currency)}</td>
          ${includeChangePercent ? `<td>${formatNumber(row.changePercent)}%</td>` : ""}
          <td>${escapeHtml(row.unit)}</td>
          <td>${formatDate(row.date)}</td>
        </tr>
      `,
    )
    .join("");

const buildSection = (
  title: string,
  rows: CommodityRecord[],
  includeChangePercent: boolean = true,
) => {
  const metrics = computeSummaryMetrics(rows);
  return `
    <section class="section">
      <h2>${escapeHtml(title)}</h2>
      <div class="summary-grid">
        <div class="summary-item">
          <span>عدد السجلات</span>
          <strong>${formatNumber(rows.length)}</strong>
        </div>
        <div class="summary-item">
          <span>متوسط السعر</span>
          <strong>${formatNumber(metrics.averagePrice)}</strong>
        </div>
        <div class="summary-item">
          <span>أعلى سعر</span>
          <strong>${formatNumber(metrics.maxPrice)}</strong>
        </div>
        <div class="summary-item">
          <span>أدنى سعر</span>
          <strong>${formatNumber(metrics.minPrice)}</strong>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>الاسم</th>
            <th>النطاق</th>
            <th>السعر الحالي</th>
            ${includeChangePercent ? "<th>التغير %</th>" : ""}
            <th>الوحدة</th>
            <th>التاريخ</th>
          </tr>
        </thead>
        <tbody>
          ${buildRows(rows, includeChangePercent)}
        </tbody>
      </table>
    </section>
  `;
};

const buildCoverPage = (input: {
  logoDataUrl: string;
  exportDate: string;
  international: CommodityRecord[];
  fertilizers: CommodityRecord[];
  steel: CommodityRecord[];
}) => {
  const allRows = [...input.international, ...input.fertilizers, ...input.steel];
  const metrics = computeSummaryMetrics(allRows);

  return `
    <section class="cover-page">
      <header class="cover-header">
        <div class="cover-logo-wrap">
          <img src="${input.logoDataUrl}" alt="شعار الجهة" />
        </div>
        <div class="cover-authority">
          <div>جمهورية مصر العربية</div>
          <div>جهاز مستقبل مصر للتنمية المستدامة</div>
        </div>
      </header>
      <div class="cover-main">
        <div class="cover-title-block">
          <h1>تقرير الأسعار العالمية</h1>
          <p class="cover-subtitle">
            تقرير  يوضح مؤشرات أسعار السلع العالمية والأسمدة والحديد والأسمنت.
          </p>
        </div>
        <table class="cover-metadata-table">
          <tbody>
            <tr>
              <th>تاريخ الإصدار</th>
              <td>${escapeHtml(input.exportDate)}</td>
            </tr>
            <tr>
              <th>عدد السجلات</th>
              <td>${formatNumber(allRows.length)}</td>
            </tr>
            <tr>
              <th>متوسط السعر العام</th>
              <td>${formatNumber(metrics.averagePrice)}</td>
            </tr>
            <tr>
              <th>نطاق الأسعار</th>
              <td>${formatNumber(metrics.minPrice)} - ${formatNumber(metrics.maxPrice)}</td>
            </tr>
          </tbody>
        </table>
        <div class="cover-description">
          <p>
            أُعد هذا التقرير اعتمادًا على أحدث البيانات المعتمدة وقت الإصدار، ويهدف إلى دعم
            المتابعة الدورية لحركة الأسعار وتقديم مرجع موحد للمؤشرات الرئيسية.
          </p>
        </div>
        <div class="cover-sections">
          <div>السلع العالمية</div>
          <div>الأسمدة</div>
          <div>الحديد والأسمنت</div>
        </div>
      </div>
    </section>
  `;
};

const buildHtml = (input: {
  logoDataUrl: string;
  exportDate: string;
  international: CommodityRecord[];
  fertilizers: CommodityRecord[];
  steel: CommodityRecord[];
}) => `
  <!doctype html>
  <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8" />
      <style>
        body {
          margin: 0;
          font-family: Tahoma, Arial, sans-serif;
          color: #111827;
          background: #ffffff;
        }
        .cover-page {
          min-height: 980px;
          border: 1.5px solid #cbd5e1;
          padding: 24px;
          box-sizing: border-box;
          page-break-after: always;
          display: flex;
          flex-direction: column;
        }
        .cover-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2px solid #1e293b;
          padding-bottom: 12px;
          margin-bottom: 24px;
        }
        .cover-logo-wrap img {
          width: 200px;
          height: auto;
          object-fit: contain;
        }
        .cover-authority {
          text-align: center;
          font-size: 13px;
          line-height: 1.8;
          color: #1e293b;
          font-weight: 700;
        }
        .cover-title-block {
          text-align: center;
          margin-bottom: 16px;
        }
        .cover-main {
          flex: 1;
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .cover-title-block h1 {
          margin: 0;
          font-size: 34px;
          color: #0f172a;
          letter-spacing: 0.3px;
        }
        .cover-subtitle {
          margin: 10px 0 0;
          color: #334155;
          font-size: 14px;
          line-height: 1.8;
        }
        .cover-metadata-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 14px;
          font-size: 13px;
        }
        .cover-metadata-table th,
        .cover-metadata-table td {
          border: 1px solid #cbd5e1;
          padding: 10px 12px;
          text-align: right;
        }
        .cover-metadata-table th {
          width: 34%;
          background: #f8fafc;
          font-weight: 700;
        }
        .cover-description {
          border: 1px solid #e2e8f0;
          padding: 12px 14px;
          margin-bottom: 14px;
        }
        .cover-description p {
          margin: 0;
          color: #334155;
          font-size: 13px;
          line-height: 1.9;
          text-align: center;
        }
        .cover-sections {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
          margin-bottom: 14px;
        }
        .cover-sections div {
          border: 1px solid #dbe3ee;
          background: #f8fafc;
          padding: 8px 10px;
          text-align: center;
          font-size: 12px;
          font-weight: 700;
          color: #334155;
        }
        .cover-footer {
          border-top: 1px solid #cbd5e1;
          padding-top: 8px;
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #64748b;
          letter-spacing: 0.3px;
        }
        .container {
          padding: 24px;
        }
        .section {
          margin-bottom: 24px;
          page-break-inside: avoid;
        }
        .section h2 {
          margin: 0 0 12px;
          font-size: 18px;
          color: #1f2937;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 8px;
          margin-bottom: 10px;
        }
        .summary-item {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 8px 10px;
          background: #f9fafb;
        }
        .summary-item span {
          display: block;
          font-size: 11px;
          color: #6b7280;
          margin-bottom: 4px;
        }
        .summary-item strong {
          font-size: 14px;
          color: #111827;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        thead th {
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          padding: 8px;
          text-align: right;
          font-weight: 700;
        }
        tbody td {
          border: 1px solid #e5e7eb;
          padding: 7px 8px;
          text-align: right;
          vertical-align: top;
        }
        tbody tr:nth-child(even) {
          background: #fcfcfd;
        }
      </style>
    </head>
    <body>
      ${buildCoverPage(input)}
      <main class="container">
        ${buildSection("السلع العالمية", input.international, false)}
        ${buildSection("الأسمدة", input.fertilizers)}
        ${buildSection("الحديد والأسمنت", input.steel)}
      </main>
    </body>
  </html>
`;

export async function GET() {
  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;

  try {
    const [international, fertilizers, steel, logoBuffer] = await Promise.all([
      getInternationalDataDirect(),
      getFertilizersDataDirect(),
      getSteelDataDirect(),
      fs.readFile(path.join(process.cwd(), "public", "logo-ar.png")),
    ]);

    const logoDataUrl = `data:image/png;base64,${logoBuffer.toString("base64")}`;
    const exportDate = new Intl.DateTimeFormat("ar-EG", {
      dateStyle: "full",
      timeStyle: "short",
    }).format(new Date());

    const html = buildHtml({
      logoDataUrl,
      exportDate,
      international,
      fertilizers,
      steel,
    });

    browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "16mm",
        right: "10mm",
        bottom: "16mm",
        left: "10mm",
      },
    });

    await browser.close();

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="global-prices-report.pdf"',
      },
    });
  } catch {
    if (browser) {
      await browser.close();
    }

    return NextResponse.json(
      { message: "تعذر إنشاء ملف PDF حالياً." },
      { status: 500 },
    );
  }
}
