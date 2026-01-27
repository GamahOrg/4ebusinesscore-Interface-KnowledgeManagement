import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { IdeaRating } from "./IdeaRating";
import AddAnswer from "../popup/add-answer";
import { useAppDispatch } from "../../../../store/store";
import { useSelector } from "react-redux";
import { fetchIdea, likeDislike } from "../../../../features/idea/ideaSlice";
import { RootState } from "../../../../store/store";
import { Navigate, useParams } from "react-router-dom";
import IdeaComments from "./IdeaComments";
import { ReactionState } from "../../../../enums/enums";
import moment from "moment";
import getIconSrc from "@4eplatform/shared/functions/getIconSrc";
import { Spinner } from "react-bootstrap";
import { toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";

const baseUrl = (window as any)._env_?.REACT_APP_API_User_Url;

const IdeaDetails: FC = () => {
  const intl = useIntl();

  const [pageSize, setPageSize] = useState(10);

  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [isLiked, setIsLiked] = useState<ReactionState>(
    ReactionState.NotLikedOrDisliked
  );
  const { id: idea_id } = useParams();
  const dispatch = useAppDispatch();
  const [actionLoading, setActionLoading] = useState(false);

  const Idea: any = useSelector((state: RootState) => {
    return state?.ideas.data.idea;
  });

  const ideaStatus = useSelector((state: RootState) => {
    return state?.ideas.status;
  });

  const handleReaction = async (value: any) => {
    if (!actionLoading) {
      setActionLoading(true);
      await dispatch(
        likeDislike({ ideaBankId: idea_id, likeStatus: value }) as any
      ).then((res: any) => {
        setActionLoading(false);
        if (res.payload.statusEnum === 1) {
          if (value === isLiked) {
            setIsLiked((prev) => -1);
          } else {
            setIsLiked((prev) => value);
          }
        }
      });
      await dispatch(fetchIdea(idea_id) as any);
    }
  };

  const getIdea = async (id: string) => {
    setIsLoading(true);
    await dispatch(fetchIdea(id) as any);
    setIsLoading(false);
  };
  useEffect(() => {
    if (idea_id) {
      getIdea(idea_id);
    }
  }, [idea_id]);

  useEffect(() => {
    if (Idea) {
      if (Idea.isLikedByLoggedInUser) {
        setIsLiked((prev) => 0);
      } else if (Idea.isDisLikedByLoggedInUser) {
        setIsLiked((prev) => 1);
      } else {
        setIsLiked((prev) => -1);
      }
    }
  }, [Idea]);

  const [activeTab, setActiveTab] = useState("pane_comments");

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const getRequestStatus = (requestStatus: any) => {
    if (requestStatus === 1) {
      return (
        <div className="d-inline py-2 px-3 fw-bolder fs-6 badgex badge-light-warning">
          {intl.formatMessage({ id: "WaitingForApproval" })}
        </div>
      );
    } else if (requestStatus === 2) {
      return (
        <div className="d-inline py-2 px-7 fw-bolder fs-6 badgex badge-light-success">
          {intl.formatMessage({ id: "HasBeenApproved" })}
        </div>
      );
    } else if (requestStatus === 4) {
      return (
        <div className="d-inline py-2 px-7 fw-bolder fs-6 badgex badge-light-primary">
          {intl.formatMessage({ id: "AcceptAndNotPublished" })}
        </div>
      );
    } else if (requestStatus === 3) {
      return (
        <div className="d-inline py-2 px-3 fw-bolder fs-6 badgex badge-light-danger">
          {intl.formatMessage({ id: "Rejected" })}
        </div>
      );
    }
  };

  const checkUndefinedName = (name: any) => {
    if (
      name == "undefined" ||
      name == "null" ||
      name == undefined ||
      name == null
    ) {
      return "";
    } else {
      return name;
    }
  };

  const [userData, setUserData] = useState({
    firstName: "",
    secondName: "",
    thirdName: "",
    fourthName: "",
  });

  useEffect(() => {
    setUserData({
      firstName: checkUndefinedName(Idea?.firstName),
      secondName: checkUndefinedName(Idea?.secondName),
      thirdName: checkUndefinedName(Idea?.thirdName),
      fourthName: checkUndefinedName(Idea?.fourthName),
    });
  }, [Idea]);

  let loggedInUserId = localStorage?.getItem("userId");

  return (
    <>
      {isLoading ? (
        <div className="d-flex gap-4 justify-content-center align-items-center py-4">
          {intl.formatMessage({ id: "LoadingData" })}
          <Spinner animation="border" variant="primary" />
        </div>
      ) : Idea ? (
        <div className="card card-custom card-stretch gutter-b">
          <div className="card-body">
            <div className="d-flex justify-content-start">
              <div className="card-header p-4 d-flex flex-column w-100 border-0 mb-4 mb-md-5">
                <div className="d-flex justify-content-start align-items-center mb-3">
                  {Idea?.userImgUrl ? (
                    <div className="w-50px h-50px">
                      <img
                        src={
                          (window as any)._env_?.REACT_APP_API_User_Url +
                          Idea?.userImgUrl
                        }
                        className="w-100 rounded-3 object-fit-cover"
                        alt="profile"
                        onError={(e: any) =>
                          (e.target.src = toAbsoluteUrl(
                            "/media/avatars/300-3.jpg"
                          ))
                        }
                      />
                    </div>
                  ) : null}

                  <div className="mx-2 px-1 d-flex flex-column w-100">
                    <div className="mb-1">
                      {`${userData.firstName} ${
                        userData.secondName
                      } ${checkUndefinedName(userData.thirdName)} ${
                        userData.fourthName
                      }`.trim()}{" "}
                    </div>
                    <div className="text-gray-700">
                      {moment(Idea?.createdOn).format("YYYY-MM-DD") +
                        " " +
                        intl.formatMessage({ id: "IN" }) +
                        " " +
                        moment
                          .tz(Idea?.createdOn, "UTC")
                          .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                          .format("LT")}
                    </div>
                  </div>
                </div>
                {loggedInUserId === Idea?.createdBy && (
                  <>
                    <div className="d-flex justify-content-start align-items-center mb-5">
                      <div className="text-muted mx-2 fs-5">
                        {intl.formatMessage({ id: "RequestStatus" })} :
                      </div>
                      <div>{getRequestStatus(Idea?.requestStage)}</div>
                    </div>
                    <div className="d-flex justify-content-start align-items-center mb-5">
                      <div className="text-muted mx-2 fs-5">
                        {intl.formatMessage({ id: "Note" })} :
                      </div>
                      <div className="text-primary fs-4">{Idea?.notes}</div>
                    </div>
                  </>
                )}
                <div className="d-flex justify-content-between align-items-center mt-5 text-dark">
                  <div className="d-flex gap-4">
                    <label className="form-label">
                      {intl.formatMessage({ id: "Title1" })} :{" "}
                    </label>
                    <h5 className="text-primary">{Idea?.title}</h5>
                  </div>
                  <div>
                    {Idea?.likesCount ? (
                      <div className="badge badge-success">
                        {Idea?.likesCount}{" "}
                        {intl.formatMessage({ id: "Supporter" })}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="mt-2 w-100 pb-2 mb-5">
                  <div className="py-1">
                    <div className="pt-2 d-flex pb-2 flex-wrap">
                      <label className="form-label">
                        {intl.formatMessage({ id: "Description" })} :{" "}
                      </label>
                      <p className="text-gray-700 mb-4"> {Idea?.description}</p>
                    </div>
                    <div className="pt-2 d-flex gap-4 pb-2">
                      <label className="form-label">
                        {intl.formatMessage({ id: "InputType" })} :{" "}
                      </label>
                      <p className="mb-4">
                        {" "}
                        {intl.locale === "ar"
                          ? Idea?.lk_InputTypeNameAr
                          : Idea?.lk_InputTypeNameEn}
                      </p>
                    </div>
                    <div className="pt-2 d-flex gap-4 pb-2">
                      <label className="form-label">
                        {intl.formatMessage({ id: "IdeaCategory" })} :{" "}
                      </label>
                      <p className="mb-4">
                        {" "}
                        {intl.formatMessage({
                          id:
                            Idea?.ideaCategory === 0
                              ? "RelatedToBusinessImprovement"
                              : Idea?.ideaCategory === 1
                              ? "RelatedToDevelopingTheWorkEnvironment"
                              : Idea?.ideaCategory === 2
                              ? "RelatedToAnEventProposal"
                              : Idea?.ideaCategory === 3
                              ? "RelatedToATechnicalDevelopmentProposal"
                              : Idea?.ideaCategory === 4
                              ? "RelatedToTheRealEstateSystem"
                              : Idea?.ideaCategory === 5
                              ? "Anideatosolveaproblem"
                              : Idea?.ideaCategory === 6
                              ? "RelatedToImprovingAnExistingProject"
                              : "Newidea",
                        })}
                      </p>
                    </div>

                    <div>
                      <label className="form-label mb-5">
                        {intl.formatMessage({ id: "Attachments" })} :{" "}
                      </label>

                      {Idea?.ideaAttachments?.length > 0 ? (
                        Idea?.ideaAttachments?.filter(
                          (item: any) =>
                            item?.endsWith(".png") ||
                            item?.endsWith(".jpg") ||
                            item?.endsWith(".jpeg") ||
                            item?.endsWith(".jfif") ||
                            item?.endsWith(".webp")
                        )?.length > 0 ? (
                          Idea?.ideaAttachments
                            ?.filter(
                              (item: any) =>
                                item?.endsWith(".png") ||
                                item?.endsWith(".jpg") ||
                                item?.endsWith(".jpeg") ||
                                item?.endsWith(".jfif") ||
                                item?.endsWith(".webp")
                            )
                            ?.slice(0, 1)
                            ?.map((item: string, index: number) => {
                              return (
                                <img
                                  key={index}
                                  src={getIconSrc(
                                    item,
                                    { path: item },
                                    baseUrl
                                  )}
                                  className="w-100 pb-4 object-fit-cover"
                                  style={{ maxHeight: "400px" }}
                                  alt="Attachment"
                                  onError={(e: any) =>
                                    (e.target.src = "/media/img/IdeaBank.jpg")
                                  }
                                />
                              );
                            })
                        ) : (
                          <div className="py-2">
                            <img
                              src="/media/img/IdeaBank.jpg"
                              style={{
                                width: "100%",
                                maxHeight: "400px",
                              }}
                              alt="Attachment"
                              className="object-fit-cover"
                            />
                          </div>
                        )
                      ) : (
                        <div className="py-2">
                          <img
                            src="/media/img/IdeaBank.jpg"
                            style={{ width: "100%", maxHeight: "400px" }}
                            alt="Attachment"
                            className="object-fit-cover"
                          />
                        </div>
                      )}

                      {Idea?.ideaAttachments.length > 0 && (
                        <div className="d-flex gap-3 flex-wrap">
                          {Idea?.ideaAttachments
                            ?.filter(
                              (item: any) =>
                                item?.endsWith(".png") ||
                                item?.endsWith(".jpg") ||
                                item?.endsWith(".jpeg") ||
                                item?.endsWith(".jfif") ||
                                item?.endsWith(".webp")
                            )
                            .map((item: string, index: number) => {
                              return (
                                index > 0 && (
                                  <div className="d-flex my-6" key={index}>
                                    <div className="border border-1 d-flex align-items-center cursor-pointer mb-2 mb-lg-0 p-2">
                                      <a
                                        key={index}
                                        href={
                                          (window as any)._env_
                                            ?.REACT_APP_API_Blog_Url +
                                          "/" +
                                          item
                                        }
                                        target="blank"
                                        className="mx-2"
                                      >
                                        <img
                                          src={getIconSrc(
                                            item,
                                            { path: item },
                                            baseUrl
                                          )}
                                          width={"60px"}
                                          height={"60px"}
                                          className="object-fit-cover"
                                          onError={(e: any) =>
                                            (e.target.src =
                                              "/media/img/IdeaBank.jpg")
                                          }
                                        />
                                        <span className="fs-7 mt-1 mx-2">
                                          {
                                            item
                                              ?.split("/")
                                              ?.slice(-1)[0]
                                              ?.split(".")[0]
                                          }
                                        </span>
                                      </a>
                                    </div>
                                  </div>
                                )
                              );
                            })}
                          {Idea?.ideaAttachments
                            ?.filter(
                              (item: any) =>
                                !item?.endsWith(".png") &&
                                !item?.endsWith(".jpg") &&
                                !item?.endsWith(".jpeg") &&
                                !item?.endsWith(".jfif") &&
                                !item?.endsWith(".webp")
                            )
                            .map((item: string, index: number) => {
                              return (
                                <div
                                  className="d-flex my-6"
                                  key={`attachment-${index}`}
                                >
                                  <div className="border border-1 d-flex align-items-center cursor-pointer mb-2 mb-lg-0 p-2">
                                    <a
                                      href={
                                        (window as any)._env_
                                          ?.REACT_APP_API_Blog_Url +
                                        "/" +
                                        item
                                      }
                                      target="blank"
                                      className="mx-2"
                                    >
                                      <img
                                        src={getIconSrc(
                                          item,
                                          { path: item },
                                          baseUrl
                                        )}
                                        width={"60px"}
                                        height={"60px"}
                                        className="object-fit-cover"
                                        onError={(e: any) =>
                                          (e.target.src =
                                            "/media/img/IdeaBank.jpg")
                                        }
                                      />
                                      <span className="fs-7 mt-1 mx-2">
                                        {
                                          item
                                            ?.split("/")
                                            ?.slice(-1)[0]
                                            ?.split(".")[0]
                                        }
                                      </span>
                                    </a>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  </div>

                  {Idea?.requestStage !== 3 && Idea?.requestStage !== 4 ? (
                    <div className="d-flex justify-content-between align-items-md-center mt-2 pt-2 align-items-start flex-column-reverse flex-md-row">
                      <div className="d-flex flex-wrap">
                        <div
                          style={{
                            marginLeft: intl?.locale == "ar" ? "6.5px" : "",
                            marginRight: intl?.locale == "en" ? "6.5px" : "",
                          }}
                          className="border border-1 d-flex align-items-center cursor-pointer mb-2 mb-lg-0 p-2"
                          onClick={() => {
                            handleReaction(0);
                          }}
                        >
                          <span
                            className={`d-flex align-items-center ${
                              isLiked == 0 ? "text-success" : "text-gray-700"
                            }`}
                          >
                            {intl.formatMessage({ id: "Like" })}
                            <i className="fa-regular fa-thumbs-up mx-1 fs-3 fa-fw"></i>
                          </span>
                          <span className="text-success px-1">
                            {Idea?.likesCount}
                          </span>
                        </div>
                        <div
                          onClick={() => {
                            handleReaction(1);
                          }}
                          className="border border-1 d-flex align-items-center cursor-pointer mb-2 mb-lg-0 p-2 mx-2"
                        >
                          <span
                            className={`d-flex align-items-center ${
                              isLiked == 1 ? "text-danger" : "text-gray-700"
                            }`}
                          >
                            {intl.formatMessage({ id: "Dislike" })}
                            <i className="fa-regular fa-thumbs-down mx-1 fs-3 fa-fw"></i>
                          </span>
                          <span className="text-danger px-1">
                            {Idea?.dislikesCount}
                          </span>
                        </div>

                        <div
                          onClick={handleShow}
                          className="border border-1 d-flex align-items-center cursor-pointer mb-2 mb-lg-0 p-2 mx-2"
                        >
                          <span
                            className={`d-flex align-items-center ${
                              Idea.commentsCount
                                ? "text-primary "
                                : "text-gray-700"
                            }`}
                          >
                            {intl.formatMessage({ id: "Comment" })}
                            <i className="fa-regular fa-comments mx-1 fs-4 fa-fw"></i>
                          </span>
                          {Idea?.commentsCount ? (
                            <span className="text-primary px-1">
                              {Idea?.commentsCount}
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <div className="mx-2 p-2">
                        {moment
                          .tz(Idea?.createdOn, "UTC")
                          .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                          .format("YYYY-MM-DD") +
                          " " +
                          intl.formatMessage({ id: "IN" }) +
                          " " +
                          moment
                            .tz(Idea?.createdOn, "UTC")
                            .tz(
                              Intl.DateTimeFormat().resolvedOptions().timeZone
                            )
                            .format("LT")}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                {Idea?.requestStage !== 3 && Idea?.requestStage !== 4 ? (
                  <ul className="nav nav-tabs nav-line-tabs nav-line-tabs-2x mb-5 fs-6 p-0">
                    <li className="nav-item">
                      <a
                        className={`nav-link text-gray-700 ${
                          activeTab === "pane_comments" ? "active" : ""
                        }`}
                        onClick={() => handleTabChange("pane_comments")}
                      >
                        {intl.formatMessage({ id: "Comments" })}
                      </a>
                    </li>
                  </ul>
                ) : (
                  ""
                )}
                {Idea?.requestStage !== 3 && Idea?.requestStage !== 4 ? (
                  <div className="tab-content" id="myTabContent">
                    <div
                      className={`tab-pane fade ${
                        activeTab === "pane_comments" ? "show active" : ""
                      }`}
                      id="pane_comments"
                      role="tabpanel"
                    >
                      <div>
                        <div id="CommentsArea">
                          <IdeaComments
                            ideaId={Idea?.id}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      className={`tab-pane fade ${
                        activeTab === "pane_rating" ? "show active" : ""
                      }`}
                      id="pane_rating"
                      role="tabpanel"
                    >
                      <div id="RatingArea">
                        {Idea && (
                          <IdeaRating
                            idea={Idea}
                            update={ideaStatus}
                            pageSize={pageSize}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          <div className="modal fade" id="Rega_modal_Delete" aria-hidden="true">
            <AddAnswer
              show={show}
              handleClose={handleClose}
              id={idea_id}
              page={pageSize}
            />
          </div>
        </div>
      ) : (
        <Navigate to="/knowledge-ideas-bank" />
      )}
    </>
  );
};
export { IdeaDetails };
