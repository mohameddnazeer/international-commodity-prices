"use client";

import { CATEGORIES } from "@/utils/category";
import { BarChart3 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col border-b border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950 md:h-full md:w-64 md:border-b-0 md:border-l md:border-r-0 md:py-6">
      <Link href="/" className="mb-4 inline-flex items-center gap-2 px-2 md:mb-8">
        <BarChart3 size={22} className="text-indigo-500" />
        <span className="text-base font-semibold">مؤشر السلع</span>
      </Link>
      <nav className="flex flex-wrap gap-2 md:flex-col">
        <Link
          href="/"
          className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
            pathname === "/"
              ? "bg-indigo-500 text-white"
              : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
          }`}
        >
          لوحة المعلومات
        </Link>
       
        {CATEGORIES.map((category) => {
          const href = `/category/${category.slug}`;
          const isActive = pathname === href;
          return (
            <Link
              key={category.slug}
              href={href}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-indigo-500 text-white"
                  : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
              }`}
            >
              {category.title}
            </Link>
          );
        })}
         <Link
          href="/report"
          className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
            pathname === "/report"
              ? "bg-indigo-500 text-white"
              : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
          }`}
        >
          تقرير PDF
        </Link>
      </nav>
    </aside>
  );
};
