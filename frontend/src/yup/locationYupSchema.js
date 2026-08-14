import * as yup from "yup";
const FILE_SIZE = 1024 * 1024; // 1MB
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png","image/webp"];

export const locationYupSchema = (isEdit) =>
  yup
    .object({
      country: yup.string().min(0).required("Country is required"),
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
