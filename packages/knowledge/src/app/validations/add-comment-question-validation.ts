import { string, object } from "yup";

export const addCommentQuestionValidations = object().shape({
  body: string().required("ThisFelidIsRequired"),
});
