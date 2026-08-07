import * as yup from "yup";
const FILE_SIZE = 1024 * 1024; // 1MB
const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/webp",
];
const isRichTextEmpty = (value) => {
  const text = value
    ?.replace(/<[^>]*>/g, "")
    ?.replace(/&nbsp;/g, "")
    ?.trim();

  return !!text;
};
export const tourPackageYupSchema = (isEdit) =>
  yup
    .object({
      title: yup.string().min(0).required("Title is required"),
      location: yup.string().required("Country is required"),
      price: yup.string().min(0).required("Price is required"),
      rating: yup.string().min(0).required("Rating is required"),
      duration: yup.string().min(0).required("Duration is required"),
      shortDescription: yup
        .string()
        .min(0)
        .max(800)
        .required("Short description is required"),
      description: yup
        .string()
        .test("not-empty", "Description is required", isRichTextEmpty),
      additionalInfo: yup
        .string()
        .test("not-empty", "Additional info is required", isRichTextEmpty),
      image: isEdit
        ? yup
            .mixed()
            .test("fileType", "Unsupported File Format", (value) => {
              if (!value || !value[0]) return true;

              return SUPPORTED_FORMATS.includes(value[0].type);
            })
            .test("fileSize", "File too large", (value) => {
              if (!value || !value[0]) return true;

              return value[0].size <= FILE_SIZE;
            })
        : yup
            .mixed()
            .required("Image is required")
            .test("fileType", "Unsupported File Format", (value) => {
              return (
                value && value[0] && SUPPORTED_FORMATS.includes(value[0].type)
              );
            })
            .test("fileSize", "File too large", (value) => {
              return value && value[0] && value[0].size <= FILE_SIZE;
            }),
    })
    .required();
