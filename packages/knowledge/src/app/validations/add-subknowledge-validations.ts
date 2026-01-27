import { string, object, mixed, array } from "yup";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

export const addSubKnowledgeValidations = object().shape({
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

  knowledgeAttachments: array()
    .of(
      mixed().test("fileType", "Invalid file type", (file) => {
        // Optional individual file type check
        if (!file) return true;
        return true;
      })
    )
    .min(1, "InputFieldIsRequried")
    .test("fileSize", "MaximumAttachmentSize100MB", (files) => {
      if (!files || files.length === 0) return true;

      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      return totalSize <= 100 * 1024 * 1024; // 100MB
    }),
  // orgName: string().required("ThisFelidIsRequired"),
});
