import * as Yup from "yup";
export const contactYupSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Name is required") // min(1) instead of min(0) to ensure non-empty
    .required("Name is required"),
  email: Yup.string().email("Email is invalid").required("Email is required"),
  phone: Yup.string()
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
  message: Yup.string()
    .min(10, "Message must be at least 10 characters")
    .required("Message is required"),
  destination: Yup.string()
    .min(2, "Travel destination is required")
    .required("Travel destination is required"),
  date: Yup.string()
    .required("Travel date is required"),
  people: Yup.string()
    .required("Number of people is required"),
});
