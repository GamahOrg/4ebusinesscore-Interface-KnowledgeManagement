import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { KTSVG, toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";
import { DeletePopup } from "../../../partials/DeletePopup";
import { RootState, useAppDispatch } from "../../../../store/store";
import AddAnswer from "../popup/add-answer";
import {
  fetchIdeaComments,
  likeDislikeIdeaComment,
  removeIdeaComment,
} from "../../../../features/comments/commentSlice";
import { fetchIdea } from "../../../../features/idea/ideaSlice";
import "moment-timezone";
import moment from "moment";
import { useSelector } from "react-redux";
import { showSuccessAlert } from "@4eplatform/shared/services/helper";

interface IdeaCommentProps {
  comment: any;
  page?: Number;
}
const IdeaReplyOnComment: FC<IdeaCommentProps> = ({ comment, page }) => {
  const intl = useIntl();
  const userId = localStorage.getItem("userId");
  const Idea: any = useSelector((state: RootState) => {
    return state?.ideas.data.idea;
  });
  const [showDelete, setShowDelete] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [isLiked, setIsLiked] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const dispatch = useAppDispatch();

  const likeDislikehandler = async (status: number) => {
    if (!actionLoading) {
      setActionLoading(true);
      await dispatch(
        likeDislikeIdeaComment({
          ideaCommentId: comment?.id,
          likeStatus: status,
        }) as any
      ).then((res: any) => {
        setIsLiked((prevIsLiked) => !prevIsLiked);
      });
      setActionLoading(false);
    }
    let params = `${comment?.ideaBankId}?pageSize=${page}`;
    await dispatch(fetchIdeaComments(params) as any);
  };

  const deleteHandler = async (id: string) => {
    await dispatch(removeIdeaComment(id) as any).then((res: any) => {
      if (res.payload.statusEnum == 1) {
        showSuccessAlert(true, "DeletedSuccessfully", intl);
      }
    });
    await dispatch(fetchIdea(comment?.ideaBankId) as any);

    let params = `${comment?.ideaBankId}?pageSize=${page}`;

    await dispatch(fetchIdeaComments(params) as any);
  };

  const spanClassName = `fa-regular fa-thumbs-up mx-2 fs-4 fa-fw ${
    comment?.isLiked ? "text-success" : "text-gray-700"
  }`;
  const spanClassNameDanger = `fa-regular fa-thumbs-down mx-2 fs-4 fa-fw ${
    comment?.disLikeCount ? "text-danger" : "text-gray-700"
  }`;

  return (
    <>
      <div>
        <div className="d-flex flex-column flex-md-row justify-content-start align-items-start align-items-md-center flex-grow-1 align-items-top mb-3 py-3 py-md-1">
          <div className="d-flex align-items-start align-items-md-center justify-content-start justify-content-md-center flex-column flex-shrink-0">
            <div className="d-flex align-items-center justify-content-between w-100">
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
              <div className="d-flex align-items-start align-items-md-center flex-column ms-auto">
                <div className="mx-3">
                  <div>
                    {comment?.firstName +
                      " " +
                      comment?.secondName +
                      " " +
                      comment?.thirdName +
                      " " +
                      comment?.fourthName}
                  </div>
                  <span className="text-gray-500">
                    {comment?.createdOn.slice(0, 10)}
                  </span>
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between mt-2">
              <div>
                {moment
                  .tz(comment?.createdOn, "UTC")
                  .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                  .format("LT")}
              </div>
              <div className="d-flex mb-2 mb-md-0 mx-1">
                <div
                  className="btn-sm mx-1 bg-light d-flex align-items-center cursor-pointer text-success"
                  onClick={() => likeDislikehandler(0)}
                >
                  <i className={spanClassName}></i>
                  {comment?.likeCount}
                </div>
                <div
                  className="btn-sm mx-1 bg-light d-flex align-items-center cursor-pointer text-danger"
                  onClick={() => likeDislikehandler(1)}
                >
                  <i className={spanClassNameDanger}></i>
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
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
            <div className="mb-2 mx-md-2 px-md-2 w-100">
              <div className="d-flex flex-column flex-md-row w-100">
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                  <div className="d-flex flex-column mx-md-3">
                    <div className="text-gray-700 my-1 bg-light py-2 px-3 rounded-2">
                      {comment?.commentText}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {userId == comment?.createdBy || userId == Idea?.createdBy ? (
            <>
              {" "}
              <div
                onClick={handleShowDelete}
                className="btn btn-outline-danger text-hover-white border border-1 border-danger btn-sm mt-2 mt-md-0 mx-2 mx-md-0 flex-shrink-0 d-flex align-items-center"
              >
                {intl.formatMessage({ id: "DeleteComment" })}
                <span className="svg-icon svg-icon-3 mx-0">
                  <KTSVG path="/media/icons/duotune/general/gen088.svg" />
                </span>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
        {comment?.replies &&
          comment?.replies?.map((reply: any) => {
            return (
              <>
                <div className="px-8 mt-3 pt-2" key={reply?.id}>
                  <IdeaReplyOnComment comment={reply} page={page} />
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
        <div className="modal fade" id="Rega_modal_Delete" aria-hidden="true">
          <AddAnswer
            show={show}
            handleClose={handleClose}
            id={comment?.ideaBankId}
            parentId={comment?.id}
          />
        </div>
      </div>
    </>
  );
};

export { IdeaReplyOnComment };
