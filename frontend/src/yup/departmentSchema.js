import * as Yup from "yup";

export const departmentSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Department name must be at least 2 characters")
    .max(100, "Department name must be at most 100 characters")
    .required("Department name is required"),
  description: Yup.string()
    .max(500, "Description must be at most 500 characters")
    .optional(),
});
