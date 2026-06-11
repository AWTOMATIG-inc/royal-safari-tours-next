import { getTestimonialById } from "@/actions/testimonial";
import TestimonialForm from "@/components/dashboard/testimonials/TestimonialForm";

export default async function EditTestimonialPage({ params }) {
  const { id } = await params;
  const result = await getTestimonialById(id);
  if (!result.success) {
    return (
      <p className="text-red-500 mt-8 text-center">{result.message}</p>
    );
  }
  return <TestimonialForm testimonial={result.data} />;
}
