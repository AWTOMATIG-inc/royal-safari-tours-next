import * as yup from "yup";

export const locationYupSchema = () =>
  yup
    .object({
      country: yup.string().required("Country is required"),
    })
    .required();
