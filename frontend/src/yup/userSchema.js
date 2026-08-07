
import * as Yup from "yup";

export const userSchema = Yup.object().shape({
  name: Yup.string()
    .min(1, "Fullname is required") // min(1) instead of min(0) to ensure non-empty
    .required("Fullname is required"),
  
  email: Yup.string()
    .email("Email is invalid")
    .required("Email is required"),
  
  password: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Password must be min 8 characters, and have 1 Special Character, 1 Uppercase, 1 Number and 1 Lowercase"
    ),
  
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});
