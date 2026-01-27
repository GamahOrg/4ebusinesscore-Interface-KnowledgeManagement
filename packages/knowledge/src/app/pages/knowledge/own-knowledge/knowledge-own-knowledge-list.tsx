import { FC, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useIntl } from "react-intl";
import { SystemPagination } from "../../partials/SystemPagination";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../store/store";
import {
  fetchSubKnowledges,
  removeSubKnowledge,
  toggleFavorite,
} from "./../../../features/knowledge/subKnowledgeSlice";
import { AddRatingKnowledgePopup } from "../../partials/AddRatingKnowledgePopup";
import { DeletePopup } from "../../partials/DeletePopup";
import { showSuccessAlert } from "@4eplatform/shared/services/helper";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { fetchUserRoles } from "../../../features/knowledge/PrivateknowledgeSlice";
import { Spinner } from "react-bootstrap";

import moment from "moment";
const EN_LANG = "en";

export const KnowledgeOwnKnowledgeList: FC = () => {
  const [showDelete, setShowDelete] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);

  let knowledgeId = useParams().id;
  const [modalRShow, setModalRShow] = useState<boolean>(false);
  const intl = useIntl();
  const location = useLocation();
  const { filteredSubKnowledge, comeFrom } = location?.state ?? {};

  let selectedLang: any = localStorage.getItem("i18nConfig");
  try {
    selectedLang = JSON.parse(selectedLang).selectedLang;
  } catch (err) {}
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();

  const dispatch = useAppDispatch();
  const initialSubknowledge = useSelector(
    (state: RootState) => state?.SubKnowledges?.subKnowledges?.result
  );
  const totalPages = useSelector(
    (state: RootState) => state?.SubKnowledges?.subKnowledges?.totalPages
  );

  const [subKnowledges, setSubKnowledges] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [subKnowledgeId, setSubKnowledgeId] = useState("");
  const [subKnowledgeRates, setSubKnowledgeRates] = useState("");
  const [showAddSubKnowledge, setShowAddSubKnowledge] =
    useState<boolean>(false);

  const getKnowledge = async (id: string) => {
    await dispatch(
      fetchSubKnowledges({
        knowledgeId: id,
        PageNumber: currentPage,
        PageSize: pageSize,
      }) as any
    );
    setIsLoading(false);
  };
  useEffect(() => {
    if (id && id != "00000000-0000-0000-0000-000000000000") {
      getKnowledge(id);
    }
  }, [currentPage, pageSize, dispatch, id]);

  useEffect(() => {
    if (initialSubknowledge) {
      setSubKnowledges(initialSubknowledge);
    }
  }, [initialSubknowledge]);

  useEffect(() => {
    if (
      comeFrom === "advancedSearch" &&
      id === "00000000-0000-0000-0000-000000000000" &&
      filteredSubKnowledge
    ) {
      setIsLoading(false);
      setSubKnowledges(filteredSubKnowledge);
      setShowAddSubKnowledge(true);
    }
  }, [comeFrom, filteredSubKnowledge, id]);

  const handleToggleFavorite = (subId: string) => {
    dispatch(toggleFavorite(subId)).then((response: any) => {
      if (response.payload.statusEnum === 1) {
        const updatedSubKnowledges = subKnowledges.map((subKnowledge: any) => {
          if (subKnowledge.id === subId) {
            return {
              ...subKnowledge,
              isFavoirate: !subKnowledge.isFavoirate,
            };
          }
          return subKnowledge;
        });
        setSubKnowledges(updatedSubKnowledges);
      }
    });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const deleteHandler = async (id: string) => {
    await dispatch(removeSubKnowledge(id) as any).then((res: any) => {
      if (res.payload.response.statusEnum == 1) {
        showSuccessAlert(true, "DeletedSuccessfully", intl);
      }
    });
  };

  let cardName = location?.state?.cardTitle;
  let serviceName = location?.state?.serviceName;

  const breadcrumbItems = [
    {
      path: "/knowledge-own-knowledge",
      defaultName: "OwnKnowledge",
      name: cardName || serviceName,
    },
    {
      path: "",
      defaultName: "KnowledgeList",
      name: "",
    },
  ];
  const cardTitle =
    location?.state?.serviceName || location?.state?.cardTitle || "";

  let userId = JSON.parse(localStorage.getItem("userInfo") as string)?.id;

  useEffect(() => {
    dispatch(
      fetchUserRoles({ id: userId, pageSize: 10000, pageNumber: 1 }) as any
    );
  }, []);

  const userRoles = useSelector((state: RootState) => {
    return state?.Privateknowledge?.userRoles;
  });

  let isHasMangerOfKnowledge =
    userRoles?.filter((role) => {
      return (
        role?.roleNameAr === "مدير اداره المعرفة" ||
        role?.roleNameAr === "مدير إداره المعرفه" ||
        role?.roleNameAr === "مدير ادارة المعرفة" ||
        role?.roleNameAr === "مدير إداره المعرفه" ||
        role?.roleNameAr === "مدير إدارة المعرفة" ||
        role?.roleNameAr === "مدير النظام"
      );
    })?.length > 0
      ? true
      : false;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <DynamicToolbar
            defaultTitle="KnowledgeList"
            extraTitle=""
            breadcrumbItems={breadcrumbItems}
            showWorkspace={true}
            cardOption={cardName || serviceName}
          />
        </div>
        {!showAddSubKnowledge && isHasMangerOfKnowledge ? (
          <div>
            <Link
              to={`/knowledge-own-knowledge/list/add/${knowledgeId}`}
              state={{
                serviceName: cardTitle,
              }}
              className="btn btn-bg-white btn-active-color-primary"
            >
              {intl.formatMessage({
                id: "AddKnowledge",
              })}
            </Link>
          </div>
        ) : null}
      </div>
      <div
        id="kt_content_container"
        className="d-flex flex-column-fluid align-items-start container-xxl p-0"
      >
        <div className="content flex-row-fluid" id="kt_content">
          <div
            className="flex-lg-row-fluid"
            data-select2-id="select2-data-129-tmo1"
          >
            {isLoading ? (
              <div className="d-flex gap-4 justify-content-center align-items-center py-4">
                {intl.formatMessage({ id: "LoadingData" })}
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <div className="card mb-5 mb-xl-8">
                <div className="row card-body py-8">
                  {subKnowledges && subKnowledges.length > 0 ? (
                    subKnowledges?.map((SubKnowledge: any) => (
                      <div
                        className="col-12 border-bottom border-2 py-4 mt-4"
                        key={SubKnowledge.id}
                      >
                        <div className="d-flex justify-content-between">
                          <div className="pb-6 d-flex gap-2 align-items-center">
                            <div className="d-flex flex-column gap-2">
                              {SubKnowledge?.date ? (
                                <>
                                  <div>
                                    <i className="fas fa-calendar-alt mx-2 text-muted fa-xl"></i>
                                    <span className="text-muted">
                                      {intl.formatMessage({
                                        id: "ReleaseDate",
                                      })}
                                      :{" "}
                                      {moment(SubKnowledge?.date).format(
                                        "YYYY-MM-DD"
                                      )}
                                    </span>
                                  </div>
                                </>
                              ) : (
                                ""
                              )}
                              {SubKnowledge?.createdOn && (
                                <div>
                                  <i className="fas fa-calendar-alt mx-2 text-muted fa-xl"></i>
                                  <span className="text-muted">
                                    {intl.formatMessage({
                                      id: "CreatedDate",
                                    })}
                                    :{" "}
                                    {moment(SubKnowledge.createdOn).format(
                                      "YYYY-MM-DD"
                                    )}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          {isHasMangerOfKnowledge && (
                            <div className="d-flex gap-3">
                              <Link
                                to={`/knowledge-own-knowledge/list/edit/${SubKnowledge?.id}`}
                                state={{
                                  knowledgeId: knowledgeId,
                                  serviceName: cardTitle,
                                }}
                              >
                                <div className="w-25px h-25px p-5 border border-primary rounded d-flex justify-content-center align-items-center bg-hover-primary text-hover-white">
                                  <i className="fa-solid fa-pen-to-square fs-4 text-primary"></i>
                                </div>
                              </Link>
                              <div
                                className="w-25px h-25px p-5 border border-danger rounded d-flex justify-content-center align-items-center bg-hover-danger text-hover-white"
                                onClick={() => {
                                  setSubKnowledgeId(SubKnowledge?.id);
                                  handleShowDelete();
                                }}
                              >
                                <i className="fas fa-trash-alt fs-4 text-danger"></i>
                              </div>
                            </div>
                          )}
                        </div>
                        <Link
                          to={`/knowledge-own-knowledge/list/details/${id}/${SubKnowledge?.id}`}
                          state={{
                            serviceName: cardTitle,
                          }}
                          className="text-primary fw-bolder"
                        >
                          {SubKnowledge?.title}
                        </Link>
                        <div className="my-5 text-muted">
                          {SubKnowledge?.details}
                        </div>

                        <div className="row d-flex align-items-center justify-content-between my-5">
                          <div
                            className={`col-lg-4 col-md-4 col-sm-6 col-12 d-flex justify-content-between flex-wrap mt-2 ${
                              selectedLang === EN_LANG && "ms-0"
                            }`}
                          >
                            <div>
                              <i className="bi bi-justify fa-xl"></i>
                              <span className="ms-2">
                                {" "}
                                {intl.locale === "ar"
                                  ? SubKnowledge?.orgNameAr
                                  : SubKnowledge?.orgNameEn}
                              </span>
                            </div>
                          </div>
                          <div className="col-lg-8 col-md-8 col-sm-6 col-12 d-flex justify-content-between flex-wrap mt-2 gap-2">
                            <span className="m-0  p-3">
                              <i className="bi bi-justify fa-xl"></i>
                              <span>{SubKnowledge?.knowledgeName}</span>
                            </span>
                            <span
                              className="m-0 border border-1 rounded p-3"
                              role="button"
                            >
                              <i className="bi bi-eye mx-2 fa-xl"></i>
                              <span>
                                {SubKnowledge?.knowledgeViews}{" "}
                                {intl.formatMessage({ id: "View" })}
                              </span>
                            </span>
                            <span
                              className={`m-0 border border-1 rounded p-3`}
                              role="button"
                              onClick={() =>
                                handleToggleFavorite(SubKnowledge.id)
                              }
                            >
                              <i
                                className={`bi bi-heart-fill mx-2 fa-xl ${
                                  SubKnowledge?.isFavoirate
                                    ? "text-danger"
                                    : "text-muted"
                                }`}
                              ></i>
                              <span>
                                {intl.formatMessage({ id: "TheFavorites" })}
                              </span>
                            </span>
                            <span
                              className="m-0 border border-1 rounded p-3"
                              role="button"
                              onClick={() => {
                                setSubKnowledgeRates(
                                  SubKnowledge?.knowledgeRates
                                );
                                setSubKnowledgeId(SubKnowledge?.id);
                                setModalRShow(true);
                              }}
                            >
                              <i className="bi bi-star mx-2 fa-xl"></i>
                              <span>
                                {intl.formatMessage({ id: "Rating" })}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-12 text-center mt-4">
                      <p>{intl.formatMessage({ id: "No_data_yet" })} </p>
                    </div>
                  )}
                  {subKnowledges?.length > 0 && (
                    <SystemPagination
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      onPageSizeChange={handlePageSizeChange}
                      pageSize={pageSize}
                      currentPage={currentPage}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="modal fade" id="Rega_modal_add_rating" aria-hidden="true">
        <AddRatingKnowledgePopup
          show={modalRShow}
          handleClose={() => setModalRShow(false)}
          subKnowledgeId={subKnowledgeId}
          subKnowledgeRates={subKnowledgeRates}
          SubKnowledges={subKnowledges}
          setSubKnowledges={setSubKnowledges}
        />
      </div>
      <div className="modal fade" aria-hidden="true">
        <DeletePopup
          handleCloseDelete={handleCloseDelete}
          showDelete={showDelete}
          onConfirem={() => deleteHandler(subKnowledgeId)}
        />
      </div>
    </>
  );
};
