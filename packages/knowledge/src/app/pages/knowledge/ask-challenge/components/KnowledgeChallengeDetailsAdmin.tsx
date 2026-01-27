import { FC, useEffect } from "react";
import { toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { RootState, useAppDispatch } from "../../../../store/store";
import { fetchChallenge } from "../../../../features/challenge/challengeSlice";
import { useSelector } from "react-redux";
import moment from "moment";
import { ChallengeDetailsAdminComments } from "./ChallengeDetailsAdminComments";

const KnowledgeChallengeDetailsAdmin: FC = () => {
  const intl = useIntl();

  const { id: challengeId } = useParams();
  const dispatch = useAppDispatch();

  const challenge = useSelector((state: RootState) => {
    return state?.challenges?.data?.Challenge;
  });

  const getChallenge = async (id: string) => {
    await dispatch(fetchChallenge(id) as any);
  };

  useEffect(() => {
    if (challengeId) getChallenge(challengeId);
  }, [challengeId]);

  return (
    <div className="card card-custom card-stretch gutter-b">
      <div className="card-body">
        <div className="d-flex justify-content-start">
          <div className="card-header p-4 d-flex flex-column w-100 border-0 mb-4 mb-md-4">
            <div className="d-flex justify-content-start align-items-center mb-4">
              <div className="w-50px h-50px">
                <img
                  src={
                    challenge?.userImgUrl
                      ? (window as any)._env_?.REACT_APP_API_User_Url +
                        "/" +
                        challenge?.userImgUrl
                      : toAbsoluteUrl("/media/avatars/300-3.jpg")
                  }
                  className="w-100 rounded-3"
                  alt="profile"
                />
              </div>
              <div className="mx-2 px-1 d-flex flex-column">
                <div className="mb-2">
                  {challenge?.firstName +
                    " " +
                    challenge?.secondName +
                    " " +
                    challenge?.thirdName +
                    " " +
                    challenge?.fourthName}
                </div>
                <div className="text-gray-700">
                  {moment(challenge?.createdOn).format("YYYY-MM-DD") +
                    " " +
                    intl.formatMessage({ id: "IN" }) +
                    " " +
                    moment
                      .tz(challenge?.createdOn, "UTC")
                      .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                      .format("LT")}
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between flex-column flex-md-row mb-4">
              {challenge?.challengeAttachments?.length !== 0
                ? challenge?.challengeAttachments?.map((file) => (
                    <div className="d-flex justify-content-between justify-content-md-center mb-4 mb-md-0">
                      <a
                        href={
                          (window as any)._env_?.REACT_APP_API_Challenge_Url +
                          "/" +
                          file
                        }
                        target="blank"
                        className="mx-2"
                      >
                        <img
                          src={`/media/pmo/pdfIcon.png`}
                          width={"30px"}
                          height={"30px"}
                        />
                        <span className="fs-7 mt-1 mx-2">{file}</span>
                      </a>
                    </div>
                  ))
                : ""}
              <div className="d-flex flex-wrap">
                <div className="border border-1 d-flex align-items-center mb-2 mb-lg-0 p-2 rounded-1">
                  <span className="d-flex align-items-center text-gray-700">
                    <i className="fa-regular fa-comments mx-1 fs-4 fa-fw"></i>
                  </span>{" "}
                  <span className="text-gray-700 px-1">
                    {" "}
                    {challenge?.commentCount}
                  </span>
                </div>
                <div className="border border-1 d-flex align-items-center mb-2 mb-lg-0 cursor-pointer mx-2 p-2 rounded-1">
                  <span
                    className="d-flex align-items-center text-gray-700"
                    onClick={() => window.print()}
                  >
                    <i className="fa-solid fa-print mx-1 fs-3 fa-fw"></i>
                  </span>{" "}
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-light mb-3">
              <div className="fs-6 fw-bold mb-4">{challenge?.title} </div>
              <div className="text-gray-500 mb-4">{challenge?.description}</div>
            </div>
            {challenge && challenge?.challengeAttachments?.length !== 0 ? (
              <div className="mb-4 w-100">
                <div className="py-2">
                  <div className="col-md-12 col-sm-12 topics-units create-live explain">
                    <embed
                      src={
                        challenge?.challengeAttachments &&
                        challenge.challengeAttachments.length > 0
                          ? `${(window as any)._env_?.REACT_APP_API_User_Url}/${
                              challenge.challengeAttachments[0]
                            }`
                          : ""
                      }
                      style={{
                        width: "100%",
                        height: "750px",
                        borderRadius: "15px",
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            <ChallengeDetailsAdminComments />
          </div>
        </div>
      </div>
    </div>
  );
};

export { KnowledgeChallengeDetailsAdmin };
