import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 2 },
    country: { type: String, required: true },
    feedback: { type: String, required: true, maxlength: 350 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    backgroundImage: { type: String, required: true },
    avatarImage: { type: String, required: true },
  },
  { timestamps: true },
);

export const TestimonialModel =
  mongoose.models.Testimonial ||
  mongoose.model("Testimonial", testimonialSchema);
