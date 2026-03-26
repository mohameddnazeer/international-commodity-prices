import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-6 dark:bg-zinc-950">
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-2xl font-semibold">الصفحة غير موجودة</h1>
        <p className="mt-2 text-zinc-500">التصنيف المطلوب غير متاح حالياً.</p>
        <Link
          href="/"
          className="mt-5 inline-flex rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-600"
        >
          الرجوع إلى لوحة المعلومات
        </Link>
      </div>
    </div>
  );
}
