import * as yup from "yup"

export const otpValidationSchema = yup.object().shape({
  otp: yup
    .array()
    .of(yup.string().trim())
    .length(6, "OTP must be exactly 6 digits")
    .test("all-box-filled", "All 6 digits are required", (otp) => {
      return otp.every((digit) => digit !== undefined)
    })
    .required("OTP is required"),
})
