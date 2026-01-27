import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { RatingItems } from "../../partials/RatingItems";
import { KTSVG } from "@4eplatform/gateway/src/app/helpers";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import {
  fetchSubKnowledge,
  toggleFavorite,
  likeDislike,
  rateSubKnowledges,
} from "../../../features/knowledge/subKnowledgeSlice";
import { RootState, useAppDispatch } from "../../../store/store";
import { AddRatingPopup } from "../../partials/AddRatingPopup";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import moment from "moment";
import getIconSrcString from "@4eplatform/shared/functions/getIconSrcString";
export const KnowledgeKnowledgeableContent: FC = () => {
  const intl = useIntl();
  const [showGoal, setShowGoal] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);
  const [subKnowledgeDetails, setSubKnowledgeDetails] = useState<any>({});
  const [selectedAttachment, setSelectedAttachment] = useState<number>(0);

  let knowledgeId = useParams()?.id;
  let subKnowledgeId = useParams()?.subId;

  const dispatch = useAppDispatch();

  const subKnowledge = useSelector((state: RootState) => {
    return state?.SubKnowledges?.subKnowledge;
  });

  useEffect(() => {
    const fetchData = async () => {
      if (subKnowledgeId)
        await dispatch(fetchSubKnowledge(subKnowledgeId) as any);
    };
    fetchData();
  }, [subKnowledgeId]);

  useEffect(() => {
    setSubKnowledgeDetails(subKnowledge);
  }, [subKnowledge]);

  const handleToggleFavorite = (subId: string) => {
    dispatch(toggleFavorite(subId)).then((response: any) => {
      if (response.payload.statusEnum === 1) {
        setSubKnowledgeDetails((prevState: { isFavoirate: any }) => {
          return {
            ...prevState,
            isFavoirate: !prevState.isFavoirate,
          };
        });
      }
    });
  };
  const [actionLoading, setActionLoading] = useState(false);

  const handleReaction = async (value: any, subId: string) => {
    if (!actionLoading) {
      setActionLoading(true);
      await dispatch(
        likeDislike({ subKnowledgeId: subId, likeStatus: value }) as any
      ).then((res: any) => {
        setActionLoading(false);
      });
      await dispatch(fetchSubKnowledge(subId) as any);
    }
  };
  const [modalRShow, setModalRShow] = useState<boolean>(false);
  const [stars, setStars] = useState<number>(0);

  const ratingHandler = async (value: number) => {
    dispatch(rateSubKnowledges({ subKnowledgeId, value }) as any);
    setSubKnowledgeDetails((prevState: any) => {
      return {
        ...prevState,
        knowledgeRates: value,
      };
    });
  };

  useEffect(() => {}, [selectedAttachment]);

  const getAttachmentComponent = (fileUrl: {
    fileName: string;
    filePath: string;
  }) => {
    const fileName = fileUrl?.fileName?.split("/").pop();
    const fileExtension = fileName?.split(".").pop()?.toLowerCase();
    const fileSrc = `${(window as any)._env_?.REACT_APP_API_User_Url}/${
      fileUrl?.filePath
    }`;

    if (
      fileExtension === "png" ||
      fileExtension === "jpg" ||
      fileExtension === "jpeg" ||
      fileExtension === "jfif" ||
      fileExtension === "webp"
    ) {
      return (
        <img
          src={fileSrc}
          alt={fileName}
          style={{ width: "100%", height: "auto", borderRadius: "15px" }}
        />
      );
    } else if (fileExtension === "pdf") {
      return (
        <embed
          src={fileSrc}
          type="application/pdf"
          style={{ width: "100%", height: "750px", borderRadius: "15px" }}
        />
      );
    } else if (fileExtension === "xls" || fileExtension === "xlsx") {
      return (
        <div className="fs-6 pb-3 px-1">
          {intl.formatMessage({ id: "ThisPluginNotSupported" })}{" "}
          <a href={fileSrc} download>
            {intl.formatMessage({ id: "DownloadTheFile" })}
          </a>
        </div>
      );
    } else if (
      fileExtension === "mp4" ||
      fileExtension === "webm" ||
      fileExtension === "avi" ||
      fileExtension === "mkv" ||
      fileExtension === "flv" ||
      fileExtension === "ts"
    ) {
      return (
        <iframe
          src={fileSrc}
          style={{ width: "100%", height: "750px", borderRadius: "15px" }}
          allowFullScreen
        />
      );
    } else if (fileExtension === "doc" || fileExtension === "docx") {
      return (
        <>
          <div className="fs-6 pb-3 px-1">
            {intl.formatMessage({ id: "ThisPluginNotSupported" })}{" "}
            <a href={fileSrc} download>
              {intl.formatMessage({ id: "DownloadTheFile" })}
            </a>
          </div>
        </>
      );
    } else if (
      fileExtension === "ppt" ||
      fileExtension === "pptx" ||
      fileExtension === "pptm" ||
      fileExtension === "pps" ||
      fileExtension === "ppsx" ||
      fileExtension === "ppsm"
    ) {
      return (
        <div className="fs-6 pb-3 px-1">
          {intl.formatMessage({ id: "ThisPluginNotSupported" })}{" "}
          <a href={fileSrc} download>
            {intl.formatMessage({ id: "DownloadTheFile" })}
          </a>
        </div>
      );
    } else {
      return (
        <div className="fs-6 pb-3 px-1">
          {intl.formatMessage({ id: "ThisPluginNotSupported" })}{" "}
          <a href={fileSrc} download>
            {intl.formatMessage({ id: "DownloadTheFile" })}
          </a>
        </div>
      );
    }
  };

  let location = useLocation();

  let cardName = location?.state?.cardTitle;
  let serviceName = location?.state?.serviceName;

  const breadcrumbItems = [
    {
      path: "/knowledge-general-knowledge",
      defaultName: "GeneralKnowledge",
      name: cardName || serviceName,
    },
    {
      path: `/knowledge-general-knowledge/list/${knowledgeId}`,
      defaultName: "KnowledgeList",
      name: "",
    },
    {
      path: "",
      defaultName: "KnowledgeDetails",
      name: "",
    },
  ];
  return (
    <>
      <DynamicToolbar
        defaultTitle="KnowledgeDetails"
        extraTitle=""
        breadcrumbItems={breadcrumbItems}
        showWorkspace={true}
      />
      <div
        id="kt_content_container"
        className="d-flex flex-column-fluid align-items-start container-xxl p-0"
      >
        <div className="content flex-row-fluid" id="kt_content">
          <div className="d-flex flex-column flex-lg-row">
            <div className="flex-column flex-lg-row-auto w-lg-350px mb-10 mb-lg-0">
              <div className="card card-xl-stretch mb-xl-3">
                <div className="card-body scroll-y">
                  <div>
                    <div className="my-4 pb-3 border-bottom border-2">
                      <div className="my-5 text-gray-900 p-3 rounded active">
                        <KTSVG
                          path="/media/icons/duotune/general/gen172PopupMenu.svg"
                          className="svg-icon-2x"
                        />
                        <span className="text-primary fw-bolder h3 mx-2">
                          {intl.formatMessage({
                            id: "KnowledgeContentDisplay",
                          })}
                        </span>
                      </div>
                      <div
                        className="my-5 text-gray-900 p-3 rounded"
                        onClick={() => {
                          setShowGoal(true);
                        }}
                      >
                        <i className="bi bi-eye fa-xl text-muted"></i>
                        <span className="mx-2">
                          {intl.formatMessage({ id: "Goal" })}
                        </span>
                      </div>

                      <div>
                        <span className="text-gray-900 mx-2 p-3 px-5 pe-7">
                          {subKnowledge?.targets}
                        </span>
                      </div>
                    </div>
                    <div className="my-4">
                      {subKnowledge?.legislation ? (
                        <>
                          <div
                            className="my-5 text-gray-900 p-3 rounded"
                            onClick={() => {
                              setShowEvidence(true);
                            }}
                          >
                            <i className="fa-solid fa-magnifying-glass fa-xl text-muted"></i>
                            <span className="mx-2">
                              {intl.formatMessage({
                                id: "AdditionalNotes",
                              })}
                            </span>
                          </div>

                          <div>
                            <span className="text-gray-900 mx-2 p-3 px-5 pe-7">
                              {subKnowledge?.legislation}
                            </span>
                          </div>
                        </>
                      ) : (
                        <></>
                      )}

                      <div className="my-5 text-gray-900 p-3">
                        <span className="mx-2 text-primary fw-bolder h3">
                          {intl.formatMessage({
                            id: "AttachedFilesForStudying",
                          })}
                        </span>
                      </div>
                      <div className="my-4 text-gray-900 px-3">
                        {subKnowledge?.knowledgeAttachments?.map(
                          (file: any, index: number) => {
                            return (
                              <div className="mb-3" key={index}>
                                <img
                                  src={getIconSrcString(file?.filePath)}
                                  className="w-30px h-30px"
                                  alt="file"
                                />
                                <a
                                  href={`#`}
                                  key={file?.filePath}
                                  className="mx-2"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedAttachment(index);
                                  }}
                                >
                                  {file?.fileName}
                                </a>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-100 w-lg-850px ms-lg-7 ms-xl-10">
              <div className="card card-xl-stretch mb-xl-0 pb-4">
                <div className="card-body py-3 px-3 mx-8">
                  <div className="tab-content">
                    <div className="col-12 border-bottom border-2 py-4 mt-4">
                      <div className="d-flex justify-content-end">
                        <div className="d-flex  gap-2">
                          {subKnowledge?.date ? (
                            <>
                              <div>
                                <i className="fas fa-calendar-alt mx-2 text-muted fa-xl"></i>
                                <span className="text-muted">
                                  {intl.formatMessage({ id: "ReleaseDate" })}:{" "}
                                  {moment(subKnowledge?.date).format(
                                    "YYYY-MM-DD"
                                  )}
                                </span>
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                          {subKnowledge?.createdOn ? (
                            <>
                              <div>
                                <i className="fas fa-calendar-alt mx-2 text-muted fa-xl"></i>
                                <span className="text-muted">
                                  {intl.formatMessage({ id: "CreatedDate" })}:{" "}
                                  {moment(subKnowledge.createdOn).format(
                                    "YYYY-MM-DD"
                                  )}
                                </span>
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      <p className="text-primary fw-bolder">
                        {subKnowledge?.title}
                      </p>
                      <div className="my-5 text-muted">
                        {subKnowledge?.details}
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-8">
                        <div className="d-flex justify-content-between">
                          <div>
                            {subKnowledge?.workParticipants?.length !== 0 ? (
                              <p className="fw-bolder">
                                {intl.formatMessage({
                                  id: "ParticipantsWork",
                                })}{" "}
                                <span className="text-primary fs-5">
                                  {subKnowledge?.workParticipants?.length}
                                </span>
                              </p>
                            ) : null}
                            <div className="text-primary text-center">
                              <p>
                                {subKnowledge?.workParticipants?.map(
                                  (name: any, index) => {
                                    return (
                                      <span
                                        className="menu-link px-3 pe-none my-2"
                                        key={index}
                                      >
                                        {name.firstName + " " + name.secondName}
                                      </span>
                                    );
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="mx-8">
                            <p className="fw-bolder">
                              {intl.formatMessage({
                                id: "ParticipantEntity",
                              })}
                            </p>
                            <p className="text-primary text-center">
                              {subKnowledge?.participatingParties &&
                              subKnowledge.participatingParties.length > 0
                                ? intl.locale === "ar"
                                  ? subKnowledge.participatingParties[0]?.nameAr
                                  : subKnowledge.participatingParties[0]?.nameEn
                                : ""}
                            </p>
                          </div>
                        </div>
                        <div
                          onClick={() => setModalRShow(true)}
                          className="cursor-pointer"
                        >
                          {RatingItems(
                            subKnowledgeDetails?.knowledgeRates,
                            "fa-2x mx-2"
                          )}
                        </div>
                      </div>
                      <div className="row d-flex align-items-center my-8 shadow-sm py-5 h-100px">
                        <div className="col-sm-6 col-12 d-flex justify-content-between">
                          <div>
                            <p className="ms-2 fw-bolder">
                              {subKnowledge?.title +
                                " " +
                                `
                              (${subKnowledge?.knowledgeName})`}
                            </p>
                          </div>
                        </div>
                        <div className="col-sm-6 col-12 d-flex justify-content-end align-items-center">
                          <div
                            onClick={() => {
                              handleReaction(0, subKnowledge?.id);
                            }}
                            style={{
                              width: "fit-content",
                              cursor: "pointer",
                            }}
                            className="m-0 border border-1 rounded p-3 me-2"
                          >
                            <span
                              className={` ${
                                subKnowledge?.knowledgeLikes && "text-primary "
                              }`}
                            >
                              <i className="bi bi-hand-thumbs-up mx-2 fa-xl"></i>
                            </span>
                            <span
                              className={`${
                                subKnowledge?.knowledgeLikes && "text-primary"
                              }`}
                            >
                              {subKnowledge?.knowledgeLikes}
                            </span>
                          </div>
                          <div
                            onClick={() => {
                              handleReaction(1, subKnowledge?.id);
                            }}
                            style={{
                              width: "fit-content",
                              cursor: "pointer",
                            }}
                            className="m-0 border border-1 rounded p-3"
                          >
                            <span
                              className={`${
                                subKnowledge?.knowledgeDislikes &&
                                "text-danger "
                              }`}
                            >
                              <i className="bi bi-hand-thumbs-down mx-2 fa-xl"></i>
                            </span>
                            <span
                              className={`${
                                subKnowledge?.knowledgeDislikes &&
                                "text-danger "
                              }`}
                            >
                              {subKnowledge?.knowledgeDislikes}
                            </span>
                          </div>
                          <span
                            className="mx-2 mb-0"
                            role="button"
                            onClick={() =>
                              handleToggleFavorite(subKnowledge?.id)
                            }
                          >
                            <i
                              className={`bi bi-heart-fill mx-2 fa-xl ${
                                subKnowledgeDetails?.isFavoirate
                                  ? "text-danger"
                                  : "text-muted"
                              }`}
                            ></i>
                            <span>
                              {intl.formatMessage({ id: "Favorites" })}
                            </span>
                          </span>
                          <span className="mx-2 mb-0" role="button">
                            <i className="bi bi-eye mx-2 fa-xl"></i>
                            <span>
                              {subKnowledge?.knowledgeViews +
                                " " +
                                intl.formatMessage({ id: "View" })}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className=" mt-10">
                      <div className="col-md-12 col-sm-12 topics-units create-live explain">
                        {subKnowledge?.knowledgeAttachments?.length
                          ? getAttachmentComponent(
                              subKnowledge?.knowledgeAttachments[
                                selectedAttachment
                              ]
                            )
                          : ""}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="Rega_modal_add_rating" aria-hidden="true">
        <AddRatingPopup
          show={modalRShow}
          handleClose={() => setModalRShow(false)}
          setStars={setStars}
          ratingHandler={ratingHandler}
        />
      </div>
    </>
  );
};
