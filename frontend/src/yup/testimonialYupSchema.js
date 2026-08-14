import * as yup from "yup";

const FILE_SIZE = 1024 * 1024 * 2; // 2MB
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png", "image/webp"];

const imageField = (required, label) =>
  required
    ? yup
        .mixed()
        .required(`${label} is required`)
        .test("fileType", "Unsupported format — use JPG, PNG or WebP", (value) =>
          value && value[0] ? SUPPORTED_FORMATS.includes(value[0].type) : false,
        )
        .test("fileSize", "File too large (max 2MB)", (value) =>
          value && value[0] ? value[0].size <= FILE_SIZE : false,
        )
    : yup
        .mixed()
        .test("fileType", "Unsupported format — use JPG, PNG or WebP", (value) => {
          if (!value || !value[0]) return true;
          return SUPPORTED_FORMATS.includes(value[0].type);
        })
        .test("fileSize", "File too large (max 2MB)", (value) => {
          if (!value || !value[0]) return true;
          return value[0].size <= FILE_SIZE;
        });

export const testimonialYupSchema = (isEdit) =>
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
      backgroundImage: imageField(!isEdit, "Background image"),
      avatarImage: imageField(!isEdit, "Avatar image"),
    })
    .required();
