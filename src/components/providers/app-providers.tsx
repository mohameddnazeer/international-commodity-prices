"use client";

import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

export const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <QueryProvider>{children}</QueryProvider>
  </ThemeProvider>
);
