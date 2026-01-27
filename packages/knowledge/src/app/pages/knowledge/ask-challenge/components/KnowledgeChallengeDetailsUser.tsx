import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { RootState, useAppDispatch } from "../../../../store/store";
import { fetchChallenge } from "../../../../features/challenge/challengeSlice";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";
import moment from "moment";
import { KnowledgeChallengeComments } from "./KnowledgeChallengeComments";
import getIconSrcString from "@4eplatform/shared/functions/getIconSrcString";
const KnowledgeChallengeDetailsUser: FC = () => {
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
      firstName: checkUndefinedName(challenge?.firstName),
      secondName: checkUndefinedName(challenge?.secondName),
      thirdName: checkUndefinedName(challenge?.thirdName),
      fourthName: checkUndefinedName(challenge?.fourthName),
    });
  }, [challenge]);

  let loggedInUserId = localStorage?.getItem("userId");

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
            {loggedInUserId === challenge?.createdBy && (
              <>
                <div className="d-flex justify-content-start align-items-center mb-5">
                  <div className="text-muted mx-2 fs-5">
                    {intl.formatMessage({ id: "RequestStatus" })} :
                  </div>
                  <div>{getRequestStatus(challenge?.requestStage)}</div>
                </div>
                <div className="d-flex justify-content-start align-items-center mb-5">
                  <div className="text-muted mx-2 fs-5">
                    {intl.formatMessage({ id: "Note" })} :
                  </div>
                  <div className="text-primary fs-4">{challenge?.notes}</div>
                </div>
              </>
            )}
            <div className="d-flex justify-content-between flex-column flex-md-row mb-4 flex-wrap">
              <div className="d-flex gap-2 mb-4 mb-md-0">
                {challenge?.challengeAttachments?.length !== 0
                  ? challenge?.challengeAttachments?.map((file, index) => (
                      <a
                        href={
                          (window as any)._env_?.REACT_APP_API_Challenge_Url +
                          "/" +
                          file
                        }
                        target="blank"
                        className="mx-2"
                        key={index}
                      >
                        <img
                          src={getIconSrcString(file)}
                          width={"30px"}
                          height={"30px"}
                        />
                        <span className="fs-7 mt-1 mx-2">
                          {file?.split("/")?.slice(-1)[0]?.split(".")[0]}
                        </span>
                      </a>
                    ))
                  : ""}
              </div>
              <div className="d-flex flex-wrap">
                <div className="border border-1 d-flex align-items-center mb-2 mb-lg-0 p-2 rounded-1">
                  <span className="d-flex align-items-center text-gray-700">
                    <i className="fa-regular fa-comments mx-1 fs-4 fa-fw"></i>
                  </span>
                  <span className="text-gray-700 px-1">
                    {challenge?.commentCount}
                  </span>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-light mb-3 w-100">
              <div className="fs-6 fw-bold mb-4">{challenge?.title}</div>
              <div className="text-gray-700 mb-4">{challenge?.description}</div>
            </div>
            {challenge?.requestStage !== 3 ? (
              <KnowledgeChallengeComments />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { KnowledgeChallengeDetailsUser };
