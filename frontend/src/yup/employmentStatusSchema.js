import * as Yup from "yup";

export const employmentStatusSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Employment status name must be at least 2 characters")
    .max(100, "Employment status name must be at most 100 characters")
    .required("Employment status name is required"),
});
