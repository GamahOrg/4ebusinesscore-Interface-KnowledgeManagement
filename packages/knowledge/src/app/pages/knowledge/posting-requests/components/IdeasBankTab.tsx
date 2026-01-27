import React, { Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Link, useSearchParams } from "react-router-dom";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../../../../store/store";
import { fetchIdeasByRequestStage } from "../../../../features/idea/knowledgePostingSlice";
import moment from "moment";
import { RequestStage } from "../../../../enums/enums";
import { toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";

interface Iprop {
  department: string;
}

const IdeasBankTab: React.FC<Iprop> = ({ department }) => {
  let intl = useIntl();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const [pageSize, setPageSize] = useState(9);
  const totalItems = useAppSelector(
    (state: RootState) => state?.knowledgePosting?.requestedIdeas?.totalItems
  );
  const knowledgePosting = useAppSelector(
    (state: RootState) => state?.knowledgePosting?.requestedIdeas?.result
  );
  const [currentRequestStage, setCurrentRequestStage] = useState<number | null>(
    null
  );

  useEffect(() => {
    dispatch(
      fetchIdeasByRequestStage({
        pageSize,
        requestedStage: currentRequestStage,
      })
    );
  }, [dispatch, pageSize, currentRequestStage]);

  useEffect(() => {
    let requestName = searchParams.get("requestName");
    if (!requestName || requestName == null) {
      searchParams.set("requestName", "allrequests");
      setSearchParams(searchParams);
    }
  }, []);

  const updateSearchParams = (value: string) => {
    let tabName = searchParams.get("requestName");
    if (tabName !== value) {
      searchParams.set("requestName", value);
      setSearchParams(searchParams);
    }
  };

  let [allActive, setAllActive] = useState(true);
  let [approvedActive, setApprovedActive] = useState(false);
  let [rejectedActive, setRejectedActive] = useState(false);
  let [pendingActive, setPendingActive] = useState(false);
  let [approvedNotPostedActive, setApprovedNotPostedActive] = useState(false);

  const handleTabClick = (requestedStage: number | null, tabName: string) => {
    dispatch(fetchIdeasByRequestStage({ requestedStage, pageSize }));
    updateSearchParams(tabName);
    setCurrentRequestStage(requestedStage);
    setAllActive(requestedStage === null);
    setApprovedActive(requestedStage === 2);
    setRejectedActive(requestedStage === 3);
    setPendingActive(requestedStage === 1);
    setApprovedNotPostedActive(requestedStage === 4);
  };

  const renderItems = () => {
    return knowledgePosting?.map((item: any) => (
      <Fragment key={item.id}>
        <Link
          to={`/knowledge-posting-requests/${department}/${item.id}/details`}
          state={item.requestStage}
        >
          <div className="w-100 mb-3 mt-4 position-relative px-6 card pt-2 shadow border border-2 border-bottom-4">
            <div
              style={{
                height: "100%",
                width: "3px",
                position: "absolute",
                top: "0px",
                right: "0px",
                backgroundColor:
                  item.requestStage === RequestStage.Pending
                    ? "#ffc700"
                    : item.requestStage === RequestStage.Rejected
                    ? "red"
                    : item.requestStage === RequestStage.AcceptAndNotPublished
                    ? "blue"
                    : "green",
              }}
            ></div>
            <div className="d-flex align-items-center justify-content-end">
              <span
                className={`ps-4 badgex ${
                  item.requestStage === RequestStage.Pending
                    ? "badge-light-warning"
                    : item.requestStage === RequestStage.Rejected
                    ? "badge-light-danger"
                    : item.requestStage === RequestStage.AcceptAndNotPublished
                    ? "badge-light-primary"
                    : "badge-light-success"
                }`}
              >
                {item.requestStage === RequestStage.Pending
                  ? intl.formatMessage({ id: "PendingRequest" })
                  : item.requestStage === RequestStage.Rejected
                  ? intl.formatMessage({ id: "RejectedRequest" })
                  : item.requestStage === RequestStage.AcceptAndNotPublished
                  ? intl.formatMessage({ id: "AcceptAndNotPublished" })
                  : intl.formatMessage({ id: "AcceptedRequest" })}
              </span>
            </div>
            <div className="d-flex justify-content-between mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <img
                  src={
                    item?.userImgUrl
                      ? `${(window as any)._env_?.REACT_APP_API_IdeaBank_Url}/${
                          item?.userImgUrl
                        }`
                      : toAbsoluteUrl("/media/avatars/300-3.jpg")
                  }
                  className="d-block mx-2"
                  style={{ height: "50px", width: "50px" }}
                  alt="profile img"
                  onError={(e: any) =>
                    (e.target.src = toAbsoluteUrl("/media/avatars/300-3.jpg"))
                  }
                />
                <div className="mx-3 text-gray-700">
                  <p className="mb-1 fw-bolder">{`${item.firstName} ${item.secondName} ${item.thirdName} ${item.fourthName}`}</p>
                  <p className="mb-1 text-muted">
                    {moment(item.createdOn).format("YYYY-MM-DD")}
                  </p>
                </div>
              </div>
              <div className="w-75"></div>
            </div>
            <p className="text-primary mt-3 mb-5 fs-3">{item.description}</p>
          </div>
        </Link>
      </Fragment>
    ));
  };

  const handleLoadMore = () => {
    const itemsToShow = Math.min(4, totalItems - pageSize);
    setPageSize(pageSize + itemsToShow);
  };
  return (
    <Fragment>
      <div
        className="tab-pane fade show active"
        id="pills-ideasBank"
        role="tabpanel"
        aria-labelledby="pills-ideasBank-tab"
      >
        <nav className="mt-4 pt-2">
          <div
            className="nav border-0 nav-tabs mb-1 justify-content-center justify-content-md-start "
            id="nav-tab"
            role="tablist"
          >
            <button
              className={`btn rounded-0 fs-6 bg-transparent btn-active-color-primary border-0 ms-6 pe-3 fw-bolder border border-bottom border-white border-2 border-active-primary ${
                allActive ? "active" : ""
              }`}
              onClick={() => handleTabClick(null, "allrequests")}
              style={{ color: allActive ? "#009ef7" : "#a1a5b7" }}
            >
              {intl.formatMessage({ id: "AllRequests" })}
            </button>
            <button
              className={`btn rounded-0 fs-6 bg-transparent btn-active-color-warning border-0 ms-6 pe-3 fw-bolder border border-bottom border-white border-2 border-active-warning ${
                pendingActive ? "active" : ""
              }`}
              onClick={() => handleTabClick(1, "suspended")}
              style={{
                color: pendingActive ? "rgba(255, 199, 0, 1)" : "#a1a5b7",
              }}
            >
              {intl.formatMessage({ id: "PendingRequests" })}
            </button>
            <button
              className={`btn rounded-0 fs-6 bg-transparent btn-active-color-success border-0 ms-6 pe-3 fw-bolder border border-bottom border-white border-2 border-active-success ${
                approvedActive ? "active" : ""
              }`}
              onClick={() => handleTabClick(2, "approved")}
              style={{
                color: approvedActive ? "rgba(82, 205, 80, 1)" : "#a1a5b7",
              }}
            >
              {intl.formatMessage({ id: "ApprovedRequests" })}
            </button>
            <button
              className={`btn rounded-0 fs-6 bg-transparent btn-active-color-danger border-0 ms-6 pe-3 fw-bolder border border-bottom border-white border-2 border-active-danger ${
                rejectedActive ? "active" : ""
              }`}
              onClick={() => handleTabClick(3, "rejected")}
              style={{
                color: rejectedActive ? "rgba(241, 65, 65, 1)" : "#a1a5b7",
              }}
            >
              {intl.formatMessage({ id: "RejectedRequests" })}
            </button>
            <button
              className={`btn rounded-0 fs-6 bg-transparent btn-active-color-primary border-0 ms-6 pe-3 fw-bolder border border-bottom border-white border-2 border-active-primary ${
                approvedNotPostedActive ? "active" : ""
              }`}
              onClick={() => handleTabClick(4, "acceptAndNotPublished")}
              style={{
                color: approvedNotPostedActive
                  ? "rgba(241, 65, 65, 1)"
                  : "#a1a5b7",
              }}
            >
              {intl.formatMessage({ id: "approvedNotPostedActive" })}
            </button>
          </div>
        </nav>
        <div className="tab-content px-3" id="nav-tabContent">
          <div
            className="tab-pane fade show active"
            id="nav_ideasBank_requests"
            role="tabpanel"
            aria-labelledby="nav-requestes-tab"
          >
            {renderItems()}
          </div>
          <div
            className="tab-pane fade"
            id="nav_ideasBank_suspended"
            role="tabpanel"
            aria-labelledby="nav-suspended-tab"
          >
            {renderItems()}
          </div>
          <div
            className="tab-pane fade"
            id="nav_ideasBank_approved"
            role="tabpanel"
            aria-labelledby="nav-approved-tab"
          >
            {renderItems()}
          </div>
          <div
            className="tab-pane fade"
            id="nav_ideasBank_rejected"
            role="tabpanel"
            aria-labelledby="nav-rejected-tab"
          >
            {renderItems()}
          </div>
          <div
            className="tab-pane fade"
            id="nav_ideasBank_approvedNotPosted"
            role="tabpanel"
            aria-labelledby="nav-approvedNotPosted-tab"
          >
            {renderItems()}
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-center">
          {pageSize < totalItems && (
            <button
              className="pt-2 pb-2 mt-5 mb-4"
              style={{
                background: "#FFFFFF",
                border: "1px solid #3F7DC8",
                borderRadius: "5px",
                width: "280px",
              }}
              onClick={() => handleLoadMore()}
            >
              {intl.formatMessage({ id: "MoreRequests" })}
            </button>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default IdeasBankTab;
