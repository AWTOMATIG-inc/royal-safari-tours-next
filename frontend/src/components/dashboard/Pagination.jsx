"use client";

import Link from "next/link";

export default function Pagination({ page = 1, totalPages = 1, baseUrl = "/dashboard/tour-packages" }) {
  if (totalPages <= 1) return null;

  const isPrev = Number(page) <= 1;
  const isNext = Number(page) >= Number(totalPages);

  return (
    <div className="flex justify-center items-center gap-2 pt-6 font-inter">
      <Link
        href={isPrev ? `${baseUrl}?page=1` : `${baseUrl}?page=${Number(page) - 1}`}
        className={`px-4 py-2 border rounded-xl text-xs font-semibold transition-all ${
          isPrev
            ? "cursor-not-allowed opacity-40 border-gray-200 text-gray-400 bg-white"
            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-xs"
        }`}
      >
        Previous
      </Link>

      {Array.from({ length: totalPages }, (_, index) => {
        const pageNumber = index + 1;
        const isActive = Number(page) === pageNumber;

        return (
          <Link
            key={pageNumber}
            href={`${baseUrl}?page=${pageNumber}`}
            className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
              isActive
                ? "bg-[#0D231E] text-white shadow-xs"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {pageNumber}
          </Link>
        );
      })}

      <Link
        href={isNext ? `${baseUrl}?page=${totalPages}` : `${baseUrl}?page=${Number(page) + 1}`}
        className={`px-4 py-2 border rounded-xl text-xs font-semibold transition-all ${
          isNext
            ? "cursor-not-allowed opacity-40 border-gray-200 text-gray-400 bg-white"
            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-xs"
        }`}
      >
        Next
      </Link>
    </div>
  );
}
