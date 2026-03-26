import { LoadingState } from "@/components/feedback/loading-state";

export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-6 dark:bg-zinc-950">
      <LoadingState />
    </div>
  );
}
