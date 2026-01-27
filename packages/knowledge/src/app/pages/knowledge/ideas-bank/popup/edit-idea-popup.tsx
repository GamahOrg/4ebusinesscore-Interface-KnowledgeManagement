import { useIntl } from "react-intl";
import Modal from "react-bootstrap/Modal";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { editIdeaValidations } from "../../../../validations/add-idea-validations";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { editIdea, fetchIdeas } from "../../../../features/idea/ideaSlice";
import FormData from "@4eplatform/shared/assets/forms/FormData";
import { showSuccessAlert } from "@4eplatform/shared/services/helper";
import { Button, Spinner } from "react-bootstrap";
import { RootState } from "../../../../store/store";
import LkInputType from "../../../../models/LkInputTypes";

type EditPopupProps = {
  show?: any;
  handleClose?: any;
  idea?: any;
};
const EditIdeaPopup: FC<EditPopupProps> = ({ show, handleClose, idea }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    setError,
    handleSubmit,
    clearErrors,
    reset,
    setValue,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(editIdeaValidations),
    mode: "onChange",
  });

  const intl = useIntl();
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const updatedFiles = [...selectedFiles, ...newFiles];

      setSelectedFiles(updatedFiles);

      // Sync with RHF
      setValue("ideaAttachments", updatedFiles, { shouldValidate: true });
      clearErrors("ideaAttachments");
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setValue("ideaAttachments", updatedFiles, { shouldValidate: true });
  };

  useEffect(() => {
    if (idea) {
      setValue("ideaCategory", idea?.ideaCategory);
      setValue("LK_InputTypeId", idea?.lK_InputTypeId);
      setValue("title", idea?.title);
      setValue("description", idea?.description);

      // Represent existing files
      const existingFiles =
        idea?.ideaAttachments?.map((url: string) => ({
          name: url.split("/").pop(),
          url,
          isExisting: true,
        })) || [];

      setSelectedFiles(existingFiles);

      // Sync existing with RHF
      setValue("ideaAttachments", existingFiles);
    }
  }, [idea]);

  const inputTypes = useSelector((state: RootState) => {
    return state?.ideas?.inputTypesLookup?.lkInputTypes;
  });

  const MAX_SIZE_MB = 10;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
  const onSubmit = async (data: any) => {
    if (!selectedFiles.length) {
      setError("ideaAttachments", {
        type: "custom",
        message: "ThisFelidIsRequired",
      });
      return;
    }
    let { ideaAttachments, ...rest } = data;
    let formdata = FormData(rest);

    selectedFiles?.forEach((file) => {
      if (file?.size > 0) {
        formdata.append("ideaAttachments", file);
      } else {
        formdata.append(
          "oldAttachments",
          idea?.ideaAttachments[0]?.split("/")?.slice(0, -1)?.join("/") +
            "/" +
            file?.name
        );
      }
    });
    const validFiles = selectedFiles?.filter((file) => file.size > 0);
    const totalSize = validFiles?.reduce((acc, file) => acc + file.size, 0);

    if (totalSize > MAX_SIZE_BYTES) {
      showSuccessAlert(false, "MaxSizeAttachments", intl);
      return;
    }
    const videoExtensions = [
      ".mp4",
      ".mov",
      ".avi",
      ".mkv",
      ".webm",
      ".flv",
      ".ts",
    ];
    const hasVideo = selectedFiles?.some((file) =>
      videoExtensions.some((ext) => file?.name?.endsWith(ext))
    );
    if (hasVideo) {
      showSuccessAlert(false, "VideoAttachmentsNotAccepted", intl);
      return;
    }
    setLoading(true);
    await dispatch(editIdea({ idea: formdata, id: idea?.id }) as any).then(
      (res: any) => {
        if (res.payload.statusEnum == 1) {
          showSuccessAlert(true, "EditedSuccessfully", intl);
          dispatch(fetchIdeas({ pageSize: "10" }) as any);
          handleClose();
          reset();
          setSelectedFiles([]);
        } else if (
          res.payload.message ===
          '["Title cannot exceed 100 characters.","Description cannot exceed 5000 characters."]'
        ) {
          showSuccessAlert(
            false,
            "TitleCannotExceed100AndDescriptionCannotExceed5000Characters",
            intl
          );
        } else if (
          res?.payload?.message ==
          '["Description cannot exceed 5000 characters."]'
        ) {
          showSuccessAlert(
            false,
            "DescriptionCannotExceed5000Characters",
            intl
          );
        }
        setLoading(false);
      }
    );
  };

  return (
    <div className="modal-dialog modal-dialog-centered mw-850px">
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
      >
        <div className="card">
          <Modal.Header
            closeButton
            style={{
              alignItems: intl.locale == "ar" ? "flex-start" : "center",
              flexDirection: intl.locale == "en" ? "column-reverse" : "row",
            }}
          >
            <div className="card-header w-100 px-1 d-flex justify-content-center pb-2  border-bottom-0 mt-10">
              <Modal.Title>
                <h3 className="card-title d-flex justify-content-center align-items-center flex-column">
                  <span className="card-label fs-4 my-5">
                    {" "}
                    {intl.formatMessage({ id: "EditIdea" })}
                  </span>
                  <span className="mt-1 fw-semibold fs-6 text-gray-700 my-5">
                    {intl.formatMessage({ id: "PleaseEnterTheFollowingData" })}{" "}
                  </span>
                </h3>
              </Modal.Title>
            </div>
          </Modal.Header>
          <form
            className="form outputForm"
            onSubmit={handleSubmit(onSubmit)}
            noValidate={true}
          >
            <Modal.Body>
              <div className="row">
                <div className="col-12">
                  <div className="mb-2 pt-2 pb-3">
                    <label
                      htmlFor="theTitle"
                      className="form-label px-2 required"
                    >
                      {intl.formatMessage({ id: "InputType" })}
                    </label>
                    <select
                      id="InputType"
                      className="form-select myform-control inputHeight form-select-solid select2-hidden-accessible mt-1"
                      data-kt-select2="true"
                      data-placeholder={intl.formatMessage({ id: "Choose" })}
                      data-dropdown-parent="#kt_menu_62775e8642438"
                      data-allow-clear="true"
                      data-select2-id="select2-data-4-vqtd"
                      tabIndex={-1}
                      aria-hidden="true"
                      {...register("LK_InputTypeId")}
                    >
                      {inputTypes?.length &&
                        inputTypes?.map((input: LkInputType) => (
                          <option key={input?.id} value={input?.id}>
                            {intl.locale === "ar"
                              ? input?.nameAr
                              : input?.nameEn}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="mb-2 pt-2 pb-3">
                    <label
                      htmlFor="theTitle"
                      className="form-label px-2 required"
                    >
                      {intl.formatMessage({ id: "Classification" })}
                    </label>
                    <select
                      id="outputStatus"
                      className="form-select myform-control inputHeight form-select-solid select2-hidden-accessible mt-1"
                      data-kt-select2="true"
                      data-placeholder={intl.formatMessage({ id: "Choose" })}
                      data-dropdown-parent="#kt_menu_62775e8642438"
                      data-allow-clear="true"
                      data-select2-id="select2-data-4-vqtd"
                      tabIndex={-1}
                      aria-hidden="true"
                      {...register("ideaCategory")}
                      defaultValue={0}
                    >
                      <option value={0}>
                        {intl.formatMessage({
                          id: "RelatedToBusinessImprovement",
                        })}
                      </option>
                      <option value={1}>
                        {intl.formatMessage({
                          id: "RelatedToDevelopingTheWorkEnvironment",
                        })}
                      </option>
                      <option value={2}>
                        {intl.formatMessage({ id: "RelatedToAnEventProposal" })}
                      </option>
                      <option value={3}>
                        {intl.formatMessage({
                          id: "RelatedToATechnicalDevelopmentProposal",
                        })}
                      </option>
                      <option value={4}>
                        {intl.formatMessage({
                          id: "RelatedToTheRealEstateSystem",
                        })}
                      </option>
                      <option value={5}>
                        {intl.formatMessage({
                          id: "Anideatosolveaproblem",
                        })}
                      </option>
                      <option value={6}>
                        {intl.formatMessage({
                          id: "RelatedToImprovingAnExistingProject",
                        })}
                      </option>
                      <option value={7}>
                        {intl.formatMessage({
                          id: "Newidea",
                        })}
                      </option>
                    </select>
                  </div>
                  <div className="mb-2 pt-2 pb-3 ">
                    <label
                      htmlFor="theTitle"
                      className="form-label px-2 required"
                    >
                      {intl.formatMessage({ id: "TheTitle" })}
                    </label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text justify-content-center">
                          <i className="far fa-lightbulb special text-gray-700"></i>
                        </span>
                      </div>
                      <input
                        id="theTitle"
                        type="text"
                        className="form-control"
                        placeholder={intl.formatMessage({
                          id: "AddTheTitleOfIdea",
                        })}
                        {...register("title")}
                      />
                    </div>
                    {errors?.title && (
                      <p className="text-danger p-2">
                        {intl.formatMessage({
                          id: errors?.title?.message as string,
                        })}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-12">
                  <div className="pt-2">
                    <label
                      htmlFor="theTitle"
                      className="form-label px-2 required"
                    >
                      {intl.formatMessage({ id: "WhatOnYourMind" })}
                    </label>
                    <textarea
                      id="notes"
                      className="form-control form-control-lg form-control-solid"
                      placeholder={intl.formatMessage({
                        id: "WhatOnYourMind",
                      })}
                      {...register("description")}
                    ></textarea>
                  </div>
                  {errors?.description && (
                    <p className="text-danger p-2">
                      {intl.formatMessage({
                        id: errors?.description?.message as string,
                      })}
                    </p>
                  )}
                </div>
                <div className="col-12 mt-4">
                  <div className="mb-2 pt-2 pb-3">
                    <input
                      className="myform-control"
                      hidden
                      id="files"
                      type="file"
                      {...register("ideaAttachments")}
                      onChange={handleFileChange}
                      multiple
                    />

                    <div className="position-relative">
                      <label
                        htmlFor="files"
                        className="w-100 h-60px d-flex align-items-center border border-gray-500 border-1 rounded-2 cursor-pointer px-3"
                      >
                        {intl.formatMessage({ id: "AddAttachment" })}
                      </label>

                      {/* Icons */}
                      {[
                        "fa-paperclip",
                        "fa-clapperboard",
                        "fa-image",
                        "fa-file",
                      ].map((icon, i) => (
                        <div
                          key={i}
                          className="position-absolute cursor-pointer"
                          style={{
                            top: "50%",
                            left: intl?.locale == "ar" ? `${17 - i * 5}%` : "",
                            right: intl?.locale == "en" ? `${17 - i * 5}%` : "",
                            transform: "translateY(-50%)",
                          }}
                        >
                          <label htmlFor="files" className="cursor-pointer">
                            <i
                              className={`fa-solid ${icon} mx-1 fs-3 fa-fw`}
                            ></i>
                          </label>
                        </div>
                      ))}

                      {errors?.ideaAttachments && (
                        <p className="text-danger p-2">
                          {intl.formatMessage({
                            id: errors.ideaAttachments.message as string,
                          })}
                        </p>
                      )}
                    </div>

                    {/* Files list */}
                    <div>
                      {selectedFiles.length > 0 && (
                        <ul>
                          {selectedFiles.map((file, index) => (
                            <li
                              key={index}
                              className="d-flex justify-content-between align-items-center my-2"
                            >
                              {file.url ? (
                                <a
                                  href={
                                    (window as any)._env_
                                      ?.REACT_APP_API_Blog_Url +
                                    "/" +
                                    file.url
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {file.name}
                                </a>
                              ) : (
                                <span className="w-90">{file.name}</span>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveFile(index)}
                                className="bg-transparent text-danger fw-bold border-0"
                              >
                                X
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="justify-content-center py-2">
              <div className="mt-5 mb-5 col-12 col-lg-7 mx-auto">
                <div className="outputCard card-diff-toolbar w-100 mt-3 d-flex justify-content-center">
                  <div className="d-flex justify-content-center align-items-center">
                    <button
                      type="reset"
                      onClick={handleClose}
                      aria-hidden="true"
                      className="btn btn-secondary px-15 me-5"
                    >
                      {intl.formatMessage({ id: "Cancel" })}
                    </button>
                    {!loading ? (
                      <button
                        type="submit"
                        className="btn btn-success px-15 me-5"
                      >
                        <span className="indicator-label">
                          {intl.formatMessage({ id: "Edit" })}
                        </span>
                      </button>
                    ) : (
                      <Button variant="success" disabled className="px-15 me-5">
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="mx-2"
                        />
                        <span>{intl.formatMessage({ id: "Editing" })}</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Modal.Footer>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default EditIdeaPopup;
