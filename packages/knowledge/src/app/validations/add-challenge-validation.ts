import { validateHeaderValue } from "http";
import { string, object } from "yup";

export const addChallengeValidations = object().shape({
  projectName: string().required("ThisFelidIsRequired"),
  title: string().required("ThisFelidIsRequired"),
  description: string().required("ThisFelidIsRequired").min(1000, "SubjectMustBeAtLeast1000Characters"),
  challengeAttachments: string().required("ThisFelidIsRequired"),
});
export const editChallengeValidations = object().shape({
  projectName: string().required("ThisFelidIsRequired"),
  title: string().required("ThisFelidIsRequired"),
  description: string().required("ThisFelidIsRequired").min(1000, "SubjectMustBeAtLeast1000Characters"),
  challengeAttachments: string().optional(),
});


