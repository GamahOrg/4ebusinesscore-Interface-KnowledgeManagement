import { Fragment, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { AcceptPopup } from "../../../partials/AcceptPopup";
import { RejectPopup } from "../../../partials/RejectPopup";
import { Notification } from "@4eplatform/shared/services/notifications";
import { showSuccessAlert } from "@4eplatform/shared/services/helper";

import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../../../../store/store";
import {
  editBlogRequestStage,
  editChallengeRequestStage,
  editIdeaRequestStage,
  editQuestionRequestStage,
  fetchBlogDetailsByRequestStage,
  fetchChallengeDetailsByRequestStage,
  fetchIdeaDetailsByRequestStage,
  fetchQuestionDetailsByRequestStage,
} from "../../../../features/idea/knowledgePostingSlice";
import { useParams } from "react-router-dom";
import { RequestStage } from "../../../../enums/enums";
import { useNavigate } from "react-router-dom";
import { AcceptPopupWithoutPosting } from "../../../partials/AcceptPopupWithoutPosting";
import { toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";

function KnowledgePostingRequestsDetails() {
  let intl = useIntl();
  const navigate = useNavigate();
  const [modalRShow, setModalRShow] = useState<boolean>(false);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [modalAShow, setModalAShow] = useState<boolean>(false);
  let { id, department } = useParams();
  let [statusEnum, setStatusEnum] = useState<number>(0);
  let [notes, setNotes] = useState("");

  const dispatch = useAppDispatch();
  let knowledgePostingDetails = useAppSelector((state: RootState) => {
    return state?.knowledgePosting?.requestedIdea?.result;
  });

  useEffect(() => {
    if (department === "ideas") {
      (async () => {
        await dispatch(fetchIdeaDetailsByRequestStage(id));
      })();
    } else if (department === "challenge") {
      (async () => {
        await dispatch(fetchChallengeDetailsByRequestStage(id));
      })();
    } else if (department === "blog") {
      (async () => {
        await dispatch(fetchBlogDetailsByRequestStage(id));
      })();
    } else if (department === "askExpert") {
      (async () => {
        await dispatch(fetchQuestionDetailsByRequestStage(id));
      })();
    }
  }, [id, department]);
  let navigateUrl = "/systems-services-settings/dynamic-workspace";

  const acceptRequest = async () => {
    if (department === "ideas") {
      let data = {
        id,
        body: {
          ideaId: id,
          requestStage: 2,
          notes: notes,
        },
      };
      await dispatch(editIdeaRequestStage(data as any) as any).then(
        (res: any) => {
          if (res?.payload?.statusEnum == 1) {
            showSuccessAlert(true, "AddedSuccessfully", intl, () => {
              window.location.href =
                (window as any)._env_?.REACT_APP_Base_Url +
                "/systems-services-settings/dynamic-workspace";
            });
          }
          return setStatusEnum(res?.payload?.statusEnum);
        }
      );
    } else if (department === "blog") {
      let data = {
        id,
        body: {
          requestStage: 2,
          notes: notes,
        },
      };
      await dispatch(editBlogRequestStage(data as any) as any).then(
        (res: any) => {
          if (res?.payload?.statusEnum == 1) {
            showSuccessAlert(true, "AddedSuccessfully", intl, () => {
              window.location.href =
                (window as any)._env_?.REACT_APP_Base_Url +
                "/systems-services-settings/dynamic-workspace";
            });
          }
          return setStatusEnum(res?.payload?.statusEnum);
        }
      );
    } else if (department === "challenge") {
      let data = {
        id,
        body: {
          challengeId: id,
          requestStage: 2,
          notes: notes,
        },
      };
      await dispatch(editChallengeRequestStage(data as any) as any).then(
        (res: any) => {
          if (res?.payload?.statusEnum == 1) {
            showSuccessAlert(true, "AddedSuccessfully", intl, () => {
              window.location.href =
                (window as any)._env_?.REACT_APP_Base_Url +
                "/systems-services-settings/dynamic-workspace";
            });
          }
          return setStatusEnum(res?.payload?.statusEnum);
        }
      );
    } else if (department === "askExpert") {
      let data = {
        id,
        body: {
          requestStage: 2,
          notes: notes,
        },
      };
      await dispatch(editQuestionRequestStage(data as any) as any).then(
        (res: any) => {
          if (res?.payload?.statusEnum == 1) {
            showSuccessAlert(true, "AddedSuccessfully", intl, () => {
              window.location.href =
                (window as any)._env_?.REACT_APP_Base_Url +
                "/systems-services-settings/dynamic-workspace";
            });
          }
          return setStatusEnum(res?.payload?.statusEnum);
        }
      );
    }
  };

  const rejectRequest = async () => {
    if (department === "ideas") {
      let data = {
        id,
        body: {
          ideaId: id,
          requestStage: 3,
          notes: notes,
        },
      };
      return await dispatch(editIdeaRequestStage(data as any) as any).then(
        (res: any) => {
          if (res?.payload?.statusEnum == 1) {
            showSuccessAlert(
              true,
              "TheRequestWasSuccessfullyRejected",
              intl,
              () => {
                window.location.href =
                  (window as any)._env_?.REACT_APP_Base_Url +
                  "/systems-services-settings/dynamic-workspace";
              }
            );
          }
        }
      );
    } else if (department === "blog") {
      let data = {
        id,
        body: {
          requestStage: 3,
          notes: notes,
        },
      };
      return await dispatch(editBlogRequestStage(data as any) as any).then(
        (res: any) => {
          if (res?.payload?.statusEnum == 1) {
            showSuccessAlert(
              true,
              "TheRequestWasSuccessfullyRejected",
              intl,
              () => {
                window.location.href =
                  (window as any)._env_?.REACT_APP_Base_Url +
                  "/systems-services-settings/dynamic-workspace";
              }
            );
            // navigate(navigateUrl, {
            //   state: { subSystemId: localStorage.getItem("subSystemId") },
            // });
          }
        }
      );
    } else if (department === "challenge") {
      let data = {
        id,
        body: {
          challengeId: id,
          requestStage: 3,
          notes: notes,
        },
      };
      return await dispatch(editChallengeRequestStage(data as any) as any).then(
        (res: any) => {
          if (res?.payload?.statusEnum == 1) {
            showSuccessAlert(
              true,
              "TheRequestWasSuccessfullyRejected",
              intl,
              () => {
                window.location.href =
                  (window as any)._env_?.REACT_APP_Base_Url +
                  "/systems-services-settings/dynamic-workspace";
              }
            );
            // navigate(navigateUrl, {
            //   state: { subSystemId: localStorage.getItem("subSystemId") },
            // });
          }
        }
      );
    } else if (department === "askExpert") {
      let data = {
        id,
        body: {
          requestStage: 3,
          notes: notes,
        },
      };
      return await dispatch(editQuestionRequestStage(data as any) as any).then(
        (res: any) => {
          if (res?.payload?.statusEnum == 1) {
            showSuccessAlert(
              true,
              "TheRequestWasSuccessfullyRejected",
              intl,
              () => {
                window.location.href =
                  (window as any)._env_?.REACT_APP_Base_Url +
                  "/systems-services-settings/dynamic-workspace";
              }
            );
            // navigate(navigateUrl, {
            //   state: { subSystemId: localStorage.getItem("subSystemId") },
            // });
          }
        }
      );
    }
  };
  const acceptTheRequestwithoutPosting = async () => {
    if (department === "ideas") {
      let data = {
        id,
        body: {
          ideaId: id,
          requestStage: 4,
          notes: notes,
        },
      };
      await dispatch(editIdeaRequestStage(data as any) as any).then(
        (res: any) => {
          if (res?.payload?.statusEnum == 1) {
            showSuccessAlert(true, "AddedSuccessfully", intl, () => {
              window.location.href =
                (window as any)._env_?.REACT_APP_Base_Url +
                "/systems-services-settings/dynamic-workspace";
            });
          }
          return setStatusEnum(res?.payload?.statusEnum);
        }
      );
    }
  };
  const AttachmentLink = ({ file, index }: { file: string; index: number }) => {
    const fileExtension = file.split(".").pop(); // Extract the file extension
    let iconSrc;
    if (
      fileExtension === "png" ||
      fileExtension === "jpg" ||
      fileExtension === "jpeg" ||
      fileExtension === "jfif" ||
      fileExtension === "webp"
    ) {
      iconSrc = (window as any)._env_?.REACT_APP_API_User_Url + "/" + file;
    } else if (fileExtension === "pdf") {
      iconSrc = "/media/pmo/pdfIcon.png";
    } else if (fileExtension === "doc" || fileExtension === "docx") {
      iconSrc = "/media/pmo/wordIcon2.jpg";
    } else if (fileExtension === "xls" || fileExtension === "xlsx") {
      iconSrc = "/media/pmo/excelIcon2.jpg";
    } else if (fileExtension === "txt") {
      iconSrc = "/media/pmo/textIcon.png";
    } else if (
      fileExtension === "mp4" ||
      fileExtension === "webm" ||
      fileExtension === "avi" ||
      fileExtension === "mkv" ||
      fileExtension === "flv" ||
      fileExtension === "ts"
    ) {
      iconSrc = "/media/pmo/video.png";
    }
    return (
      <a
        href={(window as any)._env_?.REACT_APP_API_User_Url + "/" + file}
        target="_blank"
        rel="noreferrer"
        className="mx-2"
        key={index}
      >
        <img src={iconSrc} width={"30px"} height={"30px"} alt="attachment" />
        <span className="fs-7 mt-1 mx-2">
          {file?.split("/")?.slice(-1)[0]?.split(".")[0]}
        </span>
      </a>
    );
  };
  const renderAttachments = (
    department: string,
    knowledgePostingDetails: any
  ) => {
    if (
      department === "ideas" &&
      knowledgePostingDetails?.ideaAttachments?.length !== 0 &&
      knowledgePostingDetails?.ideaAttachments
    ) {
      return knowledgePostingDetails.ideaAttachments.map(
        (file: string, index: number) => (
          <AttachmentLink file={file} index={index} key={`idea-${index}`} />
        )
      );
    }

    if (
      department === "blog" &&
      knowledgePostingDetails?.blogAttachments?.length !== 0 &&
      knowledgePostingDetails?.blogAttachments
    ) {
      return knowledgePostingDetails.blogAttachments.map(
        (file: string, index: number) => (
          <AttachmentLink file={file} index={index} key={`blog-${index}`} />
        )
      );
    }

    if (
      department === "challenge" &&
      knowledgePostingDetails?.challengeAttachments?.length !== 0 &&
      knowledgePostingDetails?.challengeAttachments
    ) {
      return knowledgePostingDetails.challengeAttachments.map(
        (file: string, index: number) => (
          <AttachmentLink
            file={file}
            index={index}
            key={`challenge-${index}`}
          />
        )
      );
    }

    return null;
  };
  const memoizedAttachments = useMemo(() => {
    if (!department) return null;
    return renderAttachments(department, knowledgePostingDetails);
  }, [department, knowledgePostingDetails]);

  const handleNotification = (department: any, state: any) => {
    let redirectLink;
    switch (department) {
      case "ideas":
        redirectLink = "/knowledge-ideas-bank/knowledge-idea-bank-details";
        break;
      case "askExpert":
        redirectLink = "/knowledge-ask-expert/knowledge-question-details";
        break;
      case "challenge":
        redirectLink = "/knowledge-ask-challenge/challenge-details";
        break;
      case "blog":
        redirectLink = "/knowledge-blogging/blog-details";
        break;
    }
    if (state == "accept") {
      Notification.acceptPostingRequest(
        knowledgePostingDetails?.createdBy,
        `${(window as any)._env_?.PUBLIC_URL}${redirectLink}/${
          knowledgePostingDetails?.id
        }`,
        89,
        knowledgePostingDetails?.id,
        knowledgePostingDetails?.email,
        true,
        100,
        knowledgePostingDetails?.createdOn,
        knowledgePostingDetails?.title || knowledgePostingDetails?.body,
        department == "ideas"
          ? "بنك الافكار"
          : department == "challenge"
          ? "طرح تحدي"
          : department == "blog"
          ? "المدونة"
          : department == "askExpert"
          ? "إسأل خبير"
          : "",
        "679d080f-78d7-45f7-96df-6b5bc1f3dafc",
        ""
      );
      if (department == "askExpert") {
        knowledgePostingDetails?.experts?.map((expert: any) => {
          Notification.receivedForExpert(
            expert?.expertId,
            `${
              (window as any)._env_?.PUBLIC_URL
            }/knowledge-my-questions/knowledge-my-question-details/${
              knowledgePostingDetails?.id
            }`,
            89,
            knowledgePostingDetails?.id,
            expert?.expertEmail,
            true,
            100,
            knowledgePostingDetails?.createdOn,
            knowledgePostingDetails?.title || knowledgePostingDetails?.body,
            "إسأل خبير",
            "679d080f-78d7-45f7-96df-6b5bc1f3dafc",
            ""
          );
        });
      }
    } else if (state == "reject") {
      Notification.rejectPostingRequest(
        knowledgePostingDetails?.createdBy,
        `${(window as any)._env_?.PUBLIC_URL}${redirectLink}/${
          knowledgePostingDetails?.id
        }`,
        89,
        knowledgePostingDetails?.id,
        knowledgePostingDetails?.email,
        true,
        100,
        knowledgePostingDetails?.createdOn,
        knowledgePostingDetails?.title || knowledgePostingDetails?.body,
        department == "ideas"
          ? "بنك الافكار"
          : department == "challenge"
          ? "طرح تحدي"
          : department == "blog"
          ? "المدونة"
          : department == "askExpert"
          ? "إسأل خبير"
          : "",
        "679d080f-78d7-45f7-96df-6b5bc1f3dafc",
        ""
      );
    } else if (state == "acceptWithoutPosting") {
      Notification.acceptWithoutPosting(
        knowledgePostingDetails?.createdBy,
        `${(window as any)._env_?.PUBLIC_URL}${redirectLink}/${
          knowledgePostingDetails?.id
        }`,
        89,
        knowledgePostingDetails?.id,
        knowledgePostingDetails?.email,
        true,
        100,
        knowledgePostingDetails?.createdOn,
        knowledgePostingDetails?.title || knowledgePostingDetails?.body,
        department == "ideas"
          ? "بنك الافكار"
          : department == "challenge"
          ? "طرح تحدي"
          : department == "blog"
          ? "المدونة"
          : department == "askExpert"
          ? "إسأل خبير"
          : "",
        "679d080f-78d7-45f7-96df-6b5bc1f3dafc",
        ""
      );
    }
  };

  return (
    <Fragment>
      <div className="detailsCard my-5">
        <div className="card card-xl-stretch mb-xl-6">
          <div className="card-header pt-3 pb-2 mb-3">
            <h3 className="card-title align-items-start flex-column">
              <span className="card-label fw-bolder fs-3 mb-2 ">
                {intl.formatMessage({ id: "RequestDetails" })}
              </span>
            </h3>
          </div>
          <div className="container-xxl mb-7 ">
            <div className="w-100 mb-3 mt-4 position-relative px-6 card pt-2 shadow border border-2 border-bottom-4">
              <div
                style={{
                  height: "100%",
                  width: "3px",
                  position: "absolute",
                  top: "0px",
                  right: "0px",
                }}
                className={`${
                  knowledgePostingDetails?.requestStage === RequestStage.Pending
                    ? "bg-warning"
                    : knowledgePostingDetails?.requestStage ===
                      RequestStage.Rejected
                    ? "bg-danger"
                    : knowledgePostingDetails?.requestStage ===
                      RequestStage.AcceptAndNotPublished
                    ? "bg-primary"
                    : "bg-success"
                }`}
              ></div>
              <div className="d-flex align-items-center justify-content-end">
                <span
                  className={`ps-4 badgex  ${
                    knowledgePostingDetails?.requestStage ===
                    RequestStage.Pending
                      ? "badge-light-warning"
                      : knowledgePostingDetails?.requestStage ===
                        RequestStage.Rejected
                      ? "badge-light-danger"
                      : knowledgePostingDetails?.requestStage ===
                        RequestStage.AcceptAndNotPublished
                      ? "badge-light-primary"
                      : "badge-light-success"
                  }`}
                >
                  {knowledgePostingDetails?.requestStage ===
                  RequestStage.Pending
                    ? intl.formatMessage({ id: "PendingRequest" })
                    : knowledgePostingDetails?.requestStage ===
                      RequestStage.Rejected
                    ? intl.formatMessage({ id: "RejectedRequest" })
                    : knowledgePostingDetails?.requestStage ==
                      RequestStage.AcceptAndNotPublished
                    ? intl.formatMessage({ id: "AcceptAndNotPublished" })
                    : intl.formatMessage({ id: "AcceptedRequest" })}
                </span>
              </div>
              <div className=" d-flex justify-content-between mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <img
                    src={
                      knowledgePostingDetails?.userImgUrl
                        ? `${
                            (window as any)._env_?.REACT_APP_API_AskExpert_Url
                          }/${knowledgePostingDetails?.userImgUrl}`
                        : toAbsoluteUrl("/media/avatars/300-3.jpg")
                    }
                    className="d-block mx-2"
                    style={{ height: "50px", width: "50px" }}
                    alt="profile img"
                    onError={(e: any) =>
                      (e.target.src = toAbsoluteUrl("/media/avatars/300-3.jpg"))
                    }
                  />
                  <div className="mx-3 text-gray-700">
                    <p className="mb-1 fw-bolder ">
                      {" "}
                      {knowledgePostingDetails?.firstName}{" "}
                      {knowledgePostingDetails?.secondName}{" "}
                      {knowledgePostingDetails?.thirdName}{" "}
                      {knowledgePostingDetails?.fourthName}
                    </p>
                    <p className="mb-1 text-muted">
                      {knowledgePostingDetails?.createdOn?.slice(0, 10)}
                    </p>
                  </div>
                </div>
                <div className="w-75"></div>
              </div>
              <p className="text-primary mt-3 mb-5 fs-3">
                {department === "askExpert"
                  ? knowledgePostingDetails?.body
                  : knowledgePostingDetails?.title}
              </p>
              <div className="pt-2 mb-5">
                <p className="text-gray-600 mb-2">
                  {knowledgePostingDetails?.description}
                </p>
              </div>
              <div className="d-flex gap-2 mb-4">
                {/* {department &&
                  renderAttachments(department, knowledgePostingDetails)} */}
                {department && memoizedAttachments}
              </div>
            </div>
          </div>
          <hr
            style={{ backgroundColor: "gray", width: "95%", margin: "0 auto" }}
          />
          {knowledgePostingDetails?.requestStage === RequestStage.Pending ||
          knowledgePostingDetails?.requestStage ===
            RequestStage.AcceptAndNotPublished ? (
            <div>
              <div className="container-xxl mt-5 mb-4">
                <div className="pt-3">
                  <label htmlFor="addNotes" className="px-2 mb-3 required">
                    {intl.formatMessage({ id: "Notes" })}
                  </label>
                  <textarea
                    name="admine notes"
                    placeholder={intl.formatMessage({
                      id: "AddNotesToTheRequest",
                    })}
                    className="form-control form-control-solid mb-3 mb-lg-0 min-h-100px"
                    style={{ maxHeight: "200px" }}
                    id="addNotes"
                    value={notes}
                    onChange={(e) => {
                      setNotes(e.target.value);
                    }}
                  ></textarea>
                </div>
              </div>

              <div className="mt-5 mb-5 col-12 col-lg-8 mx-auto">
                <div className="mt-5 mb-5 col-12 col-lg-8 mx-auto">
                  <div className="outputCard card-diff-toolbar pt-5 w-100 mt-3 d-flex justify-content-center">
                    <div className="d-flex flex-column flex-md-row gap-3 justify-content-between">
                      <div
                        className="btn btn-secondary text-center w-100"
                        style={{ minWidth: "150px", marginInline: "5px" }}
                        onClick={() => setModalRShow(true)}
                      >
                        {intl.formatMessage({ id: "Reject" })}
                      </div>

                      <button
                        type="button"
                        onClick={() => setModalShow(true)}
                        className="btn btn-success text-center w-100"
                        style={{ minWidth: "150px", border: "none" }}
                      >
                        {intl.formatMessage({ id: "Acceptance" })}
                      </button>

                      {department === "ideas" &&
                        knowledgePostingDetails?.requestStage !==
                          RequestStage.AcceptAndNotPublished && (
                          <button
                            type="button"
                            onClick={() => setModalAShow(true)}
                            className="btn btn-primary text-center w-100 text-nowrap"
                            style={{ minWidth: "150px", border: "none" }}
                          >
                            {intl.formatMessage({
                              id: "AcceptWithoutPosting",
                            })}
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="container-xxl mt-5 mb-4">
                <div className="pt-3">
                  <label htmlFor="addNotes" className="px-2 mb-3 required">
                    {intl.formatMessage({ id: "Notes" })}
                  </label>
                  <textarea
                    disabled
                    name="admine notes"
                    placeholder={intl.formatMessage({
                      id: "AddNotesToTheRequest",
                    })}
                    className="form-control form-control-solid mb-3 mb-lg-0 min-h-100px disabled"
                    style={{ maxHeight: "200px" }}
                    id="addNotes"
                    value={knowledgePostingDetails?.notes}
                  ></textarea>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="modal fade" id="Rega_modal_accept" aria-hidden="true">
        <AcceptPopup
          show={modalShow}
          handleClose={() => setModalShow(false)}
          acceptFun={() => {
            if (notes) {
              acceptRequest();
              handleNotification(department, "accept");
            } else {
              showSuccessAlert(false, "YouMustEnterNotes", intl, () => {});
            }
          }}
          id={id}
          statusEnum={statusEnum}
        />
      </div>
      <div className="modal fade" id="Rega_modal_accept" aria-hidden="true">
        <AcceptPopupWithoutPosting
          show={modalAShow}
          handleClose={() => setModalAShow(false)}
          acceptFun={() => {
            if (notes) {
              acceptTheRequestwithoutPosting();
              handleNotification(department, "acceptWithoutPosting");
            } else {
              showSuccessAlert(false, "YouMustEnterNotes", intl, () => {});
            }
          }}
          id={id}
          statusEnum={statusEnum}
        />
      </div>
      <div className="modal fade" id="Rega_modal_reject" aria-hidden="true">
        <RejectPopup
          show={modalRShow}
          handleClose={() => setModalRShow(false)}
          rejectFun={() => {
            if (notes) {
              rejectRequest();
              handleNotification(department, "reject");
            } else {
              showSuccessAlert(false, "YouMustEnterNotes", intl, () => {});
            }
          }}
          id={id}
          statusEnum={statusEnum}
        />
      </div>
    </Fragment>
  );
}

export default KnowledgePostingRequestsDetails;
