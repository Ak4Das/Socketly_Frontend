import * as yup from "yup"

export const loginValidationSchema = yup
  .object()
  .shape({
    phoneNumber: yup
      .string()
      .nullable()
      .notRequired()
      .matches(/^\d+$/, "Phone number must be digits")
      // originalValue is the exact value that was originally provided by the user/application
      // value is the value after Yup has performed its initial casting, but before your current .transform() finishes.
      .transform((value, originalValue) =>
        originalValue.trim() === "" ? null : value,
      ),

    email: yup
      .string()
      .nullable()
      .notRequired()
      .email("Please enter a valid email")
      .transform((value, originalValue) =>
        originalValue.trim() === "" ? null : value,
      ),

    password: yup
      .string()
      .trim()
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d\s])\S+$/,
        "Password must contain at least one letter, one number, one special character, and no spaces",
      )
      .min(6, "Password must have at least 6 characters")
      .when("email", {
        is: (email) => !!email,
        then: (schema) => schema.required("Please enter your password"),
        otherwise: (schema) => schema.notRequired(),
      }),
  })
  .test(
    "at-least-one",
    "Either email or phone number is required",
    function (value) {
      return !!(value.phoneNumber || value.email)
    },
  )
