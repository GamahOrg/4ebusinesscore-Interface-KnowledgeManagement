import { object, string, InferType, number, boolean } from "yup";

export const AddExpertExperiencesSchema = object({
  experienceName: string().required("InputFieldIsRequried"),
  specializationId: string().required("InputFieldIsRequried"),
  jobLocation: string().required("InputFieldIsRequried"),
  experienceYears: number()
    .required("InputFieldIsRequired")
    .min(-1, "ExperienceMustBeGreaterOrEqual0").typeError("InputFieldIsRequried"),
});

export type AddExpertExperiencesProps = InferType<typeof AddExpertExperiencesSchema>;
