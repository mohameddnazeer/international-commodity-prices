import { Skeleton } from "@/components/ui/skeleton";

export const LoadingState = ({ rows = 6 }: { rows?: number }) => (
  <div className="space-y-3">
    <Skeleton className="h-10 w-56" />
    <div className="grid gap-3 md:grid-cols-3">
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-28 w-full" />
    </div>
    <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-full" />
        ))}
      </div>
    </div>
  </div>
);
