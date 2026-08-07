"use client";

import Link from "next/link";

export default function Pagination({ page, limit, total, totalPages }) {
  return (
    <div className="flex justify-center items-center gap-2 mt-8 font-body">
      <Link
        disabled={Number(page) === 1}
        href={`/dashboard/bookings?page=${Number(page) - 1}`}
        className="disabled:cursor-not-allowed text-xs font-semibold px-4 py-2 bg-sand hover:bg-gray-200 text-primary rounded-xl border border-gray-200 disabled:opacity-50 transition-colors"
      >
        Prev
      </Link>

      {[...Array(totalPages)].map((_, index) => {
        const pageNumber = index + 1;

        return (
          <Link
            key={pageNumber}
            href={`/dashboard/bookings?page=${Number(pageNumber)}`}
            className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-colors ${
              page === pageNumber
                ? "bg-primary text-white border-primary shadow-xs"
                : "bg-sand text-primary border-gray-200 hover:bg-gray-200"
            }`}
          >
            {pageNumber}
          </Link>
        );
      })}

      <Link
        disabled={Number(page) === Number(totalPages)}
        href={`/dashboard/bookings?page=${Number(page) + 1}`}
        className="disabled:cursor-not-allowed text-xs font-semibold px-4 py-2 bg-sand hover:bg-gray-200 text-primary rounded-xl border border-gray-200 disabled:opacity-50 transition-colors"
      >
        Next
      </Link>
    </div>
  );
}

