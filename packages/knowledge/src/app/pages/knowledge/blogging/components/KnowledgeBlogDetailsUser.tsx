import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { RootState, useAppDispatch } from "../../../../store/store";
import { useParams } from "react-router-dom";
import { fetchBlog } from "../../../../features/blog/blogSlice";
import { useSelector } from "react-redux";
import moment from "moment";
import { toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";
import { BlogComments } from "./BlogComments";
import getIconSrc from "@4eplatform/shared/functions/getIconSrc";
import { Spinner } from "react-bootstrap";

const KnowledgeBlogDetailsUser: FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  let baseUrl = (window as any)._env_?.REACT_APP_API_Blog_Url;

  const [isLoading, setIsLoading] = useState(true);

  const { id: blog_id } = useParams();

  const getBlog = async (id: string) => {
    setIsLoading(true);
    await dispatch(fetchBlog(id) as any);
    setIsLoading(false);
  };
  useEffect(() => {
    if (blog_id) {
      getBlog(blog_id);
    }
  }, [blog_id]);

  const blog = useSelector((state: RootState) => {
    return state?.blogs?.data?.blog;
  });

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
    } else {
      return (
        <div className="d-inline py-2 px-3 fw-bolder fs-6 badgex badge-light-danger">
          {intl.formatMessage({ id: "Rejected" })}
        </div>
      );
    }
  };

  let loggedInUserId = localStorage?.getItem("userId");

  return (
    <>
      {!isLoading ? (
        <div className="card card-custom card-stretch gutter-b">
          <div className="card-body">
            <div className="d-flex justify-content-start">
              <div className="card-header p-4 d-flex flex-column w-100 border-0 mb-4 mb-md-5">
                <div className="d-flex justify-content-start align-items-center mb-3">
                  {blog?.userImgUrl ? (
                    <div className="w-50px h-50px">
                      <img
                        src={
                          (window as any)._env_?.REACT_APP_API_User_Url +
                          "/" +
                          blog?.userImgUrl
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
                      {blog?.firstName +
                        " " +
                        blog?.secondName +
                        " " +
                        blog?.thirdName +
                        " " +
                        blog?.fourthName}
                    </div>
                    <div className="text-gray-700">
                      {moment(blog?.createdOn).format("YYYY-MM-DD") +
                        " " +
                        intl.formatMessage({ id: "IN" }) +
                        " " +
                        moment
                          .tz(blog?.createdOn, "UTC")
                          .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                          .format("LT")}
                    </div>
                  </div>
                </div>
                {loggedInUserId === blog?.createdBy && (
                  <>
                    <div className="d-flex justify-content-start align-items-center mb-5">
                      <div className="text-muted mx-2 fs-5">
                        {intl.formatMessage({ id: "RequestStatus" })} :
                      </div>
                      <div>{getRequestStatus(blog?.requestStage)}</div>
                    </div>
                    <div className="d-flex justify-content-start align-items-center mb-5">
                      <div className="text-muted mx-2 fs-5">
                        {intl.formatMessage({ id: "Note" })} :
                      </div>
                      <div className="text-primary fs-4">{blog?.notes}</div>
                    </div>
                  </>
                )}
                <div className="mt-2 w-100 border-bottom border-1 pb-2 mb-3">
                  <div className="py-1">
                    <div>
                      <h5 className="text-primary">{blog?.title}</h5>
                    </div>
                    <div className="pt-2">
                      <p className="text-gray-700 mb-2">{blog?.description}</p>
                    </div>
                    <div className="py-2">
                      {Array.isArray(blog?.blogAttachments) &&
                      blog?.blogAttachments?.length > 0 ? (
                        blog?.blogAttachments?.filter(
                          (item: any) =>
                            item?.endsWith(".png") ||
                            item?.endsWith(".jpg") ||
                            item?.endsWith(".jpeg") ||
                            item?.endsWith(".jfif") ||
                            item?.endsWith(".webp")
                        )?.length > 0 ? (
                          blog?.blogAttachments
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
                                <>
                                  {
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
                                      onError={(e: any) => {
                                        e.target.src = `${toAbsoluteUrl(
                                          "/media/theme-img/logo-login-col-en.png"
                                        )}`;
                                      }}
                                    />
                                  }
                                </>
                              );
                            })
                        ) : (
                          <div className="py-2">
                            <img
                              src={`${toAbsoluteUrl(
                                "/media/theme-img/logo-login-col-en.png"
                              )}`}
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
                            src={`${toAbsoluteUrl(
                              "/media/theme-img/logo-login-col-en.png"
                            )}`}
                            style={{ width: "100%", maxHeight: "400px" }}
                            alt="Attachment"
                            className="object-fit-cover"
                          />
                        </div>
                      )}

                      {Array.isArray(blog?.blogAttachments) &&
                        blog?.blogAttachments?.length > 0 && (
                          <div className="d-flex gap-3 flex-wrap">
                            {blog?.blogAttachments
                              ?.filter(
                                (item: any) =>
                                  item?.endsWith(".png") ||
                                  item?.endsWith(".jpg") ||
                                  item?.endsWith(".jpeg") ||
                                  item?.endsWith(".jfif") ||
                                  item?.endsWith(".webp")
                              )
                              ?.map((item: string, index: number) => {
                                return (
                                  <>
                                    {index > 0 && (
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
                                    )}
                                  </>
                                );
                              })}
                            {blog?.blogAttachments
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
                                  <>
                                    {
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
                                              onError={(e: any) => {
                                                e.target.src = `${toAbsoluteUrl(
                                                  "/media/theme-img/logo-login-col-en.png"
                                                )}`;
                                              }}
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
                                    }
                                  </>
                                );
                              })}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
                {blog?.requestStage !== 3 ? <BlogComments /> : ""}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="d-flex gap-4 justify-content-center align-items-center py-4">
          {intl.formatMessage({ id: "LoadingData" })}
          <Spinner animation="border" variant="primary" />
        </div>
      )}
    </>
  );
};
export { KnowledgeBlogDetailsUser };
