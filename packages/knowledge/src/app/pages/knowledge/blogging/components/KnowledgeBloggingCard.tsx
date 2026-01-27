import { FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useIntl } from "react-intl";
import AddComment from "../popup/add-comment";
import Blog from "../../../../models/blog";
import { toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";
import moment from "moment";
import { useDispatch } from "react-redux";
import {
  fetchBlogs,
  likeDislikeBlog,
  removeBlog,
} from "../../../../features/blog/blogSlice";
import EditPostBlogPopup from "../popup/edit-post-blog-popup";
import { DeletePopup } from "../popup/DeletePopup";
import { showSuccessAlert } from "@4eplatform/shared/services/helper";
import getIconSrcString from "@4eplatform/shared/functions/getIconSrcString";
import getIconSrc from "@4eplatform/shared/functions/getIconSrc";

interface blogProps {
  blog: Blog;
  page: Number;
}
const KnowledgeBloggingCard: FC<blogProps> = ({ blog, page }) => {
  const intl = useIntl();
  const [show, setShow] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [clickedId, setClickedId] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);
  let [selectedBlogId, setSelectedBlogId] = useState("");

  const dispatch = useDispatch();

  const handleReaction = async (value: any, id: string) => {
    if (!actionLoading) {
      setActionLoading(true);
      await dispatch(
        likeDislikeBlog({ blogId: id, likeStatus: value }) as any
      ).then((res: any) => {
        setActionLoading(false);
      });
    }
    let pageSize = page;
    await dispatch(fetchBlogs({ pageSize }) as any);
  };

  useEffect(() => {
    if (isDeleted) {
      dispatch(fetchBlogs({ pageSize: page }) as any);
    }
  }, [isDeleted]);

  useEffect(() => {
    if (confirmDelete) {
      dispatch(removeBlog(blog?.id) as any)?.then((res: any) => {
        if (res?.payload?.message === "" || res?.payload?.statusEnum === 1) {
          showSuccessAlert(true, "DeletedSuccessfully", intl);
          setIsDeleted(true);
        } else if (res?.payload?.message) {
          showSuccessAlert(false, "AnErrorOccured", intl);
        }
      });
    }
  }, [confirmDelete]);
  let baseUrl = (window as any)._env_?.REACT_APP_API_Blog_Url;

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
      firstName: checkUndefinedName(blog?.firstName),
      secondName: checkUndefinedName(blog?.secondName),
      thirdName: checkUndefinedName(blog?.thirdName),
      fourthName: checkUndefinedName(blog?.fourthName),
    });
  }, [blog]);

  return (
    <div className="d-flex position-relative justify-content-between w-100">
      <div className="card-header p-4 w-100 border-0 mb-15">
        <div className="d-flex justify-content-between align-items-start w-100 flex-wrap">
          {/* صورة واسم المستخدم */}
          <div className="d-flex justify-content-start align-items-center mb-3">
            <div className="w-45px h-45px">
              <img
                src={
                  blog?.userImgUrl
                    ? (window as any)._env_?.REACT_APP_API_User_Url +
                      "/" +
                      blog?.userImgUrl
                    : toAbsoluteUrl("/media/avatars/300-3.jpg")
                }
                onError={(e: any) =>
                  (e.target.src = toAbsoluteUrl("/media/avatars/300-3.jpg"))
                }
                className="w-100"
                alt="user profile"
              />
            </div>
            <div className="mx-2 px-1 d-flex flex-column">
              <div className="mb-1">
                {`${userData.firstName} ${
                  userData.secondName
                } ${checkUndefinedName(userData.thirdName)} ${
                  userData.fourthName
                }`.trim()}
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

          {/* أيقونات التعديل والحذف */}
          {localStorage.getItem("userId") === blog?.createdBy && (
            <div className="d-flex gap-5 mt-2">
              <i
                className="fas fa-pencil-alt fs-3 cursor-pointer text-primary"
                onClick={() => {
                  handleShowEdit();
                  setSelectedBlogId(blog?.id);
                }}
              ></i>
              <i
                className="far fa-trash-alt fs-3 cursor-pointer text-danger"
                onClick={() => {
                  handleShowDelete();
                  setSelectedBlogId(blog?.id);
                }}
              ></i>
            </div>
          )}
        </div>

        <div className="mt-2 w-100">
          <div className="py-1">
            <Link to={`/knowledge-blogging/blog-details/${blog.id}`}>
              <div>
                <h5 className="text-primary">{blog?.title}</h5>
              </div>
              <div className="pt-2">
                <p className="text-gray-700 mb-2">{blog?.description}</p>
              </div>

              {/* صورة البلوج الرئيسية */}
              <div className="py-2">
                {blog?.blogAttachments?.length > 0 ? (
                  blog?.blogAttachments?.some((item) =>
                    [".png", ".jpg", ".jpeg", ".jfif", ".webp"].some((ext) =>
                      item?.endsWith(ext)
                    )
                  ) ? (
                    blog?.blogAttachments
                      ?.filter((item) =>
                        [".png", ".jpg", ".jpeg", ".jfif", ".webp"].some(
                          (ext) => item?.endsWith(ext)
                        )
                      )
                      ?.slice(0, 1)
                      ?.map((item: string, index: number) => (
                        <img
                          key={index}
                          src={getIconSrc(item, { path: item }, baseUrl)}
                          className="w-100 pb-4 object-fit-cover"
                          style={{ maxHeight: "400px" }}
                          alt="Attachment"
                          onError={(e: any) =>
                            (e.target.src = `${toAbsoluteUrl(
                              "/media/theme-img/logo-login-col-en.png"
                            )}`)
                          }
                        />
                      ))
                  ) : (
                    <img
                      src={`${toAbsoluteUrl(
                        "/media/theme-img/logo-login-col-en.png"
                      )}`}
                      style={{ width: "100%", maxHeight: "400px" }}
                      alt="Attachment"
                      className="object-fit-cover"
                    />
                  )
                ) : (
                  <img
                    src={`${toAbsoluteUrl(
                      "/media/theme-img/logo-login-col-en.png"
                    )}`}
                    style={{ width: "100%", maxHeight: "400px" }}
                    alt="Attachment"
                    className="object-fit-cover"
                  />
                )}
              </div>

              {/* باقي المرفقات */}
              {blog?.blogAttachments?.length > 0 && (
                <div className="d-flex gap-3 flex-wrap">
                  {blog.blogAttachments
                    ?.filter((item) =>
                      [".png", ".jpg", ".jpeg", ".jfif", ".webp"].some((ext) =>
                        item?.endsWith(ext)
                      )
                    )
                    ?.map((item: string, index: number) =>
                      index > 0 ? (
                        <div className="d-flex my-6" key={index}>
                          <div className="border border-1 d-flex align-items-center cursor-pointer mb-2 mb-lg-0 p-2">
                            <a
                              href={
                                (window as any)._env_?.REACT_APP_API_Blog_Url +
                                "/" +
                                item
                              }
                              target="_blank"
                              className="mx-2"
                            >
                              <img
                                src={getIconSrc(item, { path: item }, baseUrl)}
                                width={"60px"}
                                height={"60px"}
                                className="object-fit-cover"
                                onError={(e: any) =>
                                  (e.target.src = "/media/img/IdeaBank.jpg")
                                }
                              />
                              <span className="fs-7 mt-1 mx-2">
                                {item?.split("/").slice(-1)[0]?.split(".")[0]}
                              </span>
                            </a>
                          </div>
                        </div>
                      ) : null
                    )}

                  {blog.blogAttachments
                    ?.filter(
                      (item) =>
                        !item?.endsWith(".png") &&
                        !item?.endsWith(".jpg") &&
                        !item?.endsWith(".jpeg") &&
                        !item?.endsWith(".jfif") &&
                        !item?.endsWith(".webp")
                    )
                    .map((item: string, index: number) => (
                      <div className="d-flex my-6" key={`attachment-${index}`}>
                        <div className="border border-1 d-flex align-items-center cursor-pointer mb-2 mb-lg-0 p-2">
                          <a
                            href={
                              (window as any)._env_?.REACT_APP_API_Blog_Url +
                              "/" +
                              item
                            }
                            target="_blank"
                            className="mx-2"
                          >
                            <img
                              src={getIconSrc(item, { path: item }, baseUrl)}
                              width={"60px"}
                              height={"60px"}
                              className="object-fit-cover"
                              onError={(e: any) =>
                                (e.target.src = `${toAbsoluteUrl(
                                  "/media/theme-img/logo-login-col-en.png"
                                )}`)
                              }
                            />
                            <span className="fs-7 mt-1 mx-2">
                              {item?.split("/").slice(-1)[0]?.split(".")[0]}
                            </span>
                          </a>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </Link>
          </div>

          {/* التفاعل مع المنشور */}
          <div className="d-flex justify-content-between align-items-md-center mt-2 pt-2 align-items-start flex-column-reverse flex-md-row">
            <Link to={`/knowledge-blogging/blog-details/${blog.id}`}>
              <div className="d-flex flex-wrap">
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleReaction(0, blog?.id);
                  }}
                  style={{
                    marginLeft: intl?.locale === "ar" ? "6.5px" : "",
                    marginRight: intl?.locale === "en" ? "6.5px" : "",
                  }}
                  className={`border border-1 d-flex align-items-center cursor-pointer mb-2 mb-lg-0 p-2 ${
                    blog?.isLiked ? "text-success" : "text-gray-700"
                  }`}
                >
                  <span className="d-flex align-items-center">
                    {intl.formatMessage({ id: "Like" })}
                    <i className="fa-regular fa-thumbs-up mx-1 fs-3 fa-fw"></i>
                  </span>
                  <span className="text-success px-1">{blog?.likeCount}</span>
                </div>

                <div
                  className={`border border-1 d-flex align-items-center cursor-pointer mb-2 mb-lg-0 p-2 ${
                    blog?.isDisliked ? "text-danger" : "text-gray-700"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleReaction(1, blog?.id);
                  }}
                >
                  <span className="d-flex align-items-center">
                    {intl.formatMessage({ id: "Dislike" })}
                    <i className="fa-regular fa-thumbs-down mx-1 fs-3 fa-fw"></i>
                  </span>
                  <span className="text-danger px-1">{blog?.disLikeCount}</span>
                </div>

                <div
                  className="border border-1 d-flex align-items-center cursor-pointer mb-2 mb-lg-0 p-2 mx-2"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleShow();
                    setClickedId(blog?.id);
                  }}
                >
                  <span className="d-flex align-items-center text-gray-700">
                    {intl.formatMessage({ id: "Comment" })}{" "}
                    <i className="fa-regular fa-comments mx-1 fs-4 fa-fw"></i>
                  </span>{" "}
                  <span className="text-primary px-1">
                    {blog?.commentCount}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="modal fade" id="Rega_modal_Delete" aria-hidden="true">
        <AddComment
          handleClose={handleClose}
          show={show}
          id={clickedId}
          page={page}
          commentFromOut={true}
        />
        {selectedBlogId == blog?.id ? (
          <>
            {" "}
            <EditPostBlogPopup
              handleClose={handleCloseEdit}
              show={showEdit}
              blog={blog}
            />
            <DeletePopup
              handleCloseDelete={handleCloseDelete}
              showDelete={showDelete}
              setConfirmDelete={setConfirmDelete}
            />
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export { KnowledgeBloggingCard };
