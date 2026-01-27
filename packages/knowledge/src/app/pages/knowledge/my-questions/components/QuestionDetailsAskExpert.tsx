import { FC, useEffect, useState } from "react";
import { toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";
import { useIntl } from "react-intl";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../../../../store/store";
import { useParams } from "react-router-dom";
import { fetchExpertsQuestion } from "../../../../features/questions/questionSlice";
import moment from "moment";
import { QuestionComments } from "../../ask-expert/components/QuestionComments";
import "moment-timezone";
import { getExpertsWithoutPagination } from "../../../../features/experts/expertsWithoutPaginationSlice";
import { Spinner } from "react-bootstrap";

const QuestionDetailsAskExpert: FC = () => {
  const intl = useIntl();

  const dispatch = useAppDispatch();
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

  const question = useAppSelector((state: RootState) => {
    return state?.questions?.data?.question;
  });

  let mode = localStorage.getItem("Theme");
  useEffect(() => {
    dispatch(getExpertsWithoutPagination({}) as any);
  }, []);

  return (
    <div className="card card-custom card-stretch gutter-b">
      <div className="card-body">
        {!isLoading ? (
          <div className="d-flex justify-content-start">
            <div className="card-header p-4 d-flex flex-column w-100 border-0 mb-4 mb-md-4">
              <div className="d-flex justify-content-start align-items-center mb-4">
                <div className="w-50px h-50px">
                  <img
                    src={
                      question?.userImgUrl
                        ? (window as any)._env_?.REACT_APP_API_AskExpert_Url +
                          "/" +
                          question?.userImgUrl
                        : toAbsoluteUrl("/media/avatars/300-3.jpg")
                    }
                    className="w-100 rounded-3"
                    alt="profile"
                    onError={(e: any) =>
                      (e.target.src = toAbsoluteUrl("/media/avatars/300-3.jpg"))
                    }
                  />
                </div>
                <div className="mx-2 px-1 d-flex flex-column">
                  <div className="mb-2">
                    {question?.firstName +
                      " " +
                      question?.secondName +
                      " " +
                      question?.thirdName +
                      " " +
                      question?.fourthName}
                  </div>
                  <div
                    className={`${
                      mode == "dark" ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {moment(question?.createdOn).format("YYYY-MM-DD") +
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
              <QuestionComments />
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

export { QuestionDetailsAskExpert };
