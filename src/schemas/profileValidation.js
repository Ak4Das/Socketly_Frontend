import * as yup from "yup"

export const profileValidationSchema = yup.object().shape({
  username: yup.string().notRequired(),
  about: yup.string().notRequired(),
  agreed: yup.bool().oneOf([true], "You must agree to the terms"),
})
