import { FC, useState } from "react";
import { KTSVG, toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";
import { useIntl } from "react-intl";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import "moment-timezone";
import { DeleteQuestionPopup } from "../popup/delete-question-popup";
import { EditQuestionPopup } from "./../popup/edit-question-popup";

interface Props {
  question: any;
  pageIndex?: number;
  pageSize?: number;
}

const QuestionAskExpert: FC<Props> = ({ question, pageIndex, pageSize }) => {
  const intl = useIntl();
  const RootUrl = (window as any)._env_?.REACT_APP_API_AskExpert_Url + "/";
  const navigate = useNavigate();
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const userLogged = localStorage.getItem("userId");

  let location = useLocation();
  const cardTitle =
    location?.state?.serviceName || location?.state?.cardTitle || "";

  return (
    <div className="card shadow-sm p-4 rounded pb-1 ">
      <div className="card-body p-0">
        <div className="d-flex justify-content-between mb-10">
          <div
            className="d-flex gap-5 cursor-pointer"
            onClick={() =>
              navigate(
                `/knowledge-my-question-details-ask-expert/${question.id}`,
                {
                  state: { serviceName: cardTitle },
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
                {question?.firstName} {question?.secondName}{" "}
                {question?.thirdName} {question?.fourthName}{" "}
              </span>
              <span className="mb-3 text-gray-400">
                {question?.specializationNameAr}
              </span>
              <span className="text-gray-700">{question?.orgNameAr}</span>
            </div>
          </div>
          <div
            className="h-auto cursor-pointer"
            onClick={() =>
              navigate(
                `/knowledge-my-questions/knowledge-my-question-details/${question.id}`,
                {
                  state: { serviceName: cardTitle },
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
          {question?.createdBy === userLogged ? (
            <>
              <div className="d-flex gap-3 py-1">
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
        <p className="fs-5 text-end w-100 text-muted">
          {moment(question?.createdOn).format("YYYY-MM-DD")}{" "}
          {moment
            .tz(question?.createdOn, "UTC")
            .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
            .format("LT")}
        </p>
      </div>

      <div className="modal fade" aria-hidden="true">
        <DeleteQuestionPopup
          id={question?.id}
          showDelete={showDelete}
          handleCloseDelete={() => setShowDelete(false)}
          pageIndex={pageIndex}
          pageSize={pageSize}
        />
      </div>
      <div className="modal fade" aria-hidden="true">
        <EditQuestionPopup
          id={question?.id}
          showEdit={showEdit}
          handleCloseEdit={() => setShowEdit(false)}
        />
      </div>
    </div>
  );
};

export default QuestionAskExpert;
