import * as yup from "yup"

export const signupValidationSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name is required")
    .matches(
      /^[A-Z][a-z]*(?: [A-Z][a-z]*)*$/,
      "Each word must start with a capital letter and contain only letters and only one space allowed btw words no space is allowed in the beginning and end of name",
    ),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Please enter your email")
    .test(
      "is-lowercase",
      "Email must be in lowercase",
      (value) => value === value?.toLowerCase(),
    ),
  password: yup
    .string()
    .trim()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d\s])\S+$/,
      "Password must contain at least one letter, one number, one special character, and no spaces",
    )
    .required("Please enter your password")
    .min(6, "Password must have at least 6 characters"),
  confirmPassword: yup
    .string()
    .trim()
    .when("password", {
      is: (password) => !!password,
      then: (schema) =>
        schema
          .required("Confirm password is required")
          .oneOf([yup.ref("password")], "Password must be same"),
    }),
})