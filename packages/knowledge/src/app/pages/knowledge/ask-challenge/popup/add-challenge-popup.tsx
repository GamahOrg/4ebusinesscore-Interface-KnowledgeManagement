import { useIntl } from "react-intl";
import Modal from "react-bootstrap/Modal";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addChallengeValidations } from "../../../../validations/add-challenge-validation";
import { ResponseStatus } from "../../../../enums/responseStatus";
import {
  addChallenge,
  fetchLookupsProjects,
} from "../../../../features/challenge/challengeSlice";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../../../../store/store";
import { Button, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import {
  fetchRoles,
  fetchUserRoles,
} from "../../../../features/users&departments/rolesSlice";
import { Notification } from "@4eplatform/shared/services/notifications";
import "moment-timezone";
import moment from "moment";
import DisplayErrorMessage from "@4eplatform/shared/functions/displayErrorMessage";
import { showSuccessAlert } from "@4eplatform/shared/services/helper";

type AddPopupProps = {
  show?: any;
  handleClose?: any;
};
function AddChallengePopup({ show, handleClose }: AddPopupProps) {
  const intl = useIntl();
  useEffect(() => {
    let params: any = {
      pageSize: "100000",
      pageNumber: "1",
    };
    dispatch(fetchRoles(params) as any);
  }, []);
  let roles = useAppSelector((state: RootState) => {
    return state?.roles?.roles;
  });
  let usersInRole = useAppSelector((state: RootState) => {
    return state?.roles?.usersInRole;
  });
  let roleIdForChallengesRequestsManager = roles?.find((item) => {
    return (
      item?.nameAr?.trim() == "مسؤول طلبات طرح تحدي" ||
      item?.nameAr?.trim() == "مسؤول طلبات التحديات" ||
      item?.nameAr?.trim() == "مسئول التحديات" ||
      item?.nameAr?.trim() == "مسؤول التحديات"
    );
  })?.id;
  useEffect(() => {
    if (roleIdForChallengesRequestsManager) {
      dispatch(
        fetchUserRoles({
          id: roleIdForChallengesRequestsManager,
          myparams: {},
        }) as any
      );
    }
  }, [roleIdForChallengesRequestsManager]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  let language: string = intl.locale;

  const LKProjects = useSelector(
    (state: RootState) => state?.challenges?.LKProjects
  );

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors },
    watch,
  } = useForm<any>({
    resolver: yupResolver(addChallengeValidations),
    mode: "onChange",
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      clearErrors("challengeAttachments");
      setSelectedFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  const MAX_SIZE_MB = 10;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
  const onSubmit = async (data: any) => {
    if (!selectedFiles.length) {
      setError("challengeAttachments", {
        type: "custom",
        message: "ThisFelidIsRequired",
      });
      return;
    }

    let formdata = new FormData();
    formdata.append("ProjectName", data?.projectName);
    formdata.append("LK_ChallengeCategoryId", data?.projectName);
    formdata.append("Title", data?.title);
    formdata.append("Description", data?.description);

    selectedFiles?.forEach((file) => {
      formdata.append("ChallengeAttachments", file);
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
    await dispatch(addChallenge(formdata) as any).then((res: any) => {
      if (
        res?.payload?.message == "ChallengeIsAddedSuccessfully" &&
        res?.payload?.statusEnum == ResponseStatus.SavedSuccessfully
      ) {
        showSuccessAlert(true, "AddedSuccessfully", intl);
        handleClose();
        reset();
        setSelectedFiles([]);
        setLoading(false);
        usersInRole?.forEach((user) => {
          Notification.addingRequestForKnowledge(
            user?.userId,
            `${
              (window as any)._env_?.PUBLIC_URL
            }/knowledge-posting-requests/challenge/${
              res?.payload?.result
            }/details`,
            89,
            res?.payload?.result,
            user?.email,
            true,
            97,
            moment
              .tz(new Date(), "UTC")
              .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
              .format("llll"),
            data?.title,
            "إضافة تحدي جديد",
            "679d080f-78d7-45f7-96df-6b5bc1f3dafc",
            ""
          );
        });
      } else if (res?.payload?.message) {
        showSuccessAlert(false, "AnErrorOccured", intl);
        setLoading(false);
      }
    });
  };

  const countWords = (str: string) => {
    const words = str;
    return words?.length;
  };

  useEffect(() => {
    if (show) {
      dispatch(fetchLookupsProjects() as any);
    }
  }, [show]);

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
                  {intl.formatMessage({ id: "AddNewChallenge" })}
                </span>
                <span className="mt-1 fw-semibold fs-6 text-muted my-5">
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
                <div className="mb-2 pt-2 pb-3 ">
                  <label className="form-label px-2 required">
                    {intl.formatMessage({ id: "ChallengeClassifications" })}
                  </label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text justify-content-center">
                        <i className="bi bi-kanban special text-gray-700"></i>
                      </span>
                    </div>
                    <select
                      className={`form-select`}
                      {...register("projectName")}
                    >
                      <option value={""}>
                        {intl.formatMessage({ id: "ChooseChallengeCategory" })}
                      </option>
                      {LKProjects?.map((LK: any) => (
                        <option
                          value={LK?.id}
                          key={language == "ar" ? LK?.nameAr : LK?.nameEn}
                        >
                          {language == "ar" ? LK?.nameAr : LK?.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  {DisplayErrorMessage(
                    errors?.projectName?.message as string,
                    intl,
                    language
                  )}
                </div>
              </div>

              <div className="col-12">
                <div className="mb-2 pt-2 pb-3">
                  <label
                    htmlFor="ChallengeTitle"
                    className="form-label px-2 required"
                  >
                    {intl.formatMessage({ id: "ChallengeTitle" })}
                  </label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text justify-content-center">
                        <i className="fas fa-flag-checkered special text-gray-700"></i>
                      </span>
                    </div>
                    <input
                      id="ChallengeTitle"
                      type="text"
                      className="form-control"
                      placeholder={intl.formatMessage({
                        id: "ChallengeTitle",
                      })}
                      {...register("title")}
                    />
                  </div>
                  {DisplayErrorMessage(
                    errors?.title?.message as string,
                    intl,
                    language
                  )}
                </div>
              </div>

              <div className="col-12">
                <div className="mb-2 pt-2 pb-3">
                  <label
                    htmlFor="ChallengeSubject"
                    className="form-label px-2 required"
                  >
                    {intl.formatMessage({ id: "ChallengeSubject" })}
                  </label>
                  <textarea
                    id="ChallengeSubject"
                    className="form-control form-control form-control-solid mb-3 mb-lg-2 min-h-100px"
                    placeholder={intl.formatMessage({
                      id: "ChallengeSubject",
                    })}
                    {...register("description")}
                  />
                  <div className="d-flex justify-content-end">
                    <span className="text-muted">
                      {" "}
                      1000/
                      <span
                        className={
                          countWords(watch("description")) === 0
                            ? ""
                            : countWords(watch("description")) < 1000
                            ? "text-danger"
                            : ""
                        }
                      >
                        {countWords(watch("description"))}
                      </span>
                    </span>
                  </div>
                  {DisplayErrorMessage(
                    errors?.description?.message as string,
                    intl,
                    language
                  )}
                </div>
              </div>
              <div className="col-12">
                <div className="mb-2 pt-2 pb-3">
                  <input
                    className="myform-control"
                    hidden
                    id="files"
                    type="file"
                    multiple
                    {...register("challengeAttachments")}
                    onChange={handleFileChange}
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
                        <i className="fa-solid fa-file mx-1 fs-3 fa-fw"></i>{" "}
                      </label>
                    </div>
                  </div>
                  {DisplayErrorMessage(
                    errors?.challengeAttachments?.message as string,
                    intl,
                    language
                  )}
                </div>
                {selectedFiles && (
                  <div>
                    <ul>
                      {selectedFiles.map((file, index) => (
                        <li
                          key={index}
                          className="d-flex justify-content-between align-items-center my-2"
                        >
                          {file.name}
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
          </Modal.Body>
          <Modal.Footer className="justify-content-center py-2">
            <div className="d-flex justify-content-center my-5">
              <button
                type="reset"
                onClick={handleClose}
                className="btn btn-secondary px-15 me-5"
              >
                {intl.formatMessage({ id: "Cancel" })}
              </button>
              {!loading ? (
                <button
                  type="submit"
                  data-bs-dismiss="modal"
                  className="btn btn-success px-15 me-5"
                >
                  {intl.formatMessage({ id: "Add" })}
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
          </Modal.Footer>
        </form>
      </div>
    </Modal>
  );
}

export default AddChallengePopup;
