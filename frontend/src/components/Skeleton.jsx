export function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded ${className}`}
    />
  );
}

export function TableSkeleton({ rows = 5, columns = 8 }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50/80 border-b border-gray-100 px-6 py-4">
        <div className="flex gap-6">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-20" />
          ))}
        </div>
      </div>
      {/* Rows */}
      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4 flex items-center gap-6">
            {/* Photo */}
            <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
            {/* Name + Email */}
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-2.5 w-40" />
            </div>
            {/* Employee ID */}
            <Skeleton className="h-3 w-24" />
            {/* Department */}
            <Skeleton className="h-5 w-20 rounded-lg" />
            {/* Designation */}
            <Skeleton className="h-3 w-24" />
            {/* Status */}
            <Skeleton className="h-5 w-16 rounded-full" />
            {/* Joining Date */}
            <Skeleton className="h-3 w-20" />
            {/* Actions */}
            <div className="flex gap-1">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="w-8 h-8 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
        {/* Textarea */}
        <div className="mt-6 space-y-2">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <Skeleton className="h-10 w-24 rounded-xl" />
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] p-6">
        <div className="flex items-start gap-6">
          <Skeleton className="w-24 h-24 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-3 mt-2">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-28 rounded-full" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20 rounded-xl" />
            <Skeleton className="h-9 w-20 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] p-6 space-y-4">
            <Skeleton className="h-5 w-32" />
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="flex justify-between">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3.5 w-32" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-7 w-20 mb-1" />
          <Skeleton className="h-3 w-28" />
        </div>
      ))}
    </div>
  );
}

export function FilterSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] p-4">
      <div className="flex flex-col md:flex-row gap-3">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <Skeleton className="h-10 w-20 rounded-xl" />
      </div>
      <div className="flex gap-3 mt-3">
        <Skeleton className="h-8 w-32 rounded-xl" />
        <Skeleton className="h-8 w-32 rounded-xl" />
        <Skeleton className="h-8 w-32 rounded-xl" />
        <Skeleton className="h-8 w-28 rounded-xl" />
      </div>
    </div>
  );
}

export function PaginationSkeleton() {
  return (
    <div className="flex justify-center items-center gap-2 pt-4">
      <Skeleton className="h-9 w-20 rounded-xl" />
      <Skeleton className="h-9 w-9 rounded-xl" />
      <Skeleton className="h-9 w-9 rounded-xl" />
      <Skeleton className="h-9 w-9 rounded-xl" />
      <Skeleton className="h-9 w-20 rounded-xl" />
    </div>
  );
}
