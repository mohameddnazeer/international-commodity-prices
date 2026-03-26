"use client";

import { SearchInput } from "@/components/ui/search-input";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface TopNavbarProps {
  title: string;
  search: string;
  onSearchChange: (value: string) => void;
}

export const TopNavbar = ({ title, search, onSearchChange }: TopNavbarProps) => (
  <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90 md:px-6">
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <h1 className="text-right text-xl font-semibold tracking-tight">{title}</h1>
      <div className="flex items-center gap-2">
        <div className="w-full md:w-80">
          <SearchInput value={search} onChange={onSearchChange} />
        </div>
        <ThemeToggle />
      </div>
    </div>
  </header>
);
