import { object, string, InferType, number, boolean } from "yup";

export const EditExpertExperiencesSchema = object({
  experienceName: string().required("InputFieldIsRequried"),
  specializationId: string().required("InputFieldIsRequried"),
  jobLocation: string().required("InputFieldIsRequried"),
  experienceYears: number()
    .required("InputFieldIsRequried")
    .min(0, "ExperienceMustBeGreaterOrEqual0").typeError("InputFieldIsRequried"),
});

export type EditExpertExperiencesProps = InferType<typeof EditExpertExperiencesSchema>;
