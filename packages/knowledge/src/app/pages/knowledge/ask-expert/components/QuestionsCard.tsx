import { useNavigate } from "react-router-dom";
import { QuestionsModel } from "../../../../models/Questions";
import { KTSVG, toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";
import moment from "moment";
import { useIntl } from "react-intl";
import "moment-timezone";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { DeleteQuestionPopup } from "../../my-questions/popup/delete-question-popup";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserRoles } from "../../../../features/knowledge/PrivateknowledgeSlice";
import { RootState } from "../../../../store/store";

interface QuestionProps {
  question: QuestionsModel;
  pageIndex: any;
  pageSize: any;
  setAllQuestions?: any;
}
const QuestionCard = ({
  question,
  pageIndex,
  pageSize,
  setAllQuestions,
}: QuestionProps) => {
  const intl = useIntl();

  let location = useLocation();
  let cardId = location?.state?.cardId;
  let cardName =
    location?.state?.cardTitle || location?.state?.serviceName || "";
  const navigate = useNavigate();
  const RootUrl = (window as any)._env_?.REACT_APP_API_AskExpert_Url + "/";
  const userLogged = localStorage.getItem("userId");
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  let userId = JSON.parse(localStorage.getItem("userInfo") as string)?.id;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      fetchUserRoles({ id: userId, pageSize: 10000, pageNumber: 1 }) as any
    );
  }, []);
  const userRoles = useSelector((state: RootState) => {
    return state?.Privateknowledge?.userRoles;
  });

  let isHasSystemAdmin =
    userRoles?.filter((role: any) => {
      return role?.roleNameAr === "مدير النظام";
    })?.length > 0
      ? true
      : false;

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
      firstName: checkUndefinedName(question?.firstName),
      secondName: checkUndefinedName(question?.secondName),
      thirdName: checkUndefinedName(question?.thirdName),
      fourthName: checkUndefinedName(question?.fourthName),
    });
  }, [question]);

  return (
    <>
      <div className="card shadow-sm p-4 rounded pb-1 ">
        <div className="card-body p-0">
          <div className="d-flex justify-content-between mb-10">
            <div
              className="d-flex gap-5 cursor-pointer"
              onClick={() =>
                navigate(
                  `/knowledge-ask-expert/knowledge-question-details/${question.id}`,
                  {
                    state: { serviceName: cardName },
                  }
                )
              }
            >
              <div className="symbol symbol-75px">
                <img
                  alt="Pic"
                  src={
                    question.userImgUrl
                      ? RootUrl + question.userImgUrl
                      : toAbsoluteUrl("/media/avatars/300-3.jpg")
                  }
                  onError={(e: any) =>
                    (e.target.src = toAbsoluteUrl("/media/avatars/300-3.jpg"))
                  }
                />
              </div>
              <div className="d-flex flex-column align-items-right">
                <span className="mb-1 fs-5">
                  {`${userData.firstName} ${
                    userData.secondName
                  } ${checkUndefinedName(userData.thirdName)} ${
                    userData.fourthName
                  }`.trim()}{" "}
                </span>
                {question?.specializationNameAr ? (
                  <span className="mb-1 text-gray-400">
                    {question?.specializationNameAr}
                  </span>
                ) : (
                  ""
                )}
                <span className="mb-1 text-gray-400">
                  {moment(question?.createdOn).format("YYYY-MM-DD")}{" "}
                  {moment
                    .tz(question?.createdOn, "UTC")
                    .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                    .format("LT")}
                </span>
              </div>
            </div>
            <div
              className="h-auto cursor-pointer"
              onClick={() =>
                navigate(
                  `/knowledge-my-questions/knowledge-my-question-details/${question.id}`,
                  {
                    state: { serviceName: cardName },
                  }
                )
              }
            >
              {question?.commentCount > 0 ? (
                <p className="text-success rounded badgex badge-light-success px-3 py-1">
                  {intl.formatMessage({ id: "Answered" })}
                </p>
              ) : (
                <div className="text-warning rounded badgex badge-light-warning px-5 py-1">
                  {intl.formatMessage({ id: "New" })}
                </div>
              )}
            </div>
            {question?.createdBy === userLogged || isHasSystemAdmin ? (
              <>
                <div className="d-flex gap-3 py-1">
                  {question?.commentCount === 0 ? <></> : <></>}
                  <span
                    className="svg-icon svg-icon-3 cursor-pointer text-danger"
                    onClick={(event) => {
                      event.preventDefault();
                      setShowDelete(true);
                    }}
                  >
                    <KTSVG path="/media/icons/duotune/general/gen088.svg" />
                  </span>{" "}
                </div>
              </>
            ) : (
              ""
            )}
          </div>
          <p className="fs-3">{question?.body}</p>
          <p className="fs-5 text-end w-100 text-primary">
            <span className="mx-1">
              <i className="fa-regular fa-comments mx-1 fs-4 fa-fw"></i>
            </span>
            <span className="mx-1">{question?.commentCount}</span>
          </p>
        </div>

        <div className="modal fade" aria-hidden="true">
          <DeleteQuestionPopup
            id={question?.id}
            showDelete={showDelete}
            handleCloseDelete={() => setShowDelete(false)}
            pageIndex={pageIndex}
            pageSize={pageSize}
            setAllQuestions={setAllQuestions}
          />
        </div>
      </div>
    </>
  );
};

export { QuestionCard };
