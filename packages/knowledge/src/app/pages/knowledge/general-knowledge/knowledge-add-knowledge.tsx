import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { addSubKnowledgeValidations } from "../../../validations/add-subknowledge-validations";
import { fetchSubKnowledgesCategories } from "../../../features/knowledge/knowledgeCategorySlice";
import { Categories } from "../../../models/KnowledgeCategories";
import { RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { addSubKnowledge } from "../../../features/knowledge/subKnowledgeSlice";
import { ResponseStatus } from "../../../enums/responseStatus";
import { Button, Spinner } from "react-bootstrap";
import { EmployeeHierarchyPopup } from "../../partials/EmployeeHierarchyPopup";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { SubKnowledgeManagementHierarchyPopup } from "./popup/SubKnowledgeManagementHierarchyPopup";
import DisplayErrorMessage from "@4eplatform/shared/functions/displayErrorMessage";
import { showSuccessAlert } from "@4eplatform/shared/services/helper";

export const KnowledgeAddKnowledge: FC = () => {
  let knowledgeId = useParams()?.id;
  const intl = useIntl();
  const language: string = intl.locale;
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [orgName, setOrgName] = useState("");
  const [orgId, setOrgId] = useState("");
  const [selectedImage, setSelectedImage] = useState<File[]>([]);
  const [show, setShow] = useState(false);
  const [modalHShow, setModalHShow] = useState<boolean>(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  let [employeeId, setEmployeeId] = useState<string[]>([]);
  let [orgIds, setOrgIds] = useState<string[]>([]);
  let [orgNames, setOrgNames] = useState<string[]>([]);
  let [employeeNames, setEmployeeNames] = useState<any>([]);
  const maxDate: Date = new Date();
  const formattedMaxDate: string = maxDate.toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    setValue,
    getValues,
    trigger,
    watch,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(addSubKnowledgeValidations),
    mode: "all",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    dispatch(fetchSubKnowledgesCategories({}) as any);
  }, [dispatch]);

  const knowledgeCategory: Categories = useSelector(
    (state: RootState) => state?.knowledgeCategory.data
  );

  const knowledgeAttachments = watch("knowledgeAttachments");

  const MAX_SIZE_MB = 100;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  const onSubmit = async (data: any) => {
    let formdata = new FormData();
    formdata.append("title", data?.title);
    formdata.append("details", data?.details);
    formdata.append("targets", data?.targets);
    formdata.append("legislation", data?.legislation);
    formdata.append("knowledgeId", knowledgeId as string);
    formdata.append("participatingParties", orgId);
    formdata.append("date", data?.releaseDate);
    employeeId
      ?.filter((id) => {
        return id !== undefined;
      })
      .forEach((employee) => {
        formdata.append("workParticipants", employee);
      });
    selectedImage.forEach((file) => {
      formdata.append("knowledgeAttachments", file);
    });
    // const totalSize = selectedImage?.reduce((acc, file) => acc + file.size, 0);
    // if (totalSize > MAX_SIZE_BYTES) {
    //   showSuccessAlert(false, "MaxSizeAttachments", intl);
    //   return;
    // }
    setLoading(true);
    await dispatch(addSubKnowledge(formdata) as any).then((res: any) => {
      if (
        res?.payload?.message === "SubKnowledgeIsAddedSuccessfully" &&
        res?.payload?.statusEnum === ResponseStatus.SavedSuccessfully
      ) {
        showSuccessAlert(true, "AddedSuccessfully", intl, () =>
          navigate(`/knowledge-general-knowledge/list/${knowledgeId}`, {
            state: { serviceName: cardTitle },
          })
        );
        setLoading(false);
      } else if (res?.payload?.message) {
        showSuccessAlert(false, res?.payload?.message, intl);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    setValue("participatingParties", orgName);
  }, [orgId, orgName]);
  useEffect(() => {
    setValue(
      "workParticipants",
      employeeNames?.filter((name: any) => {
        return name != undefined;
      })
    );
  }, [employeeId, employeeNames]);
  let formValues = watch();
  useEffect(() => {
    if (formValues?.workParticipants?.length > 0) {
      trigger("workParticipants");
    }
  }, [formValues.workParticipants]);
  useEffect(() => {
    if (formValues.participatingParties) {
      trigger("participatingParties");
    }
  }, [formValues.participatingParties]);

  let location = useLocation();

  let cardName = location?.state?.cardTitle;
  let serviceName = location?.state?.serviceName;

  const breadcrumbItems = [
    {
      path: "/knowledge-general-knowledge",
      defaultName: "GeneralKnowledge",
      name: cardName || serviceName,
    },
    {
      path: "",
      defaultName: "AddKnowledge",
      name: "",
    },
  ];
  const cardTitle =
    location?.state?.serviceName || location?.state?.cardTitle || "";
  return (
    <>
      <DynamicToolbar
        defaultTitle="AddKnowledge"
        extraTitle=""
        breadcrumbItems={breadcrumbItems}
        showWorkspace={true}
        cardOption={cardName || serviceName}
      />
      <div
        id="kt_content_container"
        className="d-flex flex-column-fluid align-items-start container-xxl p-0"
      >
        <div className="content flex-row-fluid" id="kt_content">
          <div
            className="flex-lg-row-fluid"
            data-select2-id="select2-data-129-tmo1"
          >
            <div className="card mb-5 mb-xl-8 pt-5">
              <form onSubmit={handleSubmit(onSubmit)} noValidate={true}>
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 my-4">
                      <div className="mb-2 pb-3">
                        <label className="form-label px-2 fs-6 text-gray-700 required">
                          {intl.formatMessage({
                            id: "KnowledgeAddress",
                          })}
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
                              id: "KnowledgeAddress",
                            })}
                            {...register("title")}
                          />
                        </div>
                        {DisplayErrorMessage(
                          errors?.title?.message as string,
                          intl,
                          language
                        )}
                      </div>
                    </div>
                    <div className="col-12 my-4">
                      <label className="form-label fs-6 text-gray-700 required">
                        {intl.formatMessage({
                          id: "KnowledgeDescription",
                        })}
                      </label>
                      <div className="bg-light my-4">
                        <textarea
                          className="form-control form-control-solid "
                          rows={5}
                          placeholder={intl.formatMessage({
                            id: "Description",
                          })}
                          {...register("details")}
                        />
                      </div>
                      {DisplayErrorMessage(
                        errors?.details?.message as string,
                        intl,
                        language
                      )}
                    </div>
                    <div className="col-12 my-4">
                      <label className="form-label fs-6 text-gray-700 required">
                        {intl.formatMessage({
                          id: "Goals",
                        })}
                      </label>
                      <div className="bg-light my-4">
                        <textarea
                          className="form-control form-control-solid "
                          rows={5}
                          placeholder={intl.formatMessage({
                            id: "Goals",
                          })}
                          {...register("targets")}
                        />
                      </div>
                      {DisplayErrorMessage(
                        errors?.targets?.message as string,
                        intl,
                        language
                      )}
                    </div>
                    <div className="col-12 my-4">
                      <label className="form-label fs-6 text-gray-700">
                        {intl.formatMessage({
                          id: "AdditionalNotes",
                        })}
                      </label>
                      <div className="bg-light my-4">
                        <textarea
                          className="form-control form-control-solid "
                          rows={5}
                          placeholder={intl.formatMessage({
                            id: "AdditionalNotes",
                          })}
                          {...register("legislation")}
                        />
                      </div>
                      {DisplayErrorMessage(
                        errors?.legislation?.message as string,
                        intl,
                        language
                      )}
                    </div>
                  </div>
                  <div className="row d-flex  my-2 pb-3">
                    <div className="col-12 col-md-6 col-lg-4 my-4">
                      <div className="mb-2 pt-2">
                        <label className="form-label px-2  fs-6 text-gray-700 required">
                          {intl.formatMessage({
                            id: "ParticipantEntity",
                          })}
                        </label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="special fas fa-user-shield"></i>
                            </span>
                          </div>
                          <input
                            style={{
                              paddingLeft:
                                intl.locale === "ar" ? "2.75rem" : "",
                              paddingRight:
                                intl.locale === "en" ? "2.75rem" : "",
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
                      {DisplayErrorMessage(
                        errors?.participatingParties?.message as string,
                        intl,
                        language
                      )}
                    </div>
                    <div className="col-12 col-md-6 col-lg-4 my-4">
                      <div className="mb-2 pt-2 position-relative">
                        <label className="form-label px-2  fs-6 text-gray-700">
                          {intl.formatMessage({
                            id: "ParticipantsWork",
                          })}
                        </label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="fas fa-users special"></i>
                            </span>
                          </div>
                          <input
                            type="text"
                            className="form-control"
                            placeholder={intl.formatMessage({
                              id: "ParticipantsWork",
                            })}
                            {...register("workParticipants")}
                            disabled
                            value={employeeNames?.join("-")}
                          />
                          <div className="h-110 d-flex" role="button">
                            <span
                              className="input-group-text"
                              onClick={handleShow}
                            >
                              <i className="bi bi-diagram-3 fs-3 text-muted"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4 my-4">
                      <div className="mb-2 pt-2">
                        <label className="form-label px-2  fs-6 text-gray-700 required">
                          {intl.formatMessage({
                            id: "ReleaseDate",
                          })}
                        </label>
                        <input
                          max={formattedMaxDate}
                          id="releaseDate"
                          type="date"
                          className="form-control form-control-solid"
                          placeholder={intl.formatMessage({
                            id: "ReleaseDate",
                          })}
                          {...register("releaseDate")}
                        />
                      </div>
                      {DisplayErrorMessage(
                        errors?.releaseDate?.message as string,
                        intl,
                        language
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 my-5">
                      <div className="mb-2 pt-2 pb-3">
                        <label className="form-label px-2  fs-6 text-gray-700 required">
                          {intl.formatMessage({ id: "Attachments" })}
                        </label>

                        <div className="w-100 d-flex bg-light-primary rounded border-primary border border-dashed mb-1 position-relative">
                          <label
                            htmlFor="outputAttachment"
                            className="form-label px-2  fontSz-6 dropzone-select  uploadFile-style inputAreaHeight"
                          >
                            <div className="row align-items-center">
                              <div className="d-flex gap-4 align-items-center">
                                <img
                                  src={"/media/pmo/uploadFile.png"}
                                  className="d-inline-block h-75"
                                />
                                <div>
                                  <p className="text-primary fw-bolder my-2 p-0">
                                    {intl.formatMessage({
                                      id: "QuickFileUploader",
                                    })}
                                  </p>
                                  <p className="p-0 my-1">
                                    {intl.formatMessage({
                                      id: "DragAndDropOrChooseFilesFromComputer",
                                    })}
                                  </p>
                                </div>
                              </div>
                              {knowledgeAttachments && (
                                <>
                                  <div>
                                    <ul>
                                      {Array.from(knowledgeAttachments)?.map(
                                        (file, index) => (
                                          <li
                                            key={index}
                                            className="d-flex justify-content-between align-items-center my-2"
                                          >
                                            {file.name}
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                setValue(
                                                  "knowledgeAttachments",
                                                  knowledgeAttachments.filter(
                                                    (attachement) =>
                                                      attachement !== file
                                                  ),
                                                  {
                                                    shouldValidate: true,
                                                    shouldTouch: true,
                                                    shouldDirty: true,
                                                  }
                                                );
                                              }}
                                              className="bg-transparent text-danger fw-bold border-0"
                                            >
                                              <i className="bi bi-trash fa-lg"></i>
                                            </button>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                </>
                              )}
                            </div>
                          </label>
                          <div
                            className="dropzone dropzone-queue mb-2"
                            id="kt_dropzonejs_example_3"
                          >
                            <div className="dropzone-panel mb-lg-0 mb-2">
                              <input
                                multiple
                                type="file"
                                id="outputAttachment"
                                className="dropzone-select w-100 uploadFile-style inputAreaHeight d-none"
                                {...register("knowledgeAttachments")}
                                onChange={(e) => {
                                  const newFiles = Array.from(
                                    e.target.files || []
                                  );
                                  const existingFiles =
                                    getValues("knowledgeAttachments") || [];
                                  const mergedFiles = [
                                    ...existingFiles,
                                    ...newFiles,
                                  ];
                                  setValue(
                                    "knowledgeAttachments",
                                    mergedFiles,
                                    {
                                      shouldValidate: true,
                                      shouldTouch: true,
                                    }
                                  );
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        {DisplayErrorMessage(
                          errors?.knowledgeAttachments?.message as string,
                          intl,
                          language
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-center pb-5 d-flex gap-4 flex-wrap justify-content-center align-items-center">
                    <Link
                      className="btn btn-secondary my-3 px-10 py-3 w-sm-25 w-100"
                      to="/knowledge-general-knowledge"
                      state={{
                        serviceName: cardTitle,
                      }}
                    >
                      {intl.formatMessage({
                        id: "Cancel",
                      })}
                    </Link>
                    {!loading ? (
                      <button
                        className="btn btn-success my-3 px-10 py-3 w-sm-25 w-100"
                        type="submit"
                      >
                        {intl.formatMessage({
                          id: "Add",
                        })}
                      </button>
                    ) : (
                      <Button
                        variant="success"
                        disabled
                        className="px-15 w-sm-25 w-100"
                      >
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="mx-2"
                        />
                        <span>{intl.formatMessage({ id: "Adding" })}</span>
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <EmployeeHierarchyPopup
        show={show}
        handleClose={handleClose}
        employeeIds={employeeId}
        setEmployeeIds={setEmployeeId}
        setOrgIds={setOrgIds}
        setOrgNames={setOrgNames}
        setEmployeeNames={setEmployeeNames}
      />
      <div
        className="modal fade"
        id="Rega_modal_viewallcards_hierarchy"
        aria-hidden="true"
      >
        <SubKnowledgeManagementHierarchyPopup
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
