import * as yup from "yup";

const isRichTextEmpty = (value) => {
  const text = value
    ?.replace(/<[^>]*>/g, "")
    ?.replace(/&nbsp;/g, "")
    ?.trim();

  return !!text;
};

export const tourPackageYupSchema = (isEdit) =>
  yup.object({
    title: yup.string().required("Title is required"),
    location: yup.string().required("Location is required"),
    price: yup
      .number()
      .typeError("Price must be a number")
      .positive("Price must be positive")
      .required("Price is required"),
    discountPrice: yup
      .number()
      .typeError("Discount price must be a number")
      .nullable()
      .transform((value, originalValue) => (originalValue === "" ? null : value)),
    hotelRating: yup
      .number()
      .typeError("Hotel rating must be selected (1-5)")
      .min(1, "Minimum rating is 1 Star")
      .max(5, "Maximum rating is 5 Star")
      .required("Hotel rating is required"),
    duration: yup.string().required("Duration is required"),
    description: yup
      .string()
      .test("not-empty", "Description is required", isRichTextEmpty),
    additionalInfo: yup.string().optional(),
  });
