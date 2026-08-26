import * as yup from "yup"

export const profileValidationSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  about: yup.string().notRequired(),
  agreed: yup.bool().oneOf([true], "You must agree to the terms"),
})
