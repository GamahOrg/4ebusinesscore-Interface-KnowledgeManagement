import { Fragment, useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useIntl } from "react-intl";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchIdeas, likeDislike } from "../../../../features/idea/ideaSlice";
import { useDispatch } from "react-redux";
import { RootState } from "../../../../store/store";
import moment from "moment";
import "moment-timezone";
import EditIdeaPopup from "../popup/edit-idea-popup";
import { DeletePopup } from "../popup/DeletePopup";
import { SystemPagination } from "@4eplatform/shared/components/SystemPagination";
import getIconSrc from "@4eplatform/shared/functions/getIconSrc";
import { toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";
import { Spinner } from "react-bootstrap";

const baseUrl = (window as any)._env_?.REACT_APP_API_User_Url;

const IdeaCard = () => {
  const intl = useIntl();

  const [isLoading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);
  const dispatch = useDispatch();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const Ideas = useSelector((state: RootState) => {
    return state?.ideas.data.ideas;
  });
  const totalItems = useSelector((state: RootState) => {
    return state?.ideas?.data?.totalItems;
  });
  const totalPages = useSelector((state: RootState) => {
    return state?.ideas?.data?.totalPages;
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(fetchIdeas({ pageSize, pageNumber: pageIndex }) as any);
      setLoading(false);
    };
    fetchData();
  }, [pageSize, pageIndex]);

  const handleReaction = async (value: any, id: string) => {
    if (!actionLoading) {
      setActionLoading(true);
      await dispatch(
        likeDislike({ ideaBankId: id, likeStatus: value }) as any
      ).then((res: any) => {
        setActionLoading(false);
      });
      await dispatch(fetchIdeas({ pageSize, pageNumber: pageIndex }) as any);
    }
  };

  let location = useLocation();
  let cardId = location?.state?.cardId;
  let cardName =
    location?.state?.cardTitle || location?.state?.serviceName || "";

  let loggedInUserId = localStorage?.getItem("userId");
  let loggedInUserRole = JSON.parse(localStorage?.getItem("userInfo") || "");
  let [selectedIdeaId, setSelectedIdeaId] = useState("");
  const isAdmin = loggedInUserRole?.roles?.find(
    (role: any) => role?.roleId === "4450bea1-7bbf-43ce-ad43-e48a5b730583"
  );

  return (
    <>
      <div className="card card-xl-stretch mb-xl-8">
        <div className="my-5">
          <div className="card-body py-3 ">
            <Row className="gy-5">
              {!isLoading ? (
                Ideas?.length ? (
                  Ideas?.map((idea: any) => {
                    return (
                      <Fragment key={idea.id}>
                        <Col lg={4} md={6}>
                          <div
                            className="shadow p-4"
                            style={{ height: "470px" }}
                          >
                            <div
                              className="card h-100 w-100"
                              style={{ width: "336px" }}
                            >
                              <Link
                                to={`/knowledge-ideas-bank/knowledge-idea-bank-details/${idea.id}`}
                                state={{
                                  cardId: cardId,
                                  cardTitle: cardName,
                                }}
                              >
                                <div>
                                  <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                      {idea?.userImgUrl ? (
                                        <div className="w-50px h-50px">
                                          <img
                                            loading="lazy"
                                            src={
                                              (window as any)._env_
                                                ?.REACT_APP_API_User_Url +
                                              "/" +
                                              idea?.userImgUrl
                                            }
                                            className="w-100 rounded-3"
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
                                          {idea?.firstName +
                                            " " +
                                            idea?.secondName +
                                            " " +
                                            idea?.thirdName +
                                            " " +
                                            idea?.fourthName}
                                        </div>
                                        <div className="text-gray-700">
                                          {moment(idea?.createdOn).format(
                                            "YYYY-MM-DD"
                                          ) +
                                            " " +
                                            intl.formatMessage({ id: "IN" }) +
                                            " " +
                                            moment
                                              .tz(idea?.createdOn, "UTC")
                                              .tz(
                                                Intl.DateTimeFormat().resolvedOptions()
                                                  .timeZone
                                              )
                                              .format("LT")}
                                        </div>
                                      </div>
                                    </div>
                                    {loggedInUserId?.toLowerCase() ==
                                      idea?.createdBy?.toLowerCase() ||
                                    isAdmin?.roleId ? (
                                      <>
                                        <div className="d-flex gap-5 left-0 my-3 mx-5">
                                          {loggedInUserId?.toLowerCase() ==
                                            idea?.createdBy?.toLowerCase() && (
                                            <>
                                              <i
                                                className="fas fa-pencil-alt fs-3 cursor-pointer text-primary"
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  e.stopPropagation();
                                                  handleShowEdit();
                                                  setSelectedIdeaId(idea?.id);
                                                }}
                                              ></i>
                                            </>
                                          )}
                                          <i
                                            className="far fa-trash-alt fs-3 cursor-pointer text-danger"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              handleShowDelete();
                                              setSelectedIdeaId(idea?.id);
                                            }}
                                          ></i>
                                        </div>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                  <div className="d-flex gap-2 text-truncate mb-2 mt-5 px-2 w-90 text-primary">
                                    <label className="form-label">
                                      {intl.formatMessage({ id: "Title1" })} :
                                    </label>
                                    <p>{idea?.title}</p>
                                  </div>
                                  <div className="d-flex justify-content-between w-90 text-gray-700">
                                    <label className="form-label">
                                      {intl.formatMessage({
                                        id: "Description",
                                      })}
                                      :{" "}
                                      <span
                                        style={{
                                          fontSize: "12px",
                                          maxWidth: "200px",
                                          whiteSpace: "nowrap",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          display: "inline-block",
                                          verticalAlign: "bottom",
                                        }}
                                      >
                                        {idea?.description}
                                      </span>
                                    </label>

                                    <label className="form-label mb-5">
                                      {intl.formatMessage({
                                        id: "NumberOfAttachments",
                                      })}{" "}
                                      :{" "}
                                      <span className="text-primary">
                                        {idea?.ideaAttachments?.length}
                                      </span>
                                    </label>
                                  </div>

                                  {idea?.ideaAttachments?.length > 0 ? (
                                    idea?.ideaAttachments?.filter(
                                      (item: any) =>
                                        item?.endsWith(".png") ||
                                        item?.endsWith(".jpg") ||
                                        item?.endsWith(".jpeg") ||
                                        item?.endsWith(".jfif") ||
                                        item?.endsWith(".webp")
                                    )?.length > 0 ? (
                                      idea?.ideaAttachments
                                        ?.filter(
                                          (item: any) =>
                                            item?.endsWith(".png") ||
                                            item?.endsWith(".jpg") ||
                                            item?.endsWith(".jpeg") ||
                                            item?.endsWith(".jfif") ||
                                            item?.endsWith(".webp")
                                        )
                                        ?.slice(0, 1)
                                        ?.map((item: any, index: number) => {
                                          return (
                                            <div
                                              key={`attachment-${index}`}
                                              style={{
                                                height: "133px",
                                                cursor: "pointer",
                                              }}
                                              className="position-relative mb-2"
                                            >
                                              <img
                                                loading="lazy"
                                                alt="idea image"
                                                src={getIconSrc(
                                                  item,
                                                  { path: item },
                                                  baseUrl
                                                )}
                                                style={{
                                                  display: "inline-block",
                                                  height: "133px",
                                                }}
                                                className="mb-2 w-100 object-fit-cover"
                                                onError={(e: any) =>
                                                  (e.target.src = toAbsoluteUrl(
                                                    "/media/img/IdeaBank.jpg"
                                                  ))
                                                }
                                              />
                                            </div>
                                          );
                                        })
                                    ) : (
                                      <div className="py-2">
                                        <img
                                          loading="lazy"
                                          src={toAbsoluteUrl(
                                            "/media/img/IdeaBank.jpg"
                                          )}
                                          style={{
                                            width: "100%",
                                            height: "133px",
                                          }}
                                          alt="Attachment"
                                          className="object-fit-cover"
                                        />
                                      </div>
                                    )
                                  ) : (
                                    <div
                                      style={{
                                        height: "133px",
                                        cursor: "pointer",
                                      }}
                                      className="position-relative mb-2"
                                    >
                                      <img
                                        loading="lazy"
                                        alt="idea image"
                                        src={toAbsoluteUrl(
                                          "/media/img/IdeaBank.jpg"
                                        )}
                                        style={{
                                          display: "inline-block",
                                          height: "133px",
                                        }}
                                        className="mb-2 w-100 object-fit-cover"
                                      />
                                    </div>
                                  )}
                                </div>
                              </Link>
                              <div className="d-flex align-items-center justify-content-between">
                                <div
                                  style={{
                                    border: "1px solid #F2F2F2",
                                    width: "fit-content",
                                  }}
                                  className="p-2"
                                >
                                  <span
                                    className={`${
                                      idea?.commentCount
                                        ? "text-primary"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {intl.formatMessage({ id: "Comment" })}{" "}
                                  </span>
                                  <i
                                    className={`fa-regular fa-comments mx-1 fs-4 fa-fw ${
                                      idea?.commentCount
                                        ? "text-primary "
                                        : "text-gray-700"
                                    }`}
                                  ></i>
                                  <span
                                    className={`${
                                      idea?.commentCount
                                        ? "text-primary "
                                        : "text-gray-700"
                                    } mx-1`}
                                  >
                                    {idea?.commentCount}
                                  </span>
                                </div>
                                <div
                                  onClick={() => {
                                    handleReaction(0, idea?.id);
                                  }}
                                  style={{
                                    border: "1px solid #F2F2F2",
                                    width: "fit-content",
                                    cursor: "pointer",
                                  }}
                                  className="p-2 mx-3 "
                                >
                                  <span
                                    className={`${
                                      idea.isLikedByLoggedInUser
                                        ? "text-success "
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {intl.formatMessage({ id: "Like" })}{" "}
                                    <i
                                      className={`fa-regular fa-thumbs-up mx-1 fs-3 fa-fw `}
                                    ></i>
                                  </span>
                                  <span
                                    className={`${
                                      idea.isLikedByLoggedInUser
                                        ? "text-success "
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {idea?.likesCount}
                                  </span>
                                </div>
                                <div
                                  onClick={() => {
                                    handleReaction(1, idea?.id);
                                  }}
                                  style={{
                                    border: "1px solid #F2F2F2",
                                    width: "fit-content",
                                    cursor: "pointer",
                                  }}
                                  className="p-2"
                                >
                                  <span
                                    className={`${
                                      idea.isDisLikedByLoggedInUser
                                        ? "text-danger "
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {intl.formatMessage({ id: "Dislike" })}{" "}
                                    <i className="fa-regular fa-thumbs-down mx-1 fs-3 fa-fw"></i>
                                  </span>
                                  <span
                                    className={`${
                                      idea.isDisLikedByLoggedInUser
                                        ? "text-danger "
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {idea?.dislikesCount}
                                  </span>
                                </div>
                              </div>
                              <div className="d-flex align-items-center justify-content-start mt-3 mb-1">
                                <div
                                  style={{
                                    border: "1px solid rgb(242, 242, 242)",
                                    width: "fit-content",
                                  }}
                                  className={`p-2 ${
                                    idea?.ideaViews
                                      ? "text-primary"
                                      : "text-gray-700"
                                  }`}
                                >
                                  <span
                                    style={{
                                      display: "inline-block",
                                    }}
                                  >
                                    {intl.formatMessage({ id: "ViewIdeas" })}
                                  </span>
                                  <i className="fa-regular fa-eye mx-2 fs-3 fa-fw"></i>
                                  <span
                                    style={{
                                      display: "inline-block",
                                    }}
                                  >
                                    {idea?.ideaViews}
                                  </span>
                                </div>
                              </div>
                              <div className="d-flex justify-content-end">
                                <p
                                  className="mb-2 mx-1"
                                  style={{ color: "#A1A5B7" }}
                                >
                                  {idea.createdOn
                                    ? moment
                                        .tz(idea?.createdOn, "UTC")
                                        .tz(
                                          Intl.DateTimeFormat().resolvedOptions()
                                            .timeZone
                                        )
                                        .format("YYYY-MM-DD") +
                                      " " +
                                      intl.formatMessage({ id: "IN" }) +
                                      " " +
                                      moment
                                        .tz(idea?.createdOn, "UTC")
                                        .tz(
                                          Intl.DateTimeFormat().resolvedOptions()
                                            .timeZone
                                        )
                                        .format("LT")
                                    : null}
                                </p>
                              </div>
                            </div>
                          </div>
                          {selectedIdeaId == idea?.id && (
                            <>
                              <EditIdeaPopup
                                handleClose={handleCloseEdit}
                                show={showEdit}
                                idea={idea}
                              />
                              <DeletePopup
                                id={idea.id}
                                handleCloseDelete={handleCloseDelete}
                                showDelete={showDelete}
                              />
                            </>
                          )}
                        </Col>
                      </Fragment>
                    );
                  })
                ) : (
                  <div className=" py-10 text-center">
                    <p> {intl.formatMessage({ id: "NotYetIdeas" })}</p>
                  </div>
                )
              ) : (
                <div className="d-flex gap-4 justify-content-center align-items-center py-4">
                  {intl.formatMessage({ id: "LoadingData" })}
                  <Spinner animation="border" variant="primary" />
                </div>
              )}
            </Row>
            {!isLoading && Ideas && Ideas?.length > 0 && (
              <div className="mt-4">
                <SystemPagination
                  totalPages={totalPages}
                  totalItems={totalItems}
                  pageIndex={pageIndex}
                  pageSize={pageSize}
                  setPageIndex={setPageIndex}
                  setPageSize={setPageSize}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export { IdeaCard };
