import { FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChallengeModel } from "../../../../models/challenges";
import { toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";
import { useIntl } from "react-intl";
import moment from "moment";
import EditChallengePopup from "../popup/edit-challenge-popup";
import { DeletePopup } from "../popup/DeletePopup";
import {
  fetchChallenges,
  removeChallenge,
} from "../../../../features/challenge/challengeSlice";
import { useAppDispatch } from "../../../../store/store";
import { showSuccessAlert } from "@4eplatform/shared/services/helper";

interface challengeProps {
  challenge?: ChallengeModel;
}
const KnowledgeChallengeCard: FC<challengeProps> = ({ challenge }) => {
  const intl = useIntl();
  const [currentPage, setCurrentPage] = useState(1);
  let dispatch = useAppDispatch();
  const [pageSize, setPageSize] = useState(10);

  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);

  let loggedInUserId = localStorage?.getItem("userId");
  let [selectedId, setSelectedId] = useState<any>("");
  let loggedInUserRole = JSON.parse(localStorage?.getItem("userInfo") || "");
  const isAdmin = loggedInUserRole?.roles?.find(
    (role: any) => role?.roleId === "4450bea1-7bbf-43ce-ad43-e48a5b730583"
  );
  let deleteIdea = (id: string) => {
    dispatch(removeChallenge(id) as any)
      .then(() => {
        dispatch(
          fetchChallenges({
            PageNumber: currentPage,
            PageSize: pageSize,
          }) as any
        );
      })
      .then(() => {
        showSuccessAlert(true, "DeletedSuccessfully", intl);
      });
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

  const EN_LANG = "en";
  let selectedLang: any = localStorage.getItem("i18nConfig");
  try {
    selectedLang = JSON.parse(selectedLang).selectedLang;
  } catch (err) {
    selectedLang = EN_LANG;
  }
  const positionClass = selectedLang === "ar" ? "right-0" : "left-0";

  return (
    <div className="col-lg-6">
      <div className="p-4 shadow rounded-3 position-relative ">
        <Link
          to={`/knowledge-ask-challenge/challenge-details/${challenge?.id}`}
          className="d-flex justify-content-between align-items-center mb-4"
        >
          <div className="d-flex align-items-center">
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
            <div className="mx-2 px-2 d-flex flex-column">
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
          {(loggedInUserId?.toLowerCase() ===
            challenge?.createdBy?.toLowerCase() ||
            isAdmin?.roleId) && (
            <div className="d-flex gap-5">
              {loggedInUserId?.toLowerCase() ===
                challenge?.createdBy?.toLowerCase() && (
                <i
                  className="fas fa-pencil-alt fs-3 cursor-pointer text-primary"
                  onClick={() => {
                    handleShow();
                    setSelectedId(challenge?.id as any);
                  }}
                ></i>
              )}
              <i
                className="far fa-trash-alt fs-3 cursor-pointer text-danger"
                onClick={(event) => {
                  event.preventDefault();
                  setSelectedId(challenge?.id as any);
                  handleShowDelete();
                }}
              ></i>
            </div>
          )}
        </Link>
        <Link
          to={`/knowledge-ask-challenge/challenge-details/${challenge?.id}`}
        >
          <div className="fs-6 fw-bold mb-4 text-primary text-truncate">
            {challenge?.title}
          </div>
          <div
            className="text-gray-700 mb-4 truncate-5-lines"
            style={{ height: "97px" }}
          >
            {challenge?.description}
          </div>
        </Link>
        <Link
          to={`/knowledge-ask-challenge/challenge-details/${challenge?.id}`}
          className="d-flex flex-wrap"
        >
          <div className="border border-1 d-flex align-items-center cursor-pointer mb-2 mb-lg-0 py-1 px-2 rounded-2">
            <span className="text-gray-700 px-1">
              {challenge?.commentCount}
            </span>
            <span className="d-flex align-items-center text-gray-700">
              <i className="fa-regular fa-comments mx-1 fs-4 fa-fw text-gray-700"></i>
            </span>
          </div>
        </Link>
      </div>
      {selectedId == challenge?.id ? (
        <>
          <EditChallengePopup
            handleClose={handleClose}
            show={show}
            challenge={challenge}
          />
        </>
      ) : (
        <></>
      )}
      {selectedId == challenge?.id ? (
        <>
          {" "}
          <DeletePopup
            id={challenge?.id}
            handleCloseDelete={handleCloseDelete}
            showDelete={showDelete}
            handleDelete={() => {
              deleteIdea(challenge?.id as unknown as string);
            }}
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export { KnowledgeChallengeCard };
