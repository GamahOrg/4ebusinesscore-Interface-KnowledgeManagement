import { useIntl } from "react-intl";
import Modal from "react-bootstrap/Modal";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { addIdeaValidations } from "../../../../validations/add-idea-validations";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import {
  addIdea,
  fetchLKInputTypes,
} from "../../../../features/idea/ideaSlice";
import FormData from "@4eplatform/shared/assets/forms/FormData";
import { showSuccessAlert } from "@4eplatform/shared/services/helper";
import { Button, Spinner } from "react-bootstrap";
import {
  fetchRoles,
  fetchUserRoles,
} from "../../../../features/users&departments/rolesSlice";
import { useAppSelector, RootState } from "../../../../store/store";
import { Notification } from "@4eplatform/shared/services/notifications";
import "moment-timezone";
import moment from "moment";
import LkInputType from "../../../../models/LkInputTypes";

type AddPopupProps = {
  show?: any;
  handleClose?: any;
};
const AddIdeaPopup: FC<AddPopupProps> = ({
  show = false,
  handleClose = () => {},
}) => {
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
    resolver: yupResolver(addIdeaValidations),
    mode: "onChange",
  });

  const getLKInputTypes = async () => {
    let params: any = {};
    await dispatch(fetchLKInputTypes(params) as any);
  };
  useEffect(() => {
    let params: any = {
      pageSize: "100000",
      pageNumber: "1",
    };
    dispatch(fetchRoles(params) as any);
    getLKInputTypes();
  }, []);
  const inputTypes = useSelector((state: RootState) => {
    return state?.ideas?.inputTypesLookup?.lkInputTypes;
  });
  let roles = useAppSelector((state: RootState) => {
    return state?.roles?.roles;
  });
  let usersInRole = useAppSelector((state: RootState) => {
    return state?.roles?.usersInRole;
  });
  let roleIdForIdeaBankRequestsManager = roles?.find((item) => {
    return (
      item?.nameAr?.trim() == "مسؤول طلبات بنك الافكار" ||
      item?.nameAr?.trim() == "مسؤول طلبات بنك الأفكار" ||
      item?.nameAr?.trim() == "مسئول طلبات بنك الافكار" ||
      item?.nameAr?.trim() == "مسئول طلبات بنك الأفكار"
    );
  })?.id;
  useEffect(() => {
    if (roleIdForIdeaBankRequestsManager) {
      dispatch(
        fetchUserRoles({
          id: roleIdForIdeaBankRequestsManager,
          myparams: {},
        }) as any
      );
    }
  }, [roleIdForIdeaBankRequestsManager]);
  const intl = useIntl();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const updatedFiles = [...selectedFiles, ...Array.from(files)];

      setSelectedFiles(updatedFiles);

      // ✅ Tell React Hook Form the field value has changed
      setValue("ideaAttachments", updatedFiles, { shouldValidate: true });

      // ✅ Clear previous errors (optional)
      clearErrors("ideaAttachments");
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);

    // ✅ Keep RHF in sync after removing files
    setValue("ideaAttachments", updatedFiles, { shouldValidate: true });
  };

  const MAX_SIZE_MB = 10;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  const onSubmit = async (data: any) => {
    let { ideaAttachments, ...rest } = data;

    if (!selectedFiles.length) {
      setError("ideaAttachments", {
        type: "custom",
        message: "ThisFelidIsRequired",
      });
      return;
    }
    let formdata = FormData(rest);

    selectedFiles.forEach((file) => {
      formdata.append("ideaAttachments", file);
    });

    const totalSize = selectedFiles?.reduce((acc, file) => acc + file.size, 0);
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
    await dispatch(addIdea(formdata) as any).then((res: any) => {
      if (res.payload.statusEnum == 1) {
        showSuccessAlert(true, "AddedSuccessfully", intl);
        handleClose();
        reset();
        setSelectedFiles([]);
        usersInRole?.forEach((user) => {
          Notification.addingRequestForKnowledge(
            user?.userId,
            `${
              (window as any)._env_?.PUBLIC_URL
            }/knowledge-posting-requests/ideas/${res?.payload?.result}/details`,
            89,
            res?.payload?.result,
            user?.email,
            true,
            95,
            moment
              .tz(new Date(), "UTC")
              .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
              .format("llll"),
            data?.title,
            "إضافة فكرة جديدة",
            "679d080f-78d7-45f7-96df-6b5bc1f3dafc",
            ""
          );
        });
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
        res.payload.message === '["Description cannot exceed 5000 characters."]'
      ) {
        showSuccessAlert(false, "DescriptionCannotExceed5000Characters", intl);
      }
      setLoading(false);
    });
  };

  return (
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
                  {intl.formatMessage({ id: "AddNewIdea" })}
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
                    // defaultValue={0}
                  >
                    {inputTypes?.length &&
                      inputTypes?.map((input: LkInputType) => (
                        <option key={input?.id} value={input?.id}>
                          {intl.locale === "ar" ? input?.nameAr : input?.nameEn}
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
                  {errors.title && (
                    <p className="text-danger p-2">
                      {intl.formatMessage({
                        id: errors.title.message as string,
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
                {errors.description && (
                  <p className="text-danger p-2">
                    {intl.formatMessage({
                      id: errors.description.message as string,
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
                    <div
                      className="position-absolute cursor-pointer"
                      style={{
                        top: "50%",
                        left: intl?.locale == "ar" ? "17%" : "",
                        right: intl?.locale == "en" ? "17%" : "",

                        transform: "translateY(-50%)",
                      }}
                    >
                      <label htmlFor="files" className="cursor-pointer">
                        <i className="fa-solid fa-paperclip mx-1 fs-3 fa-fw"></i>
                      </label>
                    </div>
                    <div
                      className="position-absolute cursor-pointer"
                      style={{
                        top: "50%",
                        left: intl?.locale == "ar" ? "12%" : "",
                        right: intl?.locale == "en" ? "12%" : "",
                        transform: "translateY(-50%)",
                      }}
                    >
                      <label htmlFor="files" className="cursor-pointer">
                        <i className="fa-solid fa-clapperboard mx-1 fs-3 fa-fw"></i>
                      </label>
                    </div>
                    <div
                      className="position-absolute cursor-pointer"
                      style={{
                        top: "50%",
                        left: intl?.locale == "ar" ? "7%" : "",
                        right: intl?.locale == "en" ? "7%" : "",
                        transform: "translateY(-50%)",
                      }}
                    >
                      <label htmlFor="files" className="cursor-pointer">
                        <i className="fa-solid fa-image mx-1 fs-3 fa-fw"></i>
                      </label>
                    </div>
                    <div
                      className="position-absolute cursor-pointer"
                      style={{
                        top: "50%",
                        left: intl?.locale == "ar" ? "2%" : "",
                        right: intl?.locale == "en" ? "2%" : "",
                        transform: "translateY(-50%)",
                      }}
                    >
                      <label htmlFor="files" className="cursor-pointer">
                        <i className="fa-solid fa-file mx-1 fs-3 fa-fw"></i>
                      </label>
                    </div>
                    {errors.ideaAttachments && (
                      <p className="text-danger p-2">
                        {intl.formatMessage({
                          id: errors.ideaAttachments.message as string,
                        })}
                      </p>
                    )}
                  </div>
                  <div
                    style={{ textAlign: "left" }}
                    className="text-muted mt-2"
                  >
                    {intl.formatMessage({ id: "MaximumAttachmentSizeIs10MB" })}
                  </div>
                  {selectedFiles && (
                    <div>
                      <ul>
                        {selectedFiles.map((file, index) => (
                          <li
                            key={index}
                            className="d-flex justify-content-between align-items-center my-2"
                          >
                            <span className="w-90">{file.name}</span>
                            <button
                              onClick={() => handleRemoveFile(index)}
                              className="bg-transparent text-danger fw-bold border-0"
                            >
                              X
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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
                    disabled={loading}
                  >
                    {intl.formatMessage({ id: "Cancel" })}
                  </button>
                  {!loading ? (
                    <button
                      type="submit"
                      className="btn btn-success px-15 me-5"
                    >
                      <span className="indicator-label">
                        {intl.formatMessage({ id: "Add" })}
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
                      <span>{intl.formatMessage({ id: "Adding" })}</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Modal.Footer>
        </form>
      </div>
    </Modal>
  );
};

export default AddIdeaPopup;
