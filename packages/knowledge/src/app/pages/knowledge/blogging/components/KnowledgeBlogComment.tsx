import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { DeletePopup } from "../../../partials/DeletePopup";
import AddComment from "../popup/add-comment";
import { RootState, useAppDispatch } from "../../../../store/store";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import moment from "moment";
import { KTSVG, toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";
import {
  fetchBlogComments,
  likeDislikeBlogComment,
  removeBlogComment,
} from "../../../../features/comments/commentSlice";
import { showSuccessAlert } from "@4eplatform/shared/services/helper";
interface BlogCommentProps {
  comment: any;
  page: any;
}

const KnowledgeBlogComment: FC<BlogCommentProps> = ({ comment, page }) => {
  const intl = useIntl();
  let { id: blogId } = useParams();
  const dispatch = useAppDispatch();

  const [showDelete, setShowDelete] = useState(false);
  const [show, setShow] = useState(false);

  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [isLoading, setIsLoading] = useState(false);

  const deleteHandler = async (id: string) => {
    await dispatch(
      removeBlogComment(id || "fad3aeca-9521-4731-1eea-08dc26e7ac40") as any
    ).then((res: any) => {
      if (res.payload.statusEnum == 1) {
        showSuccessAlert(true, "DeletedSuccessfully", intl);
      }
    });

    let params = `${comment?.blogId}?pageSize=${page}`;

    await dispatch(fetchBlogComments(params) as any);
  };

  const likeDislikeHandler = async (value: Number) => {
    if (!isLoading) {
      setIsLoading(true);
      await dispatch(
        likeDislikeBlogComment({
          commentId: comment?.id,
          likeStatus: value,
        }) as any
      ).then((res: any) => {
        setIsLoading(false);
      });
      let params = `${comment?.blogId}?pageSize=${page}`;

      await dispatch(fetchBlogComments(params) as any);
    }
  };
  const blog = useSelector((state: RootState) => {
    return state?.blogs?.data?.blog;
  });

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
      firstName: checkUndefinedName(comment?.firstName),
      secondName: checkUndefinedName(comment?.secondName),
      thirdName: checkUndefinedName(comment?.thirdName),
      fourthName: checkUndefinedName(comment?.fourthName),
    });
  }, [comment]);
  return (
    <div>
      <div
        id="blog-comment"
        className="d-flex justify-content-start flex-grow-1 align-items-top mb-2 py-3 py-md-1 border-bottom"
      >
        <div className="w-50px h-50px flex-shrink-0">
          <img
            src={
              comment?.userImgUrl
                ? (window as any)._env_?.REACT_APP_API_User_Url +
                  "/" +
                  comment?.userImgUrl
                : toAbsoluteUrl("/media/avatars/300-3.jpg")
            }
            className="w-100 rounded-3"
            alt="profile"
            onError={(e: any) =>
              (e.target.src = toAbsoluteUrl("/media/avatars/300-3.jpg"))
            }
          />
        </div>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <div className="mb-2 mx-2 px-2 w-100">
            <div className="d-flex flex-column w-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex align-items-center flex-column flex-sm-row">
                  <div>
                    {`${userData.firstName} ${
                      userData.secondName
                    } ${checkUndefinedName(userData.thirdName)} ${
                      userData.fourthName
                    }`.trim()}{" "}
                  </div>
                  <span className="text-gray-700 mx-3">
                    {moment(comment?.createdOn).format("YYYY-MM-DD") +
                      " " +
                      intl.formatMessage({ id: "IN" }) +
                      " " +
                      moment
                        .tz(comment?.createdOn, "UTC")
                        .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                        .format("LT")}
                  </span>
                </div>
              </div>

              <div className="text-gray-700 py-1 py-md-0 my-1">
                {comment?.body}
              </div>

              <div className="d-flex mt-2">
                <div
                  className={`btn-sm mx-1 bg-light cursor-pointer ${
                    comment?.isLiked ? "text-success" : "text-gray-700"
                  }`}
                  onClick={() => likeDislikeHandler(0)}
                >
                  <i className="fa-regular fa-thumbs-up mx-1 fs-3 fa-fw"></i>
                  {comment?.likeCount}
                </div>
                <div
                  className={`btn-sm mx-1 bg-light cursor-pointer ${
                    comment?.isDisliked ? "text-danger" : "text-gray-700"
                  }`}
                  onClick={() => likeDislikeHandler(1)}
                >
                  <i className="fa-regular fa-thumbs-down mx-1 fs-3 fa-fw"></i>
                  {comment?.disLikeCount}
                </div>
                {comment?.parentId ===
                "00000000-0000-0000-0000-000000000000" ? (
                  <div
                    onClick={handleShow}
                    className="btn-sm mx-1 bg-light d-flex align-items-center cursor-pointer"
                  >
                    <i className="fa-regular fa-comments mx-2 fs-5 fa-fw"></i>
                    {comment?.replies?.length}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          {localStorage.getItem("userId") === comment?.createdBy ||
          localStorage.getItem("userId") == blog?.createdBy ? (
            <>
              <div className="d-flex justify-content-center align-items-center">
                <div
                  onClick={handleShowDelete}
                  className="btn btn-outline-danger text-hover-white border border-1 border-danger btn-sm mt-2 mt-md-0 mx-2 mx-md-0 flex-shrink-0 d-flex align-items-center"
                >
                  {intl.formatMessage({ id: "DeleteComment" })}
                  <span className="svg-icon svg-icon-3 mx-0">
                    <KTSVG path="/media/icons/duotune/general/gen088.svg" />
                  </span>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>

      {comment?.replies &&
        comment?.replies?.map((reply: any) => {
          return (
            <>
              <div className="px-8 mt-3 pt-2">
                <KnowledgeBlogComment comment={reply} page={page} />
              </div>
            </>
          );
        })}
      <div className="modal fade" aria-hidden="true">
        <DeletePopup
          handleCloseDelete={handleCloseDelete}
          showDelete={showDelete}
          onConfirem={() => deleteHandler(comment?.id)}
        />
      </div>
      <div className="modal fade" aria-hidden="true">
        <AddComment
          handleClose={handleClose}
          show={show}
          id={blogId}
          parentId={comment?.id}
          page={page}
          isReply={true}
        />
      </div>
    </div>
  );
};
export { KnowledgeBlogComment };
