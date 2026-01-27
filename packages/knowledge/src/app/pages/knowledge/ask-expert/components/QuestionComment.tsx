import { FC, useEffect, useState } from "react";
import { KTSVG, toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";
import { DeletePopup } from "../../../partials/DeletePopup";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { removeQuestionsComment } from "../../../../features/comments/commentSlice";
import { RootState } from "../../../../store/store";
import { getExpertsWithoutPagination } from "../../../../features/experts/expertsWithoutPaginationSlice";
import { showSuccessAlert } from "@4eplatform/shared/services/helper";
interface commentProps {
  comment: any;
}
const QuestionComment: FC<commentProps> = ({ comment }) => {
  const intl = useIntl();

  const [showDelete, setShowDelete] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);
  const question = useSelector((state: RootState) => {
    return state?.questions?.data?.question;
  });
  let loggedInUserId = localStorage.getItem("userId");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getExpertsWithoutPagination({}) as any);
  }, []);

  const deleteHandler = async (id: string) => {
    await dispatch(removeQuestionsComment(id) as any).then((res: any) => {
      showSuccessAlert(true, "DeletedSuccessfully", intl);
    });
  };

  let expertUserIds = useSelector((state: RootState) => {
    return state?.expertsWithoutPagination?.data?.map((expert) => {
      return expert?.userId;
    });
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
    <>
      <div className="d-flex flex-column flex-md-row  justify-content-md-between  align-items-md-center align-items-start  my-4">
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
              onError={(e: any) =>
                (e.target.src = toAbsoluteUrl("/media/avatars/300-3.jpg"))
              }
            />
          </div>
          <div className="px-4 py-3 d-flex flex-column bg-light mx-2 rounded-2">
            <div className="mb-2">
              {`${userData.firstName} ${
                userData.secondName
              } ${checkUndefinedName(userData.thirdName)} ${
                userData.fourthName
              }`.trim()}{" "}
              {question?.experts?.some(
                (expert: any) =>
                  expert.expertId === comment?.createdBy ||
                  expertUserIds?.includes(comment?.createdBy)
              ) ? (
                <>
                  <span className="mx-2">(</span>
                  <span className="text-success">
                    {intl.formatMessage({ id: "Expert" })}
                  </span>
                  <span className="mx-2">)</span>
                </>
              ) : (
                ""
              )}
            </div>
            <div className="text-gray-500">{comment?.body}</div>
          </div>
        </div>
        {question?.createdBy?.toLowerCase() ===
        comment?.createdBy?.toLowerCase() ? (
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
          onConfirem={() => deleteHandler(comment?.id)}
        />
      </div>
    </>
  );
};

export { QuestionComment };
