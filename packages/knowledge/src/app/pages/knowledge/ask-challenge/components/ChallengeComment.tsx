import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { KTSVG, toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";
import { DeletePopup } from "../popup/DeletePopup";
import { removeChallengeComment } from "../../../../features/comments/commentSlice";
import { useAppDispatch } from "../../../../store/store";
import { fetchChallenge } from "../../../../features/challenge/challengeSlice";
import { showSuccessAlert } from "@4eplatform/shared/services/helper";
interface commentProps {
  comment: any;
  setChangeState: any;
}
const ChallengeComment: FC<commentProps> = ({ comment, setChangeState }) => {
  const intl = useIntl();
  const [showDelete, setShowDelete] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);
  const dispatch = useAppDispatch();

  const deleteHandler = async (id: string) => {
    await dispatch(removeChallengeComment(id) as any).then((res: any) => {
      if (
        res?.payload?.message == "CommentIsDeletedSuccessfully" &&
        res?.payload?.statusEnum == 1
      ) {
        showSuccessAlert(true, "DeletedSuccessfully", intl);
        setChangeState(true);
      } else if (res?.payload?.message) {
        showSuccessAlert(false, "AnErrorOccured", intl);
      }
    });
    await dispatch(fetchChallenge(comment?.challengeId) as any);
  };

  let loggedInUserId = localStorage?.getItem("userId");
  let loggedInUserRole = JSON.parse(localStorage?.getItem("userInfo") || "");
  const isAdmin = loggedInUserRole?.roles?.find(
    (role: any) => role?.roleId === "4450bea1-7bbf-43ce-ad43-e48a5b730583"
  );

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
    <>
      <div className="d-flex justify-content-between align-items-center mb-8 gap-2 flex-md-row flex-column">
        <div className="d-flex justify-content-between align-items-start w-100 ">
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
              onError={(e: any) =>
                (e.target.src = toAbsoluteUrl("/media/avatars/300-3.jpg"))
              }
            />
          </div>
          <div
            style={{ marginRight: ".5rem" }}
            className="px-4 py-3 d-flex flex-column bg-light rounded-2 w-100"
          >
            <div className="mb-2">
              {`${userData.firstName} ${
                userData.secondName
              } ${checkUndefinedName(userData.thirdName)} ${
                userData.fourthName
              }`.trim()}{" "}
            </div>
            <div
              className="text-gray-700 "
              style={{
                whiteSpace: "normal",
                wordBreak: "break-word",
              }}
            >
              {comment?.description}
            </div>
          </div>
        </div>
        {loggedInUserId?.toLowerCase() == comment?.createdBy?.toLowerCase() ||
        isAdmin?.roleId ? (
          <>
            <div
              onClick={handleShowDelete}
              className="btn btn-outline-danger text-hover-white border border-1 border-danger mt-3 mt-md-0 mx-2 mx-md-0 flex-shrink-0 d-flex align-items-center"
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

      <div className="modal fade" aria-hidden="true">
        <DeletePopup
          handleCloseDelete={handleCloseDelete}
          showDelete={showDelete}
          handleDelete={() => deleteHandler(comment?.id)}
          id={comment?.id}
        />
      </div>
    </>
  );
};

export { ChallengeComment };
