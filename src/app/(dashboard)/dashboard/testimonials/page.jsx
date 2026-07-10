import { getTestimonialsByPagination } from "@/actions/testimonial";
import TestimonialsPage from "@/components/dashboard/testimonials/TestimonialsPage";

export default async function TestimonialsListPage({ searchParams }) {
  const { page } = await searchParams;
  const results = await getTestimonialsByPagination(page);
  if (!results.success) {
    return (
      <p className="text-red-500 mt-8 text-center">{results.message}</p>
    );
  }
  return (
    <div>
      <TestimonialsPage
        testimonials={results.data}
        pagination={results.pagination}
      />
    </div>
  );
}
