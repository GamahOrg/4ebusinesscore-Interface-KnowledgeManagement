import { string, object } from "yup";

export const addBlogValidations = object().shape({
  title: string().required("ThisFelidIsRequired"),
  description: string()
    .required("ThisFelidIsRequired")
    .max(1000, "MustNotExceed1000Characters"),
  blogAttachments: string().required("ThisFelidIsRequired"),
});

export const editBlogValidations = object().shape({
  title: string().required("ThisFelidIsRequired"),
  description: string()
    .required("ThisFelidIsRequired")
    .max(1000, "MustNotExceed1000Characters"),
  blogAttachments: string().optional(),
});
