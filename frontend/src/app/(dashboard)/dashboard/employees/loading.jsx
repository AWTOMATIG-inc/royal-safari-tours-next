import {
  TableSkeleton,
  FilterSkeleton,
  PaginationSkeleton,
  StatsSkeleton,
} from "@/components/Skeleton";

export default function EmployeesLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-32 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded" />
          <div className="h-4 w-72 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded" />
        </div>
        <div className="h-10 w-36 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-xl" />
      </div>

      <StatsSkeleton />
      <FilterSkeleton />
      <TableSkeleton rows={5} columns={8} />
      <PaginationSkeleton />
    </div>
  );
}
