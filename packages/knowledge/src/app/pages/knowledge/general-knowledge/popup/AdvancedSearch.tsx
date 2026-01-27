import React, { ChangeEvent, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Modal from "react-bootstrap/Modal";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../../../../store/store";
import { fetchKnowledgesCategories } from "../../../../features/knowledge/knowledgeCategorySlice";
import { fetchSubKnowledges } from "../../../../features/knowledge/subKnowledgeSlice";
import { ManagementHierarchyPopup } from "../../../partials/ManagementHierarchyPopup";
import { useNavigate } from "react-router-dom";
import { showSuccessAlert } from "@4eplatform/shared/services/helper";


type PopupProps = {
  show?: any;
  handleClose?: any;
};

const AdvancedSearch: React.FC<PopupProps> = ({ show, handleClose }) => {
  const intl = useIntl();
  const [modalHShow, setModalHShow] = useState<boolean>(false);
  const [orgId, setOrgId] = useState("");
  const [orgName, setOrgName] = useState("");
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState({
    title: "",
    tags: "",
    createdOn: "",
    date: "",
    orgHierarchyId: "",
    knowledgeType: 1,
  });
  const dispatch = useAppDispatch();
  let navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchKnowledgesCategories({}) as any);
  }, [dispatch]);

  const knowledgeCategory = useAppSelector(
    (state: RootState) => state?.knowledgeCategory.data
  );
  const filteredSubKnowledge = useAppSelector(
    (state: RootState) => state?.SubKnowledges?.subKnowledges?.result
  );
  const handleFilterChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({ ...prevFilter, [name]: value }));
  };
  const handleApplyFilter = async (e: React.FormEvent) => {
    e.preventDefault();
    const params = {
      pageSize: 1000,
      title: filter.title,
      taggedWords: filter.tags,
      createdOn: filter.createdOn,
      date: filter.date,
      orgHierarchyId: orgId,
      knowledgeType: filter.knowledgeType,
    };

    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== undefined && value !== null && value !== ""
      )
    );

    if (Object.keys(filteredParams).length !== 0) {
      await dispatch(fetchSubKnowledges(filteredParams) as any).then(
        (res: any) => {
          setData(res?.payload?.result);
          setMessage(res.payload.message);
        }
      );
      showSuccessAlert(true , "FilteredSuccessfully" , intl);
      setFilter({
        createdOn: "",
        date: "",
        title: "",
        tags: "",
        orgHierarchyId: "",
        knowledgeType: 1,
      });
      handleClose();
    }
    handleClose();
  };
  useEffect(() => {
    if (message) {
      navigate(
        "/knowledge-general-knowledge/list/00000000-0000-0000-0000-000000000000",
        {
          state: {
            filteredSubKnowledge: data,
            comeFrom: "advancedSearch",
          },
        }
      );
    }
  }, [data, message]);

  return (
    <>
      <div className="modal-dialog modal-dialog-centered mw-1000px">
        <Modal
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={show}
          onHide={handleClose}
        >
          <div className="card">
            <Modal.Header
              closeButton
              style={{
                alignItems: intl.locale == "ar" ? "flex-start" : "center",
                flexDirection: intl.locale == "en" ? "column-reverse" : "row",
              }}
            >
              <div className="card-header w-100 px-1 d-flex justify-content-center pb-2  border-bottom-0 mt-10">
                <Modal.Title>
                  <h3 className="card-title flex-column align-items-center">
                    <span className="card-label fw-bolder fs-3 mb-2 ">
                      {intl.formatMessage({
                        id: "AdvancedSearch",
                      })}
                    </span>
                    <span className="mt-1 fw-semibold fs-5 text-muted">
                      {intl.formatMessage({
                        id: "PleaseEnterTheData",
                      })}
                    </span>
                  </h3>
                </Modal.Title>
              </div>
            </Modal.Header>
            <Modal.Body>
              <div className="row my-2">
                <div className="col-sm-6 col-12 col-md-6">
                  <div className="mb-2 pt-2 pb-3 ">
                    <label className="form-label px-2  fs-6 text-gray-700">
                      {intl.formatMessage({ id: "Address" })}
                    </label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="fas fa-book-reader special"></i>
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={intl.formatMessage({
                          id: "Address",
                        })}
                        name="title"
                        value={filter.title}
                        onChange={handleFilterChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-12 col-md-6">
                  <div className="mb-2 pt-2 pb-3 ">
                    <label className="form-label px-2  fs-6 text-gray-700">
                      {intl.formatMessage({ id: "EntityName" })} (
                      {intl.formatMessage({ id: "DocumentOwner" })})
                    </label>

                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="special fas fa-user-shield"></i>
                        </span>
                      </div>
                      <input
                        style={{
                          paddingLeft: intl.locale == "ar" ? "2.75rem" : "",
                          paddingRight: intl.locale == "en" ? "2.75rem" : "",
                        }}
                        type="text"
                        className="form-control"
                        id="organizationHierarchyId"
                        placeholder={intl.formatMessage({
                          id: "ParticipantEntity",
                        })}
                        disabled
                        value={orgName}
                      />
                      <div
                        className="position-absolute translate-middle-y"
                        style={{
                          top: "50%",
                          left: intl.locale == "ar" ? "15px" : "",
                          right: intl.locale == "en" ? "15px" : "",
                        }}
                      >
                        <i
                          className="bi bi-diagram-3 cursor-pointer fs-1 text-muted"
                          onClick={() => setModalHShow(true)}
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row my-2">
                <div className="col-sm-6 col-12 col-md-6">
                  <div className="mb-2 pt-2 pb-3 ">
                    <label className="form-label px-2  fs-6 text-gray-700">
                      {intl.formatMessage({ id: "EstablishedDate" })}
                    </label>

                    <input
                      type="date"
                      className="form-control form-control-lg form-control-solid mb-3 mb-lg-2"
                      placeholder={intl.formatMessage({
                        id: "EstablishedDate",
                      })}
                      name="createdOn"
                      value={filter.createdOn}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>
                <div className="col-sm-6 col-12 col-md-6">
                  <div className="mb-2 pt-2 pb-3 ">
                    <label className="form-label px-2  fs-6 text-gray-700">
                      {intl.formatMessage({ id: "ReleaseDate" })}
                    </label>

                    <input
                      type="date"
                      className="form-control form-control-lg form-control-solid mb-3 mb-lg-2"
                      placeholder={intl.formatMessage({
                        id: "ReleaseDate",
                      })}
                      name="date"
                      value={filter.date}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>
                <div className="col-sm-6 col-12 col-md-6">
                  <div className="mb-2 pt-2 pb-3 ">
                    <label className="form-label px-2  fs-6 text-gray-700">
                      {intl.formatMessage({ id: "Tags" })}
                    </label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="fas fa-tags special"></i>
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={intl.formatMessage({
                          id: "Tags",
                        })}
                        name="tags"
                        value={filter.tags}
                        onChange={handleFilterChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="justify-content-center py-2">
              <div className="mt-5 mb-5 col-12 col-lg-7 mx-auto">
                <div className="outputCard card-diff-toolbar w-100 mt-3 d-flex justify-content-center">
                  <div className="d-flex justify-content-center align-items-center w-50">
                    <div
                      className="btn btn-secondary mx-1 text-center w-100"
                      onClick={handleClose}
                    >
                      {intl.formatMessage({ id: "Cancel" })}
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyFilter}
                      className="btn btn-success mx-1 text-center w-100"
                      style={{ border: "none" }}
                    >
                      {intl.formatMessage({ id: "Agree" })}
                    </button>
                  </div>
                </div>
              </div>
            </Modal.Footer>
          </div>
        </Modal>
      </div>
      <div
        className="modal fade"
        id="Rega_modal_viewallcards_hierarchy"
        aria-hidden="true"
      >
        <ManagementHierarchyPopup
          show={modalHShow}
          orgId={orgId}
          setOrgId={setOrgId}
          orgName={orgName}
          setOrgName={setOrgName}
          handleClose={() => {
            setModalHShow(false);
          }}
        />
      </div>
    </>
  );
};

export default AdvancedSearch;
