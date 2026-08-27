import * as Yup from "yup";

export const contactYupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Full name must be at least 2 characters")
    .required("Full name is required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email address is required"),
  phone: Yup.string()
    .matches(/^\d{11}$/, "Phone number must be exactly 11 digits")
    .required("Phone number is required"),
  destination: Yup.string()
    .min(2, "Travel destination is required")
    .required("Travel destination is required"),
  date: Yup.string()
    .required("Travel date is required"),
  people: Yup.number()
    .typeError("Number of people must be a number")
    .min(1, "Must be at least 1 person")
    .required("Number of people is required"),
  message: Yup.string()
    .min(5, "Message must be at least 5 characters")
    .required("Message is required"),
});
