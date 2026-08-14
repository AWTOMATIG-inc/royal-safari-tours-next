import { Skeleton } from "@/components/Skeleton";

export default function DesignationsLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-44 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded" />
          <div className="h-4 w-72 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded" />
        </div>
        <div className="h-10 w-40 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-xl" />
      </div>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] overflow-hidden">
        <div className="bg-gray-50/80 border-b border-gray-100 px-6 py-4">
          <div className="flex gap-6">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-6">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3.5 w-40" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <div className="flex-1" />
              <div className="flex gap-1">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="w-8 h-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
