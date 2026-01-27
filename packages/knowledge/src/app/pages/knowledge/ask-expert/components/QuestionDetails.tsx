import { FC, useEffect, useState } from "react";
import { toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { fetchExpertsQuestion } from "../../../../features/questions/questionSlice";
import { useParams } from "react-router-dom";
import { RootState } from "../../../../store/store";
import moment from "moment";
import { QuestionComments } from "./QuestionComments";
import { Spinner } from "react-bootstrap";

const KnowledgeQuestionDetails: FC = () => {
  const intl = useIntl();

  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);

  let { id: QuestionId } = useParams();

  const getQuestion = async (id: string) => {
    setLoading(true);
    await dispatch(fetchExpertsQuestion(id) as any);
    setLoading(false);
  };

  useEffect(() => {
    if (QuestionId) getQuestion(QuestionId);
  }, [QuestionId]);

  const question = useSelector((state: RootState) => {
    return state?.questions?.data?.question;
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

  let loggedInUserId = localStorage?.getItem("userId");

  return (
    <div className="card card-custom card-stretch gutter-b">
      <div className="card-body">
        {!isLoading ? (
          <div className="d-flex justify-content-start">
            <div className="card-header p-4 d-flex flex-column w-100 border-0 mb-4 mb-md-4">
              <div className="d-flex justify-content-start align-items-center mb-5">
                <div className="w-50px h-50px">
                  <img
                    src={
                      question?.userImgUrl
                        ? (window as any)._env_?.REACT_APP_API_User_Url +
                          "/" +
                          question?.userImgUrl
                        : toAbsoluteUrl("/media/avatars/300-3.jpg")
                    }
                    onError={(e: any) =>
                      (e.target.src = toAbsoluteUrl("/media/avatars/300-3.jpg"))
                    }
                    className="w-100 rounded-3"
                    alt="profile"
                  />
                </div>
                <div className="mx-2 px-1 d-flex flex-column">
                  <div className="mb-2">
                    {`${userData.firstName} ${
                      userData.secondName
                    } ${checkUndefinedName(userData.thirdName)} ${
                      userData.fourthName
                    }`.trim()}{" "}
                  </div>
                  <div className="text-gray-500">
                    {moment
                      .tz(question?.createdOn, "UTC")
                      .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                      .format("YYYY-MM-DD") +
                      " " +
                      intl.formatMessage({ id: "IN" }) +
                      " " +
                      moment
                        .tz(question?.createdOn, "UTC")
                        .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                        .format("LT")}
                  </div>
                </div>
              </div>
              {loggedInUserId === question?.createdBy && (
                <>
                  <div className="d-flex justify-content-start align-items-center mb-5">
                    <div className="text-muted mx-2 fs-5">
                      {intl.formatMessage({ id: "RequestStatus" })} :
                    </div>
                    <div>{getRequestStatus(question?.requestStage)}</div>
                  </div>
                  <div className="d-flex justify-content-start align-items-center mb-5">
                    <div className="text-muted mx-2 fs-5">
                      {intl.formatMessage({ id: "Note" })} :
                    </div>
                    <div className="text-primary fs-4">{question?.notes}</div>
                  </div>
                </>
              )}
              <div className="d-flex justify-content-between flex-column flex-md-row mb-4">
                <div className="d-flex justify-content-between justify-content-md-center mb-4 mb-md-0">
                  <div className="fs-4 text-gray-800 fw-bolder mb-0">
                    {question?.body}
                  </div>
                </div>
              </div>
              <div className="mb-4 w-100">
                <div className="py-2">
                  <img
                    src={`/media/img/logo.png`}
                    style={{ width: "100%", maxHeight: "400px" }}
                    alt="IdeaPicture"
                  />
                </div>
              </div>
              {question?.requestStage !== 3 ? <QuestionComments /> : ""}
            </div>
          </div>
        ) : (
          <div className="d-flex gap-4 justify-content-center align-items-center py-4">
            {intl.formatMessage({ id: "LoadingData" })}
            <Spinner animation="border" variant="primary" />
          </div>
        )}
      </div>
    </div>
  );
};

export { KnowledgeQuestionDetails };
