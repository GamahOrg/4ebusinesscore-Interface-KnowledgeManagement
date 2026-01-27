import { FC, useState } from "react";
import { KTSVG, toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";
import { DeletePopup } from "../../../partials/DeletePopup";
import { useIntl } from "react-intl";
import { useAppDispatch } from "../../../../store/store";
import { removeChallengeComment } from "../../../../features/comments/commentSlice";
import { fetchChallenge } from "../../../../features/challenge/challengeSlice";
import { showSuccessAlert } from "@4eplatform/shared/services/helper";

interface commentProps {
  comment?: any;
}

const ChallengeAdminComment: FC<commentProps> = ({ comment }) => {
  const intl = useIntl();
  const [showDelete, setShowDelete] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);

  const dispatch = useAppDispatch();
  const deleteHandler = async (id: string) => {
    await dispatch(removeChallengeComment(id) as any).then((res: any) => {
      showSuccessAlert(true, "DeletedSuccessfully", intl);
    });
    await dispatch(fetchChallenge(comment?.challengeId) as any);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-end align-items-md-center flex-column flex-md-row mb-8">
        <div className="d-flex justify-content-between align-items-start">
          <div className="w-50px h-50px flex-shrink-0">
            <img
              src={
                comment?.userImgUrl
                  ? (window as any)._env_?.REACT_APP_API_User_Url +
                    "/" +
                    comment?.userImgUrl
                  : toAbsoluteUrl("/media/avatars/300-3.jpg")
              }
              className="w-100 h-100 rounded-3"
              alt="profile"
            />
          </div>
          <div className="px-4 py-3 d-flex flex-column bg-light mx-2 rounded-2">
            <div className="mb-2">
              {comment?.firstName +
                " " +
                comment?.secondName +
                " " +
                comment?.thirdName +
                " " +
                comment?.fourthName}
            </div>
            <div className="text-gray-700">{comment?.description}</div>
          </div>
        </div>
        <div
          onClick={handleShowDelete}
          className="btn btn-outline-danger text-hover-white border border-1 border-danger mt-3 mt-md-0 mx-2 mx-md-0 flex-shrink-0 d-flex align-items-center"
        >
          {intl.formatMessage({ id: "DeleteComment" })}
          <span className="svg-icon svg-icon-3 mx-0">
            <KTSVG path="/media/icons/duotune/general/gen088.svg" />
          </span>
        </div>
      </div>

      <div className="modal fade" aria-hidden="true">
        <DeletePopup
          handleCloseDelete={handleCloseDelete}
          showDelete={showDelete}
          onConfirem={() => deleteHandler(comment?.id)}
        />
      </div>
    </>
  );
};

export { ChallengeAdminComment };
