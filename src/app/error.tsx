"use client";

import { ErrorState } from "@/components/feedback/error-state";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 p-6 dark:bg-zinc-950">
      <ErrorState
        title="خطأ في التطبيق"
        description="حدث خطأ غير متوقع أثناء عرض الصفحة."
        onRetry={reset}
      />
    </div>
  );
}
