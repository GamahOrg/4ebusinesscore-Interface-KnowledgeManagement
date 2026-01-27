import { Fragment, useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import { getExperts } from "../../../../features/experts/expertsSlice";
import { ExpertModel } from "../../../../models/getAllExpertsModel";
import { fetchUsers } from "../../../../features/users&departments/usersSlice";
import { UserManagmentRootUrl } from "@4eplatform/shared/apis/user_management";
import { SystemPagination } from "@4eplatform/shared/components/SystemPagination";
import { toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";

const AdminExpertCard = () => {
  const intl = useIntl();
  const expertRootUrl = (window as any)._env_?.REACT_APP_API_User_Url + "/";
  const dispatch = useDispatch();
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [search, setSearch] = useState("");

  let users = useSelector((state: RootState) => {
    return state?.users?.data;
  });
  let expetrs = useSelector((state: RootState) => {
    return state?.experts?.data;
  });
  let totalItems = useSelector((state: RootState) => {
    return state?.experts?.taotalItems;
  });
  let totalPages = useSelector((state: RootState) => {
    return state?.experts?.totalpages;
  });

  useEffect(() => {
    dispatch(fetchUsers({}) as any);
  }, []);

  useEffect(() => {
    let params: any = {
      pageSize: pageSize,
      pageNumber: pageIndex,
      searchTerm: search,
    };
    dispatch(getExperts(params) as any);
  }, [pageSize, pageIndex, search]);

  return (
    <div className="card">
      <div className="card-header d-flex align-items-center">
        <div className="p-5 w-100">
          <div className="position-relative w-45">
            <input
              type="search"
              name="searchExpert"
              className="input input-group searchBoxDesign search_input"
              id="searchExpert"
              placeholder={intl.formatMessage({
                id: "ExpertName",
              })}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <i className="fa-solid fa-light fa-magnifying-glass my-magnify fs-3 text-muted fa-fw position-absolute"></i>
          </div>
        </div>
      </div>
      <div className="card-body pt-9">
        <Row className="gy-5">
          {expetrs?.map((expert: ExpertModel) => {
            return (
              <Fragment key={Math.random()}>
                <Col md={4}>
                  <div className="mx-3 ">
                    <div className="card mb-3 py-5 shadow-sm">
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
                            alt={""}
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
                            alt={""}
                          />
                        )}
                      </div>

                      <div className="card-body d-flex flex-center flex-column">
                        <p
                          style={{ fontSize: "16px", fontWeight: "700" }}
                          className="text-center"
                        >
                          {expert?.expertName}{" "}
                        </p>
                        <p
                          style={{
                            fontSize: "14px",
                            fontWeight: "400",
                          }}
                          className="mb-5 text-center"
                        >
                          {expert?.experiences?.[0]?.[
                            `specializationName${
                              intl.locale === "ar" ? "Ar" : "En"
                            }`
                          ]
                            ? expert.experiences[0][
                                `specializationName${
                                  intl.locale === "ar" ? "Ar" : "En"
                                }`
                              ]
                            : intl.formatMessage({ id: "NoSpecialization" })}
                          /tasks-notifications
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
                            pathname: `/knowledge-experts/knowledge-experts-profile/${expert?.id}`,
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
        {expetrs?.length > 0 ? (
          <div className="px-2 pt-3">
            <SystemPagination
              totalPages={totalPages}
              totalItems={totalItems}
              pageIndex={pageIndex}
              pageSize={pageSize}
              setPageIndex={setPageIndex}
              setPageSize={setPageSize}
            />
          </div>
        ) : (
          <div className="d-flex fw-bolder justify-content-center align-items-center">
            {intl.formatMessage({ id: "No_Experts_yet" })}
          </div>
        )}
      </div>
    </div>
  );
};

export { AdminExpertCard };
