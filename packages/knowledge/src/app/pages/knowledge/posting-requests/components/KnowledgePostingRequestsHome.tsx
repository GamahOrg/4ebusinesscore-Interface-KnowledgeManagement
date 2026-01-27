import { Fragment, useEffect } from "react";
import { useIntl } from "react-intl";
import BlogTab from "./BlogTab";
import AskTab from "./AskTab";
import IdeasBankTab from "./IdeasBankTab";
import ChallengeTab from "./Challenge";
import { useLocation, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import { fetchRequestsRoles } from "../../../../features/postingRequests/postingRequests";

function KnowledgePostingRequestsHome() {
  let intl = useIntl();
  let [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  let location = useLocation();
  let cardId = location?.state?.cardId || localStorage.getItem("cardId");

  const postingRoles = useSelector(
    (state: RootState) => state?.postingRequests?.data
  );

  useEffect(() => {
    dispatch(fetchRequestsRoles(cardId) as any)?.then((res: any) => {
      if (res?.payload?.length > 0) {
        let tabName = searchParams.get("tabName");
        if (!tabName || tabName == null) {
          searchParams.set("tabName", getStartTab(res?.payload));
          setSearchParams(searchParams);
        }
        let requestName = searchParams.get("requestName");
        if (!requestName || requestName == null) {
          searchParams.set("requestName", "allrequests");
          setSearchParams(searchParams);
        }
      }
    });
  }, []);

  useEffect(() => {
    let tabName = searchParams.get("tabName");
    if (!tabName) {
      searchParams.set("tabName", "");
    }
    localStorage.setItem("cardId", cardId);
  }, []);
  let postingRolesNames = postingRoles?.map((role: any) => {
    return role?.noteNameAr;
  });
  const getStartTab = (payloadRes?: any) => {
    const rolesData = payloadRes || postingRoles;

    let rolesArr = rolesData?.map((role: any) => {
      switch (role?.noteNameEn) {
        case "Blogging Requests":
          return "blog";
        case "Ask Expert Requests":
          return "askExpert";
        case "Idea bank Requests ":
          return "ideas";
        case "Ask Challenge Requests":
          return "challenge";
        default:
          return null;
      }
    });
    return rolesArr[0];
  };

  const updateSearchParams = (value: string, request: string) => {
    let tabName = searchParams.get("tabName");
    if (tabName != value) {
      searchParams.set("tabName", value);
      setSearchParams(searchParams);
    }
    let requestName = searchParams.get("requestName");
    if (requestName != value) {
      searchParams.set("requestName", request);
      setSearchParams(searchParams);
    }
  };

  useEffect(() => {
    if (
      searchParams.get("tabName") === "blog" &&
      postingRoles.some((item: any) => item.noteNameEn === "Blogging Requests")
    ) {
      return;
    } else if (
      searchParams.get("tabName") === "askExpert" &&
      postingRoles.some(
        (item: any) => item.noteNameEn === "Ask Expert Requests"
      )
    ) {
      return;
    } else if (
      searchParams.get("tabName") === "ideas" &&
      postingRoles.some(
        (item: any) => item.noteNameEn === "Idea bank Requests "
      )
    ) {
      return;
    } else if (
      searchParams.get("tabName") === "challenge" &&
      postingRoles.some(
        (item: any) => item.noteNameEn === "Ask Challenge Requests"
      )
    ) {
      return;
    } else if (searchParams.get("tabName") === "") {
      return;
    }
  }, [searchParams, postingRoles]);

  return (
    <Fragment>
      <div className="detailsCard my-5">
        <div className="card card-xl-stretch mb-xl-6">
          <div className="card-header border border-bottom-2 pt-3 pb-5 mb-8">
            <h3 className="card-title align-items-start flex-column">
              <span className="card-label  fs-3 mb-1 fw-bolder">
                {intl.formatMessage({ id: "RequestsArchive" })}{" "}
              </span>
            </h3>
          </div>

          <div className="container-xxl">
            <div
              className="nav row nav-pills mb-3  d-flex"
              id="pills-tab"
              role="tablist"
            >
              {postingRolesNames?.includes("طلبات المدونه") ||
              postingRolesNames?.includes("طلبات المدونة") ? (
                <>
                  <div
                    className="nav-item col-12 col-lg-2 navTabsPills"
                    role="presentation"
                  >
                    <button
                      className={`nav-link  w-100 m-1 fs-5 fw-bolder dark-tabs-btn ${
                        searchParams.get("tabName") == "blog" ? "active" : ""
                      }`}
                      id="pills-blog-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-blog"
                      type="button"
                      role="tab"
                      aria-controls="pills-blog"
                      aria-selected="true"
                      onClick={() => {
                        updateSearchParams("blog", "allrequests");
                        setSearchParams(searchParams);
                      }}
                    >
                      {intl.formatMessage({ id: "BlogRequests" })}{" "}
                    </button>
                  </div>
                </>
              ) : (
                <></>
              )}
              {postingRolesNames?.includes("طلبات أسال خبير") ||
              postingRolesNames?.includes("طلبات أسال خبير ") ||
              postingRolesNames?.includes("طلبات أسأل خبير") ||
              postingRolesNames?.includes("طلبات إسال خبير") ? (
                <>
                  <div
                    className="nav-item col-12 col-lg-2 navTabsPills"
                    role="presentation"
                  >
                    <button
                      className={`nav-link w-100 fs-5 m-1 fw-bolder dark-tabs-btn ${
                        searchParams.get("tabName") == "askExpert"
                          ? "active"
                          : ""
                      }`}
                      id="pills-ask-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-ask"
                      type="button"
                      role="tab"
                      aria-controls="pills-ask"
                      aria-selected="false"
                      onClick={() => {
                        updateSearchParams("askExpert", "allrequests");
                        setSearchParams(searchParams);
                      }}
                    >
                      {intl.formatMessage({ id: "AskExpertRequests" })}{" "}
                    </button>
                  </div>
                </>
              ) : (
                <></>
              )}

              {postingRolesNames?.includes("طلبات بنك الافكار") ||
              postingRolesNames?.includes("طلبات بنك الأفكار") ? (
                <>
                  <div
                    className="nav-item col-12 col-lg-2 navTabsPills"
                    role="presentation"
                  >
                    <button
                      className={`nav-link w-100 m-1 fs-5 fw-bolder dark-tabs-btn ${
                        searchParams.get("tabName") == "ideas" ? "active" : ""
                      }`}
                      id="pills-ideasBank-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-ideasBank"
                      type="button"
                      role="tab"
                      aria-controls="pills-ideasBank"
                      aria-selected="false"
                      onClick={() => {
                        updateSearchParams("ideas", "allrequests");
                        setSearchParams(searchParams);
                      }}
                    >
                      {intl.formatMessage({ id: "IdeaBankRequests" })}{" "}
                    </button>
                  </div>
                </>
              ) : (
                <></>
              )}
              {postingRolesNames?.includes("طلبات التحديات") ||
              postingRolesNames?.includes("طلبات طرح تحدي") ||
              postingRolesNames?.includes("طلبات طرح التحدي") ? (
                <>
                  {" "}
                  <div
                    className="nav-item col-12 col-lg-2 navTabsPills"
                    role="presentation"
                  >
                    <button
                      className={`nav-link w-100 m-1 fs-5 fw-bolder dark-tabs-btn ${
                        searchParams.get("tabName") == "challenge"
                          ? "active"
                          : ""
                      }`}
                      id="pills-challenge-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-challenge"
                      type="button"
                      role="tab"
                      aria-controls="pills-challenge"
                      aria-selected="false"
                      onClick={() => {
                        updateSearchParams("challenge", "allrequests");
                        setSearchParams(searchParams);
                      }}
                    >
                      {intl.formatMessage({ id: "AskChallengeRequests" })}{" "}
                    </button>
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
            <div className="tab-content px-2" id="pills-tabContent">
              {searchParams.get("tabName") == "blog" &&
              postingRoles.some(
                (item: any) => item.noteNameEn === "Blogging Requests"
              ) ? (
                <>
                  {" "}
                  <BlogTab department={searchParams.get("tabName") as string} />
                </>
              ) : (
                <></>
              )}
              {searchParams.get("tabName") == "askExpert" &&
              postingRoles.some(
                (item: any) => item.noteNameEn === "Ask Expert Requests"
              ) ? (
                <>
                  <AskTab department={searchParams.get("tabName") as string} />
                </>
              ) : (
                <></>
              )}

              {searchParams.get("tabName") == "ideas" &&
              postingRoles.some(
                (item: any) => item.noteNameEn === "Idea bank Requests "
              ) ? (
                <>
                  <IdeasBankTab
                    department={searchParams.get("tabName") as string}
                  />
                </>
              ) : (
                <></>
              )}
              {searchParams.get("tabName") == "challenge" &&
              postingRoles.some(
                (item: any) => item.noteNameEn === "Ask Challenge Requests"
              ) ? (
                <>
                  {" "}
                  <ChallengeTab
                    department={searchParams.get("tabName") as string}
                  />
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default KnowledgePostingRequestsHome;
