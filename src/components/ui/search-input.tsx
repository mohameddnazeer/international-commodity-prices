"use client";

import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchInput = ({
  value,
  onChange,
  placeholder = "ابحث عن سلعة...",
}: SearchInputProps) => (
  <label className="flex h-10 w-full items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-900">
    <Search size={16} className="text-zinc-500" />
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full bg-transparent text-right text-sm outline-none placeholder:text-zinc-400"
    />
  </label>
);
