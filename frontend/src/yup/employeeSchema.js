import * as Yup from "yup";

export const employeeSchema = (_isEdit) =>
  Yup.object().shape({
    name: Yup.string()
      .trim()
      .min(2, "Employee name must be at least 2 characters")
      .max(100, "Employee name must be at most 100 characters")
      .required("Employee name is required"),
    email: Yup.string()
      .trim()
      .email("Invalid email format")
      .max(255, "Email must be at most 255 characters")
      .required("Email is required"),
    phone: Yup.string()
      .trim()
      .max(20, "Phone must be at most 20 characters")
      .optional()
      .nullable(),
    departmentId: Yup.string().required("Department is required"),
    designationId: Yup.string().required("Designation is required"),
    employmentTypeId: Yup.string().required("Employment type is required"),
    employmentStatusId: Yup.string().required("Employment status is required"),
    joiningDate: Yup.string().optional().nullable(),
    managerId: Yup.string().optional().nullable(),
    hrNotes: Yup.string()
      .trim()
      .max(1000, "HR Notes must be at most 1000 characters")
      .optional()
      .nullable(),
    password: Yup.string()
      .transform((value) => (value === "" ? undefined : value))
      .optional()
      .nullable()
      .test("len", "Password must be at least 6 characters", (val) => {
        if (!val) return true;
        return val.length >= 6;
      }),
  });
