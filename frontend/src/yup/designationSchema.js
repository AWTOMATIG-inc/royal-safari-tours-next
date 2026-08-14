import * as Yup from "yup";

export const designationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Designation name must be at least 2 characters")
    .max(100, "Designation name must be at most 100 characters")
    .required("Designation name is required"),
  description: Yup.string()
    .max(500, "Description must be at most 500 characters")
    .optional(),
});
