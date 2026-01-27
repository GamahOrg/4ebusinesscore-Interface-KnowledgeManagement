import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { KTSVG } from "@4eplatform/gateway/src/app/helpers";
import AdvancedSearch from "./popup/AdvancedSearch";
import { useLocation, useNavigate } from "react-router-dom";
import { KnowledgeAddNewKnowledge } from "./knowledge-add-new-knowledge";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import {
  fetchPublicKnowledges,
  removeKnowledge,
} from "../../../features/knowledge/PublicknowledgeSlice";
import { SystemPagination } from "@4eplatform/shared/components/SystemPagination";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { fetchUserRoles } from "../../../features/knowledge/PrivateknowledgeSlice";
import { showSuccessAlert } from "@4eplatform/shared/services/helper";
import { DeletePopup } from "@4eplatform/shared/src/popups/DeletePopup";
import { KnowledgeEditNewKnowledge } from "./knowledge-edit-new-knowledge";
import { getColorClass } from "@4eplatform/shared/functions/getColor";
import { Spinner } from "react-bootstrap";

const KnowledgeGeneralKnowledge: FC = () => {
  const intl = useIntl();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showKnowledge, setShowKnowledge] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const handleCloseKnowledge = () => setShowKnowledge(false);
  const handleAddKnowledgeShow = () => setShowKnowledge(true);
  const [showEditKnowledge, setShowEditKnowledge] = useState(false);
  const handleCloseEditKnowledge = () => setShowEditKnowledge(false);
  const handleEditKnowledgeShow = () => setShowEditKnowledge(true);
  const [showDelete, setShowDelete] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [knowledgeId, setKnowledgeId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const Knowledges = useSelector((state: RootState) => {
    return state?.Publicknowledge.data.knowledges;
  });
  const totalPages = useSelector(
    (state: RootState) => state?.Publicknowledge?.data?.totalPages,
  );

  const totalItems = useSelector(
    (state: RootState) => state?.Publicknowledge?.data?.totalItems,
  );

  useEffect(() => {
    let params: any = {
      pageSize: searchTerm ? pageSize : pageSize,
      pageNumber: pageIndex,
      searchTerm: searchTerm,
    };
    setIsLoading(true);
    dispatch(fetchPublicKnowledges(params) as any).then((res: any) => {
      if (res?.payload?.statusEnum === 3) {
        setIsLoading(false);
      }
    });
  }, [pageIndex, pageSize, searchTerm]);

  const filteredKnowledges = Knowledges?.filter(
    (Knowledge) => Knowledge?.knowledgeType === 1,
  );

  let location = useLocation();

  let cardName = location?.state?.cardTitle;
  let serviceName = location?.state?.serviceName;

  const breadcrumbItems = [
    {
      path: "",
      defaultName: "GeneralKnowledge",
      name: cardName || serviceName,
    },
  ];

  const cardTitle =
    location?.state?.serviceName || location?.state?.cardTitle || "";

  let userId = JSON.parse(localStorage.getItem("userInfo") as string)?.id;

  useEffect(() => {
    dispatch(
      fetchUserRoles({ id: userId, pageSize: 10000, pageNumber: 1 }) as any,
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
        role?.roleNameAr === "مدير النظام"
      );
    })?.length > 0
      ? true
      : false;

  const deleteHandler = async (id: string) => {
    await dispatch(removeKnowledge(id) as any).then((res: any) => {
      if (res.payload.response.statusEnum == 1) {
        showSuccessAlert(true, "DeletedSuccessfully", intl);
        dispatch(
          fetchPublicKnowledges({
            pageSize: searchTerm ? pageSize : pageSize,
            pageNumber: pageIndex,
            searchTerm: searchTerm,
          }) as any,
        );
      } else if (res?.payload?.response?.message)
        showSuccessAlert(false, res.payload.response.message, intl);
    });
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <DynamicToolbar
            defaultTitle="GeneralKnowledge"
            extraTitle={cardName || serviceName}
            breadcrumbItems={breadcrumbItems}
            showWorkspace={true}
            cardOption={cardName || serviceName}
          />
        </div>
        {isHasMangerOfKnowledge ? (
          <div>
            <button
              className="btn btn-bg-white btn-active-color-primary"
              onClick={handleAddKnowledgeShow}
            >
              {intl.formatMessage({
                id: "AddKnowledge",
              })}
            </button>
          </div>
        ) : (
          ""
        )}
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
            <div className="card mb-5 mb-xl-8">
              <div className="d-flex align-items-center justify-content-between  pt-5">
                <div className="row card-body py-3">
                  <div className="col-12 col-sm-8 col-md-8 col-xl-4 col-lg-4 col-md-4 col-sm-4 position-relative text-center ms-md-0">
                    <input
                      type="text"
                      name="searchForProject"
                      className="form-control form-control-solid w-250px pe-15"
                      placeholder={intl.formatMessage({ id: "Search" })}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <i className="fa-solid fa-light fa-magnifying-glass fs-3 fa-fw position-absolute serch-ico"></i>
                  </div>
                  <div className="d-flex justify-content-end col-12 col-sm-4 col-md-4 col-lg-4 col-xl-8 mt-4 mt-sm-0">
                    <button
                      className="btn btn-primary w-100 w-lg-25 w-md-75 w-sm-75 "
                      onClick={handleShow}
                    >
                      <span className="svg-icon svg-icon-3 svg-icon-gray-500 mx-2">
                        <KTSVG path="/media/icons/duotune/general/gen065.svg" />
                      </span>
                      <span className="fw-bolder text-light">
                        {intl.formatMessage({
                          id: "AdvancedSearch",
                        })}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              {isLoading ? (
                <div className="d-flex gap-4 justify-content-center align-items-center py-4">
                  {intl.formatMessage({ id: "LoadingData" })}
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : filteredKnowledges?.length === 0 ? (
                <div className="d-flex fw-bolder justify-content-center align-items-center">
                  {intl.formatMessage({ id: "No_data_yet" })}
                </div>
              ) : (
                <div>
                  <div className="row card-body py-3 mb-5">
                    {filteredKnowledges?.map((knowledge) =>
                      knowledge?.knowledgeType === 1 ? (
                        <div
                          className="col-12 col-sm-6 col-md-3"
                          key={knowledge?.id}
                        >
                          <div className="shadow-sm p-3 m-1 bg-body rounded d-flex flex-column justify-content-evenly align-items-center h-300px">
                            {isHasMangerOfKnowledge && (
                              <div className="d-flex gap-3 justify-content-end w-100">
                                <div
                                  className="w-25px h-25px p-5 border border-primary rounded d-flex justify-content-center align-items-center bg-hover-primary text-hover-white"
                                  onClick={() => {
                                    setKnowledgeId(knowledge?.id);
                                    handleEditKnowledgeShow();
                                  }}
                                >
                                  <i className="fa-solid fa-pen-to-square fs-4 text-primary"></i>
                                </div>

                                <div
                                  className="w-25px h-25px p-5 border border-danger rounded d-flex justify-content-center align-items-center bg-hover-danger text-hover-white"
                                  onClick={() => {
                                    setKnowledgeId(knowledge?.id);
                                    handleShowDelete();
                                  }}
                                >
                                  <i className="fas fa-trash-alt fs-4 text-danger"></i>
                                </div>
                              </div>
                            )}
                            <div
                              className="d-flex h-100 flex-column gap-8 justify-content-center align-items-center"
                              onClick={() =>
                                navigate(
                                  `/knowledge-general-knowledge/list/${knowledge.id}`,
                                  {
                                    state: {
                                      serviceName: cardTitle,
                                      knowledgeName: knowledge?.name,
                                    },
                                  },
                                )
                              }
                              role="button"
                            >
                              <div className="bg-primary bg-opacity-10 rounded-2 p-4">
                                <div
                                  className={`Knowledge svg-icon svg-icon-4x svg-icon-${getColorClass(
                                    knowledge?.color,
                                  )}`}
                                  dangerouslySetInnerHTML={{
                                    __html: knowledge?.icon.includes("fs-2x")
                                      ? knowledge?.icon
                                      : knowledge?.icon.replace(
                                          /class=["']/,
                                          'class="fs-2x ',
                                        ),
                                  }}
                                />
                              </div>
                              <p className="h2 fw-bolder">{knowledge?.name}</p>
                            </div>
                          </div>
                        </div>
                      ) : null,
                    )}
                  </div>
                </div>
              )}
            </div>
            {!isLoading && (filteredKnowledges?.length ?? 0) > 0 && (
              <SystemPagination
                pageIndex={pageIndex}
                pageSize={pageSize}
                setPageIndex={setPageIndex}
                setPageSize={setPageSize}
                totalPages={totalPages}
                totalItems={totalItems}
              />
            )}
          </div>
        </div>
      </div>
      <div className="modal fade" aria-hidden="true">
        <AdvancedSearch handleClose={handleClose} show={show} />
      </div>
      <div className="modal fade" aria-hidden="true">
        <KnowledgeAddNewKnowledge
          handleClose={handleCloseKnowledge}
          show={showKnowledge}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        <KnowledgeEditNewKnowledge
          handleClose={handleCloseEditKnowledge}
          show={showEditKnowledge}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          knowledgeId={knowledgeId}
        />
        <DeletePopup
          handleCloseDelete={handleCloseDelete}
          showDelete={showDelete}
          handleDelete={() => deleteHandler(knowledgeId)}
        />
      </div>
    </>
  );
};

export { KnowledgeGeneralKnowledge };
