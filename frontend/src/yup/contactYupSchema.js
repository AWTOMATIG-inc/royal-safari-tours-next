import * as Yup from "yup";

export const contactYupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Full name must be at least 2 characters")
    .required("Full name is required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email address is required"),
  phone: Yup.string()
    .matches(
      /^\+\d{8,16}$/,
      "Please enter a valid phone number with country code"
    )
    .required("Phone number is required"),
  destination: Yup.string()
    .min(2, "Travel destination is required")
    .required("Travel destination is required"),
  date: Yup.string()
    .required("Travel date is required"),
  people: Yup.number()
    .typeError("Number of people must be a valid number")
    .min(1, "Must be at least 1 person")
    .max(99, "Maximum limit is 99 people")
    .required("Number of people is required"),
  message: Yup.string()
    .min(5, "Message must be at least 5 characters")
    .required("Message is required"),
});
