import * as yup from "yup";

export const testimonialYupSchema = (_isEdit) =>
  yup
    .object({
      name: yup
        .string()
        .min(2, "Name must be at least 2 characters")
        .required("Name is required"),
      country: yup
        .string()
        .min(2, "Country must be at least 2 characters")
        .required("Country is required"),
      feedback: yup
        .string()
        .required("Review is required")
        .max(350, "Review must not exceed 350 characters"),
      rating: yup
        .number()
        .typeError("Rating is required")
        .required("Rating is required")
        .min(1, "Rating must be at least 1")
        .max(5, "Rating must not exceed 5"),
      backgroundImage: yup.mixed().nullable(),
      avatarImage: yup.mixed().nullable(),
    })
    .required();

