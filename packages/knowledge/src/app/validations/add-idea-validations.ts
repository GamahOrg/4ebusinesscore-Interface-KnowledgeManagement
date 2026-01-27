import { object, string, mixed } from "yup";

export const addIdeaValidations = object().shape({
  title: string().required("ThisFelidIsRequired"),
  description: string().required("ThisFelidIsRequired"),

  ideaAttachments: mixed()
    .test("required", "ThisFelidIsRequired", (value) => {
      return value && value.length > 0;
    })
    .test("fileType", "UnsupportedFileType", (value) => {
      if (!value || value.length === 0) return true;
      const allowedTypes = ["image/", "video/"];
      return Array.from(value).every((file) =>
        allowedTypes.some((type) => file.type.startsWith(type))
      );
    })
    .test("fileSize", "FileTooLarge", (value) => {
      if (!value || value.length === 0) return true;
      return Array.from(value).every(
        (file) => file.size <= 10 * 1024 * 1024 // 10MB
      );
    }),
});

export const editIdeaValidations = object().shape({
  title: string().required("ThisFelidIsRequired"),
  description: string().required("ThisFelidIsRequired"),

  ideaAttachments: mixed()
    // allow empty (keep existing only)
    .test("validFiles", "UnsupportedFileType", (value) => {
      if (!value || value.length === 0) return true;

      const allowedTypes = ["image/", "video/"];
      return Array.from(value).every((file: any) => {
        // skip existing URLs
        if (file?.isExisting || typeof file?.url === "string") return true;
        return allowedTypes.some((type) => file?.type?.startsWith(type));
      });
    })
    .test("fileSize", "FileTooLarge", (value) => {
      if (!value || value.length === 0) return true;

      return Array.from(value).every((file: any) => {
        if (file?.isExisting) return true; // skip existing
        return file.size <= 10 * 1024 * 1024; // 10 MB
      });
    }),
});
