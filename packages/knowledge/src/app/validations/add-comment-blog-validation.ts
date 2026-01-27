import { string, object } from "yup";

export const addCommentValidations = object().shape({
  Body: string().required("ThisFelidIsRequired"),
});
