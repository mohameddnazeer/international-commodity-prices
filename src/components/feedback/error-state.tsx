interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const ErrorState = ({
  title = "حدث خطأ غير متوقع",
  description = "تعذر تحميل البيانات. يرجى إعادة المحاولة.",
  onRetry,
}: ErrorStateProps) => (
  <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 dark:border-rose-900 dark:bg-rose-950/30">
    <h3 className="text-lg font-semibold text-rose-700 dark:text-rose-300">{title}</h3>
    <p className="mt-2 text-sm text-rose-600 dark:text-rose-400">{description}</p>
    {onRetry ? (
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
      >
        إعادة المحاولة
      </button>
    ) : null}
  </div>
);
