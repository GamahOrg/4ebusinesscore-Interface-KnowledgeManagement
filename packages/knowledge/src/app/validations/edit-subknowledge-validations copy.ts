import { string, object, mixed, array } from "yup";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

export const editSubKnowledgeValidations = object().shape({
  title: string().required("ThisFelidIsRequired"),
  details: string().required("ThisFelidIsRequired"),
  targets: string().required("ThisFelidIsRequired"),
  legislation: string().notRequired(),
  releaseDate: string()
    .required("InputFieldIsRequried")
    .typeError("InputFieldIsRequried"),
  // categoryId: string().required("ThisFelidIsRequired"),
  // knowledgeId: string().required("ThisFelidIsRequired"),
  participatingParties: string().required("ThisFelidIsRequired"),
  workParticipants: array().of(string().notRequired()),
  oldImages: array().optional(),

  knowledgeAttachments: array()
    .of(
      mixed().test("fileType", "Invalid file type", (file) => {
        // Skip old image objects
        if (!file || !(file instanceof File)) return true;
        return true;
      })
    )
    .min(1, "InputFieldIsRequried")
    .test("fileSize", "MaximumAttachmentSize100MB", (files) => {
      if (!files || files.length === 0) return true;

      // Only include real File objects (new uploads)
      const newFiles = files.filter((f) => f instanceof File);

      // If no new files, skip file size validation
      if (newFiles.length === 0) return true;

      const totalSize = newFiles.reduce((sum, file) => sum + file.size, 0);
      return totalSize <= MAX_FILE_SIZE;
    }),
  // orgName: string().required("ThisFelidIsRequired"),
});
