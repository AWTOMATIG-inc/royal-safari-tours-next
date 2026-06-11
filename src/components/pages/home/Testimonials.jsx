import { getTestimonials } from "@/actions/testimonial";
import CommonHeading from "@/components/CommonHeading";
import Rating from "@/components/Rating";
import TestimonialsSlider from "@/components/pages/home/TestimonialsSlider";

export default async function Testimonials() {
  const result = await getTestimonials();
  const items = result.success ? result.data : [];

  if (items.length === 0) return null;

  return (
    <div className="bg-body2">
      <div className="container py-10">
        <CommonHeading title="Testimonials" subtitle="Hear From our clients" />
        <TestimonialsSlider items={items} />
      </div>
    </div>
  );
}
