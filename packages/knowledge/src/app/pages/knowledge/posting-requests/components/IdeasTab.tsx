import React, { Fragment, useState } from "react";
import { useIntl } from "react-intl";
import { Link, useSearchParams } from "react-router-dom";
interface Iprop {
  allRequestsData: any;
}

const IdeasTab: React.FC<Iprop> = ({ allRequestsData }) => {
  let intl = useIntl();
  let [searchParams, setSearchParams] = useSearchParams();
  let rejectedRequests = allRequestsData.filter((item : any) => {
    return item.status == intl.formatMessage({ id: "RejectedRequests" });
  });
  let approvedRequests = allRequestsData.filter((item : any) => {
    return item.status == intl.formatMessage({ id: "ApprovedRequests" });
  });
  let pendingRequests = allRequestsData.filter((item: any) => {
    return item.status == intl.formatMessage({ id: "PendingRequests" });
  });
  let [allActive, setAllActive] = useState(true);
  let [approvedActive, setApprovedActive] = useState(false);
  let [rejectedActive, setRejectedActive] = useState(false);
  let [pendingActive, setPendingActive] = useState(false);
  let handleAllActive = () => {
    setAllActive(true);
    setApprovedActive(false);
    setRejectedActive(false);
    setPendingActive(false);
  };
  let handleApprovedActive = () => {
    setAllActive(false);
    setApprovedActive(true);
    setRejectedActive(false);
    setPendingActive(false);
  };
  let handleRejectedActive = () => {
    setAllActive(false);
    setApprovedActive(false);
    setRejectedActive(true);
    setPendingActive(false);
  };
  let handlePendingActive = () => {
    setAllActive(false);
    setApprovedActive(false);
    setRejectedActive(false);
    setPendingActive(true);
  };
  const [visibleItems, setVisibleItems] = useState(3);
  const handleLoadMore = () => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 3);
  };
  return (
    <Fragment>
      <div
        className="tab-pane fade"
        id="pills-ideas"
        role="tabpanel"
        aria-labelledby="pills-ideas-tab"
      >
        <nav className="mt-4 pt-2">
          <div
            className="nav border-0 nav-tabs mb-1 justify-content-center justify-content-md-start btnNavTabs"
            id="nav-tab"
            role="tablist"
          >
            <button
              className="btn active rounded-0 fs-6 bg-transparent btn-active-color-primary border-0 ms-6 pe-3 fw-bolder  border border-bottom border-white border-2 border-active-primary"
              id="nav-requestes-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav_ideas_requests"
              type="button"
              role="tab"
              aria-controls="nav-requests"
              aria-selected="true"
              onClick={() => {
                handleAllActive();
              }}
              style={{ color: `${allActive ? "#009ef7" : "#a1a5b7"}` }}
            >
              {intl.formatMessage({ id: "AllRequests" })}{" "}
            </button>
            <button
              className="rounded-0 bg-transparent  border-0 ms-6 fs-6  pe-3 fw-bolder  border border-bottom border-white border-2 border-active-warning"
              id="nav-suspended-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav_ideas_suspended"
              type="button"
              role="tab"
              aria-controls="nav-suspended"
              aria-selected="false"
              onClick={() => {
                handlePendingActive();
              }}
              style={{
                color: `${pendingActive ? "rgba(255, 199, 0, 1)" : "#a1a5b7"}`,
              }}
            >
              {intl.formatMessage({ id: "PendingRequests" })}{" "}
            </button>
            <button
              className="rounded-0 fs-6  bg-transparent  border-0 ms-6 pe-3 fw-bolder  border border-bottom border-white border-2 border-active-success"
              id="nav-approved-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav_ideas_approved"
              type="button"
              role="tab"
              aria-controls="nav-approved"
              aria-selected="false"
              onClick={() => {
                handleApprovedActive();
              }}
              style={{
                color: `${approvedActive ? "rgba(82, 205, 80, 1)" : "#a1a5b7"}`,
              }}
            >
              {intl.formatMessage({ id: "ApprovedRequests" })}{" "}
            </button>
            <button
              className="rounded-0 bg-transparent btn_active_color_danger border-0 ms-6 fs-6  pe-3 fw-bolder  border border-bottom border-white border-2 border-active-danger"
              id="nav-rejected-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav_ideas_rejected"
              type="button"
              role="tab"
              aria-controls="nav-rejected"
              aria-selected="false"
              onClick={() => {
                handleRejectedActive();
              }}
              style={{
                color: `${rejectedActive ? "rgba(241, 65, 65, 1)" : "#a1a5b7"}`,
              }}
            >
              {intl.formatMessage({ id: "RejectedRequests" })}{" "}
            </button>
          </div>
        </nav>
        <div className="tab-content px-3" id="nav-tabContent">
          <div
            className="tab-pane fade show active"
            id="nav_ideas_requests"
            role="tabpanel"
            aria-labelledby="nav-requestes-tab"
          >
            {allRequestsData?.slice(0, visibleItems).map((item: any) => {
              let { id, name, img, time, status, requestTitle } = item;
              return (
                <Fragment key={Math.random()}>
                  <Link
                    to={{
                      pathname: `/knowledge-posting-requests/ideas/${id}/details`,
                    }}
                    state={status}
                  >
                    <div className="w-100 mb-3 mt-4 position-relative px-6 card pt-2 shadow border border-2 border-bottom-4">
                      <div
                        style={{
                          height: "100%",
                          width: "3px",
                          position: "absolute",
                          top: "0px",
                          right: "0px",
                          backgroundColor: `${
                            status ==
                            intl.formatMessage({
                              id: "PendingRequests",
                            })
                              ? "#ffc700"
                              : status ==
                                intl.formatMessage({
                                  id: "RejectedRequests",
                                })
                              ? "red"
                              : "green"
                          }`,
                        }}
                      ></div>

                      <div className="d-flex align-items-center justify-content-end">
                        <span
                          className={`ps-4 badgex  ${
                            status ==
                            intl.formatMessage({
                              id: "PendingRequests",
                            })
                              ? "badge-light-warning"
                              : status ==
                                intl.formatMessage({
                                  id: "RejectedRequests",
                                })
                              ? "badge-light-danger"
                              : "badge-light-success"
                          }`}
                        >
                          {status}{" "}
                        </span>
                      </div>
                      <div className=" d-flex justify-content-between mb-4">
                        <div className="d-flex justify-content-between align-items-center">
                          <img
                            src={img}
                            className="d-block mx-2"
                            style={{ height: "50px", width: "50px" }}
                            alt="profile img"
                          />
                          <div className="mx-3 text-gray-700">
                            <p className="mb-1 fw-bolder ">{name}</p>
                            <p className="mb-1 text-muted">{time}</p>
                          </div>
                        </div>
                        <div className="w-75"></div>
                      </div>
                      <p className="text-primary mt-3 mb-5 fs-3">
                        {requestTitle}
                      </p>
                    </div>
                  </Link>
                </Fragment>
              );
            })}
          </div>
          <div
            className="tab-pane fade"
            id="nav_ideas_suspended"
            role="tabpanel"
            aria-labelledby="nav-suspended-tab"
          >
            {pendingRequests?.slice(0, visibleItems).map((item: any) => {
              let { id, name, img, time, status, requestTitle } = item;
              return (
                <Fragment key={Math.random()}>
                  <Link
                    to={{
                      pathname: `/knowledge-posting-requests/ideas/${id}/details`,
                    }}
                    state={status}
                  >
                    <div className="w-100 mb-3 mt-4 position-relative px-6 card pt-2 shadow border border-2 border-bottom-4">
                      <div
                        style={{
                          height: "100%",
                          width: "3px",
                          position: "absolute",
                          top: "0px",
                          right: "0px",
                          backgroundColor: `${
                            status ==
                            intl.formatMessage({
                              id: "PendingRequests",
                            })
                              ? "#ffc700"
                              : status ==
                                intl.formatMessage({
                                  id: "RejectedRequests",
                                })
                              ? "red"
                              : "green"
                          }`,
                        }}
                      ></div>
                      <div className="d-flex align-items-center justify-content-end">
                        <span className="ps-4 badgex badge-light-warning">
                          {status}{" "}
                        </span>
                      </div>
                      <div className=" d-flex justify-content-between mb-4">
                        <div className="d-flex justify-content-between align-items-center">
                          <img
                            src={img}
                            className="d-block mx-2"
                            style={{ height: "50px", width: "50px" }}
                            alt="profile img"
                          />
                          <div className="mx-3 text-gray-700">
                            <p className="mb-1 fw-bolder ">{name}</p>
                            <p className="mb-1 text-muted">{time}</p>
                          </div>
                        </div>
                        <div className="w-75"></div>
                      </div>
                      <p className="text-primary mt-3 mb-5 fs-3">
                        {requestTitle}
                      </p>
                    </div>
                  </Link>
                </Fragment>
              );
            })}
          </div>
          <div
            className="tab-pane fade"
            id="nav_ideas_approved"
            role="tabpanel"
            aria-labelledby="nav-approved-tab"
          >
            {approvedRequests?.slice(0, visibleItems).map((item: any) => {
              let { id, name, img, time, status, requestTitle } = item;
              return (
                <Fragment key={Math.random()}>
                  <Link
                    to={{
                      pathname: `/knowledge-posting-requests/ideas/${id}/details`,
                    }}
                    state={status}
                  
                  >
                    <div className="w-100 mb-3 mt-4 position-relative px-6 card pt-2 shadow border border-2 border-bottom-4">
                      <div
                        style={{
                          height: "100%",
                          width: "3px",
                          position: "absolute",
                          top: "0px",
                          right: "0px",
                          backgroundColor: `${
                            status ==
                            intl.formatMessage({
                              id: "PendingRequests",
                            })
                              ? "#ffc700"
                              : status ==
                                intl.formatMessage({
                                  id: "RejectedRequests",
                                })
                              ? "#f1416c"
                              : "#50cd89"
                          }`,
                        }}
                      ></div>
                      <div className="d-flex align-items-center justify-content-end">
                        <span className="ps-4 badgex badge-light-success">
                          {status}{" "}
                        </span>
                      </div>
                      <div className=" d-flex justify-content-between mb-4">
                        <div className="d-flex justify-content-between align-items-center">
                          <img
                            src={img}
                            className="d-block mx-2"
                            style={{ height: "50px", width: "50px" }}
                            alt="profile img"
                          />
                          <div className="mx-3 text-gray-700">
                            <p className="mb-1 fw-bolder ">{name}</p>
                            <p className="mb-1 text-muted">{time}</p>
                          </div>
                        </div>
                        <div className="w-75"></div>
                      </div>
                      <p className="text-primary mt-3 mb-5 fs-3">
                        {requestTitle}
                      </p>
                    </div>
                  </Link>
                </Fragment>
              );
            })}
          </div>
          <div
            className="tab-pane fade"
            id="nav_ideas_rejected"
            role="tabpanel"
            aria-labelledby="nav-rejected-tab"
          >
            {rejectedRequests?.slice(0, visibleItems).map((item: any) => {
              let { id, name, img, time, status, requestTitle } = item;
              return (
                <Fragment key={Math.random()}>
                  <Link
                    to={{
                      pathname: `/knowledge-posting-requests/ideas/${id}/details`,
                    }}
                    state={status}
                  >
                    <div className="w-100 mb-3 mt-4 position-relative px-6 card pt-2 shadow border border-2 border-bottom-4">
                      <div
                        style={{
                          height: "100%",
                          width: "3px",
                          position: "absolute",
                          top: "0px",
                          right: "0px",
                          backgroundColor: `${
                            status ==
                            intl.formatMessage({
                              id: "PendingRequests",
                            })
                              ? "#ffc700"
                              : status ==
                                intl.formatMessage({
                                  id: "RejectedRequests",
                                })
                              ? "red"
                              : "green"
                          }`,
                        }}
                      ></div>
                      <div className="d-flex align-items-center justify-content-end">
                        <span className="ps-4 badgex badge-light-danger">
                          {status}{" "}
                        </span>
                      </div>
                      <div className=" d-flex justify-content-between mb-4">
                        <div className="d-flex justify-content-between align-items-center">
                          <img
                            src={img}
                            className="d-block mx-2"
                            style={{ height: "50px", width: "50px" }}
                            alt="profile img"
                          />
                          <div className="mx-3 text-gray-700">
                            <p className="mb-1 fw-bolder ">{name}</p>
                            <p className="mb-1 text-muted">{time}</p>
                          </div>
                        </div>
                        <div className="w-75"></div>
                      </div>
                      <p className="text-primary mt-3 mb-5 fs-3">
                        {requestTitle}
                      </p>
                    </div>
                  </Link>
                </Fragment>
              );
            })}
          </div>

          <div className="d-flex align-items-center justify-content-center">
            <button
              className="pt-2 pb-2 mt-5 mb-4 "
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
          </div>
        </div>{" "}
      </div>
    </Fragment>
  );
};

export default IdeasTab;
