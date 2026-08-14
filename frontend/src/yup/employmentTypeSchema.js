import * as Yup from "yup";

export const employmentTypeSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Employment type name must be at least 2 characters")
    .max(100, "Employment type name must be at most 100 characters")
    .required("Employment type name is required"),
});
