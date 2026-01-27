import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";
import { AddPopup } from "../../partials/AddPopup";
import { KnowledgeOwnAddKnowledgeToolbar } from "./toolbar/KnowledgeOwnAddKnowledgeToolbar";
import Modal from "react-bootstrap/Modal";
import { useDispatch } from "react-redux";
import { addKnowledge } from "../../../features/knowledge/PublicknowledgeSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addOwnKnowledgeValidations } from "../../../validations/add-knowledge-validations";
import { EmployeeHierarchyPopup } from "../../partials/EmployeeHierarchyPopup";
import { fetchPrivateKnowledges } from "../../../features/knowledge/PrivateknowledgeSlice";
import { showSuccessAlert } from "@4eplatform/shared/services/helper";

type PopupProps = {
  show?: any;
  handleClose?: any;
  currentPage?: number;
  setCurrentPage?: any;
};

export const KnowledgeOwnAddNewKnowledge: FC<PopupProps> = ({
  show,
  handleClose,
  currentPage,
  setCurrentPage,
}) => {
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [showManagement, setShowManagement] = useState(false);
  let [orgIds, setOrgIds] = useState<string[]>([]);

  const handleShowManagement = () => setShowManagement(true);
  const intl = useIntl();

  const colorOptions = [
    {
      id: 1,
      name: "red",
    },
    {
      id: 2,
      name: "blue",
    },
    {
      id: 3,
      name: "green",
    },
    {
      id: 4,
      name: "yellow",
    },
  ];

  const dispatch = useDispatch();

  let [employeeNames, setEmployeeNames] = useState<string[]>([]);
  let [employeeId, setEmployeeId] = useState<string[]>([]);
  const [orgNames, setOrgNames] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<any>({
    resolver: yupResolver(addOwnKnowledgeValidations),
    mode: "onChange",
  });

  const onSubmit = async (data: any) => {
    const submitData = {
      name: data.name,
      knowledgeType: 0,
      icon: data.icon,
      color: data.colors,
      orgHierarchyId: orgIds,
      userIds: employeeId,
    };
    await dispatch(addKnowledge(submitData) as any).then((res: any) => {
      if (res.payload.statusEnum == 1) {
        setCurrentPage(1);
        reset();
        dispatch(
          fetchPrivateKnowledges({
            PageNumber: currentPage,
            PageSize: 10,
          }) as any
        );
        showSuccessAlert(true, "AddedSuccessfully", intl);
        handleClose();
        setValue("colors", "");
        setValue("employees", "");
        setEmployeeId([]);
        setOrgIds([]);
        setEmployeeNames([]);
      } else if (res.payload.message === "Knowledge Name Already exists!") {
        showSuccessAlert(false, "KnowledgeNameAlreadyExists", intl);
      }
    });
  };

  return (
    <>
      <KnowledgeOwnAddKnowledgeToolbar />
      <div className="modal-dialog modal-dialog-centered mw-850px">
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
                alignItems: intl.locale === "ar" ? "flex-start" : "center",
                flexDirection: intl.locale === "en" ? "column-reverse" : "row",
              }}
            >
              <div className="card-header w-100 px-1 d-flex justify-content-center pb-2  border-bottom-0 mt-10">
                <Modal.Title>
                  <h3 className="card-title align-items-center flex-column">
                    <span className="card-label fs-4 fw-bolder my-5">
                      {intl.formatMessage({
                        id: "AddNewKnowledge",
                      })}
                    </span>
                    <span className="mt-1 fw-semibold fs-5 text-gray-800">
                      {intl.formatMessage({
                        id: "PleaseEnterTheData",
                      })}
                    </span>
                  </h3>
                </Modal.Title>
              </div>
            </Modal.Header>

            <form
              className="form outputForm"
              onSubmit={handleSubmit(onSubmit)}
              noValidate={true}
              id="knowledge-Form"
            >
              <div className="card-body">
                <div className="row d-flex my-2">
                  <div className="col-12 col-md-6 col-lg-4">
                    <div className="mb-2 pt-2 pb-3 ">
                      <label className="form-label px-2  fs-6 text-gray-800">
                        {intl.formatMessage({
                          id: "KnowledgeName",
                        })}
                      </label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="fas fa-book-reader special"></i>
                          </span>
                        </div>
                        <input
                          {...register("name")}
                          type="text"
                          className="form-control text-gray-700"
                          placeholder={intl.formatMessage({
                            id: "KnowledgeName",
                          })}
                        />
                      </div>
                      {errors.name && (
                        <p className="text-danger p-2">
                          {intl.formatMessage({
                            id: errors.name.message as string,
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <div className="mb-2 pt-2 pb-3">
                      <label className="form-label px-2  fs-6 text-gray-800">
                        {intl.formatMessage({
                          id: "ManagementName",
                        })}
                      </label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="fas fa-users-cog special"></i>
                          </span>
                        </div>
                        <input
                          {...register("employees")}
                          value={
                            intl.locale == "ar"
                              ? orgNames?.map((name) => name?.nameAr)?.join("-")
                              : orgNames?.map((name) => name?.nameEn)?.join("-")
                          }
                          // value={employeeNames?.join("-")}
                          type="text"
                          className="form-control text-gray-700"
                          placeholder={intl.formatMessage({
                            id: "ManagementName",
                          })}
                        />
                        <div className="h-110 d-flex" role="button">
                          <span
                            className="input-group-text"
                            onClick={handleShowManagement}
                          >
                            <i className="bi bi-diagram-3 fs-3 text-muted"></i>
                          </span>
                        </div>
                      </div>
                      {errors.employees && (
                        <p className="text-danger p-2">
                          {intl.formatMessage({
                            id: errors.employees.message as string,
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <div className="mb-2 pt-2 pb-3">
                      <label className="form-label px-2 fs-6 text-gray-800">
                        {intl.formatMessage({
                          id: "Icons",
                        })}
                      </label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="fas fa-icons special"></i>
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control text-gray-700"
                          placeholder={intl.formatMessage({
                            id: "IconsLink",
                          })}
                          {...register("icon")}
                        />
                        <div className="h-110 d-flex" role="button">
                          <a
                            className="input-group-text"
                            href="https://fontawesome.com/v5/search?q=file&o=r&s=duotone"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className="bi bi-link fa-lg special"></i>
                          </a>
                        </div>
                      </div>
                      {errors.icon && (
                        <p className="text-danger p-2">
                          {intl.formatMessage({
                            id: errors.icon.message as string,
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row d-flex align-items-center my-2">
                  <div className="col-12 col-md-6 col-lg-4">
                    <div className="mb-2 pt-2 pb-3">
                      <label className="form-label px-2  fs-6 text-gray-800">
                        {intl.formatMessage({ id: "Color" })}
                      </label>

                      <div className="mx-auto mt-1  ">
                        <select
                          {...register("colors")}
                          className="form-select form-select-solid"
                          defaultValue={""}
                        >
                          <option className="text-gray-700" value={""} disabled>
                            {intl.formatMessage({ id: "SelectAColor" })}
                          </option>
                          {colorOptions?.map((color) => (
                            <option value={color?.name} key={color?.name}>
                              {intl.formatMessage({ id: color.name })}
                            </option>
                          ))}
                        </select>
                        {errors.colors && (
                          <p className="text-danger p-2">
                            {intl.formatMessage({
                              id: errors.colors.message as string,
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            <div className="p-3 text-center pb-5">
              <Link
                className="btn btn-secondary m-3 px-5 py-3"
                style={{ width: "125px" }}
                to="/knowledge-own-knowledge"
                onClick={handleClose}
              >
                {intl.formatMessage({
                  id: "Cancel",
                })}
              </Link>

              <button
                type="submit"
                className="btn btn-success m-3 px-5 py-3"
                style={{ width: "125px" }}
                form="knowledge-Form"
              >
                {intl.formatMessage({
                  id: "Add",
                })}
              </button>
            </div>
          </div>

          <div className="modal fade" id="Rega_modal_add" aria-hidden="true">
            <AddPopup
              show={modalShow}
              handleClose={() => setModalShow(false)}
            />
            handleClose{" "}
          </div>
          <div
            className="modal fade pt-20"
            id="rega_modal_departmental_organizational_structure"
            aria-hidden="true"
          >
            <EmployeeHierarchyPopup
              show={showManagement}
              handleClose={() => {
                setShowManagement(false);
              }}
              employeeIds={employeeId}
              setEmployeeIds={setEmployeeId}
              setEmployeeNames={setEmployeeNames}
              orgIds={orgIds}
              setOrgIds={setOrgIds}
              setOrgNames={setOrgNames}
            />
          </div>
        </Modal>
      </div>
    </>
  );
};
