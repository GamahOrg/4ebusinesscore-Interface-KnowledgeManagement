import * as yup from "yup";

export const addKnowledgeValidations = yup.object().shape({
  name: yup.string().required("ThisFelidIsRequired"),
  icon: yup.string().required("ThisFelidIsRequired"),
  // categoryId: yup.string().required('ThisFelidIsRequired'),
  colors: yup.string().required("ThisFelidIsRequired"),
});

export const addOwnKnowledgeValidations = yup.object().shape({
  name: yup.string().required("ThisFelidIsRequired"),
  icon: yup.string().required("ThisFelidIsRequired"),
  // categoryId: yup.string().required("ThisFelidIsRequired"),
  // employees: yup.array().of(yup.string()).nullable(),
  colors: yup.string().required("ThisFelidIsRequired"),
});
