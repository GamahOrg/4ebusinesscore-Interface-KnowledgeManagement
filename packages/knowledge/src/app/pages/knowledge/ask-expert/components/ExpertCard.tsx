import { Fragment, useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useIntl } from "react-intl";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import { getExperts } from "../../../../features/experts/expertsSlice";
import { Pagination } from "../../../partials/pagination";
import { fetchUsers } from "../../../../features/users&departments/usersSlice";
import { UserManagmentRootUrl } from "@4eplatform/shared/apis/user_management";
import { useLocation } from "react-router-dom";
import { toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";

const ExpertCard = () => {
  const intl = useIntl();
  const expertRootUrl = (window as any)._env_?.REACT_APP_API_User_Url + "/";
  let [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  let expetrs = useSelector((state: RootState) => {
    return state?.experts?.data;
  });
  let totalItems = useSelector((state: RootState) => {
    return state?.experts?.taotalItems;
  });
  let totalPages = useSelector((state: RootState) => {
    return state?.experts?.totalpages;
  });
  const dispatch = useDispatch();

  useEffect(() => {
    let params: any = {
      pageSize: searchParams.get("pageSize"),
      pageNumber: searchParams.get("pageNumber"),
      searchTerm,
    };
    dispatch(getExperts(params) as any);
  }, [
    searchParams.get("pageSize"),
    searchParams.get("pageNumber"),
    searchTerm,
  ]);
  let users = useSelector((state: RootState) => {
    return state?.users?.data;
  });
  useEffect(() => {
    dispatch(fetchUsers({}) as any);
  }, []);

  let location = useLocation();
  let cardId = location?.state?.cardId;
  let cardName =
    location?.state?.cardTitle || location?.state?.serviceName || "";
  return (
    <Fragment>
      <div className="card card-custom card-stretch gutter-b">
        <div className="card-body">
          <div className="col-12 col-sm-8 col-md-8 col-xl-4 col-lg-4 col-md-4 col-sm-4 position-relative text-center ms-md-0 mx-3 mb-5">
            <input
              type="search"
              name="searchExpert"
              className="input input-group searchBoxDesign search_input"
              id="searchExpert"
              placeholder={intl.formatMessage({
                id: "ExpertName",
              })}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
            <i className="fa-solid fa-light fa-magnifying-glass my-magnify fs-3 text-muted fa-fw position-absolute"></i>
          </div>
        </div>
        <div className="card-body">
          <Row className="gx-10 gy-10">
            {expetrs?.map((expert: any) => {
              return (
                <Fragment key={Math.random()}>
                  <Col md={4}>
                    <div className="mx-3">
                      <div className="card mb-3 py-5 card shadow-sm p-4 rounded pb-1">
                        <div className="card-header border-0 pt-5 d-flex align-items-center justify-content-center mt-5 ">
                          {expert?.isExternalExpert ? (
                            <img
                              src={
                                expert?.imgUrl
                                  ? expertRootUrl + expert?.imgUrl
                                  : toAbsoluteUrl("/media/avatars/300-3.jpg")
                              }
                              onError={(e: any) =>
                                (e.target.src = toAbsoluteUrl(
                                  "/media/avatars/300-3.jpg"
                                ))
                              }
                              style={{
                                display: "block",
                                height: "122px",
                                width: "122px",
                                borderRadius: "50%",
                              }}
                              alt="Expert Avatar"
                            />
                          ) : (
                            <img
                              src={
                                users?.find((user) => {
                                  return user?.id == expert?.userId;
                                })?.imageUrl && expert?.imgUrl == null
                                  ? UserManagmentRootUrl +
                                    users?.find((user) => {
                                      return user?.id == expert?.userId;
                                    })?.imageUrl
                                  : expert?.imgUrl
                                  ? expertRootUrl + expert?.imgUrl
                                  : toAbsoluteUrl("/media/avatars/300-3.jpg")
                              }
                              onError={(e: any) =>
                                (e.target.src = toAbsoluteUrl(
                                  "/media/avatars/300-3.jpg"
                                ))
                              }
                              style={{
                                display: "block",
                                height: "122px",
                                width: "122px",
                                borderRadius: "50%",
                              }}
                              alt="Expert Avatar"
                            />
                          )}
                        </div>

                        <div className="card-body d-flex flex-center flex-column">
                          <p
                            style={{ fontSize: "16px", fontWeight: "700" }}
                            className="text-center"
                          >
                            {expert?.expertName}
                          </p>
                          <p
                            style={{
                              fontSize: "14px",
                              fontWeight: "400",
                            }}
                            className="mb-5 text-center"
                          >
                            {expert?.experiences[0]?.specializationNameAr
                              ? expert?.experiences[0]?.specializationNameAr
                              : "لا يوجد مجال تخصص"}
                          </p>
                          <p
                            style={{ color: "#A1A5B7", fontWeight: "400" }}
                            className="text-center"
                          >
                            {expert?.experiences[0]?.experienceName
                              ? expert?.experiences[0]?.experienceName
                              : "لا يوجد خبره"}
                          </p>
                          <Link
                            to={{
                              pathname: `/knowledge-profile-expert/${expert?.id}`,
                            }}
                            state={{
                              cardId: cardId,
                              cardTitle: cardName,
                            }}
                          >
                            <button className="btn btn-primary mx-1 text-center mb-5 mt-5">
                              {intl.formatMessage({ id: "Viewprofile" })}{" "}
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Fragment>
              );
            })}
          </Row>
          <Pagination totalPages={totalPages} totalItems={totalItems} />
        </div>
      </div>
    </Fragment>
  );
};

export { ExpertCard };
