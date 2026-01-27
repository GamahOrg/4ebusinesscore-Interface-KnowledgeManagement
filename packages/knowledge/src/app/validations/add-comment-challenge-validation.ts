import { object, string } from "yup";

export const addCommentChallengeValidations = object().shape({
  description: string()
    .required("ThisFelidIsRequired")
    .test(
      "not-empty",
      "ThisFelidIsRequired",
      (value) => !!value && value.trim().length > 0
    ),
});
