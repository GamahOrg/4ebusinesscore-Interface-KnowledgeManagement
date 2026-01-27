import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Link, useNavigate, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { fetchSubKnowledgesCategories } from "../../../features/knowledge/knowledgeCategorySlice";
import { Categories } from "../../../models/KnowledgeCategories";
import { RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  editSubKnowledge,
  fetchSubKnowledge,
} from "../../../features/knowledge/subKnowledgeSlice";
import { ResponseStatus } from "../../../enums/responseStatus";
import { Button, Spinner } from "react-bootstrap";
import { ManagementHierarchyPopup } from "../../partials/ManagementHierarchyPopup";
import { EmployeeHierarchyPopup } from "../../partials/EmployeeHierarchyPopup";
import { editSubKnowledgeValidations } from "../../../validations/edit-subknowledge-validations copy";
import { useLocation } from "react-router-dom";
import { fetchOrgs } from "../../../features/users&departments/orgHierarchySlice";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import moment from "moment";
import DisplayErrorMessage from "@4eplatform/shared/functions/displayErrorMessage";
import { showSuccessAlert } from "@4eplatform/shared/services/helper";

export const KnowledgeEditKnowledge: FC = () => {
  let subKnowledgeId = useParams()?.id;
  const intl = useIntl();
  let language: string = intl.locale;
  let location = useLocation();
  let knowledgeId = location.state.knowledgeId || "";

  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [orgName, setOrgName] = useState("");
  const [orgId, setOrgId] = useState("");
  const [selectedImage, setSelectedImage] = useState<File[]>([]);
  const [oldImages, setOldImages] = useState<any>([]);
  const [show, setShow] = useState(false);
  const [modalHShow, setModalHShow] = useState<boolean>(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState<string[]>([]);
  const [employeeNames, setEmployeeNames] = useState<any>([]);
  const [orgIds, setOrgIds] = useState<string[]>([]);
  const [orgNames, setOrgNames] = useState([]);
  const maxDate: Date = new Date();
  const formattedMaxDate: string = maxDate.toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(editSubKnowledgeValidations),
    mode: "all",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (subKnowledgeId)
        await dispatch(fetchSubKnowledge(subKnowledgeId) as any);
    };
    fetchData();
  }, [subKnowledgeId, dispatch]);

  useEffect(() => {
    dispatch(fetchSubKnowledgesCategories({}) as any);
  }, [dispatch]);

  const subKnowledge = useSelector((state: RootState) => {
    return state?.SubKnowledges?.subKnowledge;
  });

  useEffect(() => {
    let params: any = {
      search: "",
    };
    dispatch(fetchOrgs(params) as any);
  }, [dispatch]);

  const managementsFromEdit = useSelector((state: RootState) => {
    const items = state?.orgHierarchy?.data;
    if (items) {
      const modifiedManagements = items.map((item: any) => ({
        ...item,
        collapsed: true,
        checked: false,
        mebmers: item?.mebmers?.map((ele: any) => {
          return { ...ele, checked: false };
        }),
      }));
      return modifiedManagements;
    }
    return items;
  });

  useEffect(() => {
    if (subKnowledge?.participatingParties) {
      setOrgName(
        intl.locale === "ar"
          ? subKnowledge?.participatingParties[0]?.nameAr
          : subKnowledge?.participatingParties[0]?.nameEn
      );
      setOrgId(subKnowledge?.participatingParties[0]?.id);
    }

    if (subKnowledge?.workParticipants) {
      setEmployeeId(
        subKnowledge?.workParticipants.map((employee) => {
          return employee?.userId as string;
        })
      );

      setEmployeeNames(
        managementsFromEdit
          ?.map((management) => {
            const matchedMember = management?.mebmers?.find((member: any) =>
              subKnowledge?.workParticipants?.some(
                (participant: any) => participant?.userId === member?.userId
              )
            );
            return matchedMember?.userNmae || "";
          })
          .filter((name) => name !== "")
      );
    }

    setValue("title", subKnowledge?.title);
    setValue("details", subKnowledge?.details);
    setValue("targets", subKnowledge?.targets);
    setValue("legislation", subKnowledge?.legislation);
    setValue("releaseDate", moment(subKnowledge?.date).format("YYYY-MM-DD"));
    if (subKnowledge?.knowledgeAttachments) {
      setValue("knowledgeAttachments", subKnowledge?.knowledgeAttachments);
      setValue("oldImages", subKnowledge?.knowledgeAttachments);
      setOldImages(subKnowledge?.knowledgeAttachments);
    }
  }, [subKnowledge]);
  const knowledgeCategory: Categories = useSelector(
    (state: RootState) => state?.knowledgeCategory.data
  );

  const knowledgeAttachments = watch("knowledgeAttachments");

  const cardTitle =
    location?.state?.serviceName || location?.state?.cardTitle || "";
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

    const newAttachments = knowledgeAttachments.filter(
      (attachment) => attachment instanceof File
    );
    newAttachments.forEach((file: File) => {
      formdata.append("knowledgeAttachments", file);
    });

    oldImages.forEach((url: string) => {
      formdata.append("KnowledgeOldAttachments", url?.filePath);
    });
    // const newImagesSize =
    //   selectedImage?.reduce((acc, file) => acc + file.size, 0) || 0;
    // if (newImagesSize > MAX_SIZE_BYTES) {
    //   showSuccessAlert(false, "MaxSizeAttachments", intl);
    //   return;
    // }
    let bodyRequest = { id: subKnowledgeId, body: formdata };
    setLoading(true);
    await dispatch(editSubKnowledge(bodyRequest) as any).then((res: any) => {
      if (
        res?.payload?.message === "SubKnowledgeIsUpdatedSuccessfully" &&
        res?.payload?.statusEnum === ResponseStatus.SavedSuccessfully
      ) {
        showSuccessAlert(true, "EditedSuccessfully", intl, () =>
          navigate(`/knowledge-general-knowledge/list/${knowledgeId}`, {
            state: { serviceName: cardTitle },
          })
        );
        setLoading(false);
      } else if (res?.payload?.message) {
        showSuccessAlert(false, res?.payload?.message, intl, () =>
          navigate(`/knowledge-general-knowledge/list/${knowledgeId}`, {
            state: { serviceName: cardTitle },
          })
        );
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    setValue("participatingParties", orgName);
  }, [orgId, orgName, setValue]);

  useEffect(() => {
    setValue(
      "workParticipants",
      employeeNames?.filter((name: string) => {
        return name !== undefined;
      })
    );
  }, [employeeId, employeeNames, setValue]);

  let formValues = watch();

  useEffect(() => {
    if (formValues?.workParticipants?.length > 0) {
      trigger("workParticipants");
    }
  }, [formValues.workParticipants, trigger]);

  useEffect(() => {
    if (formValues.participatingParties) {
      trigger("participatingParties");
    }
  }, [formValues.participatingParties, trigger]);

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
      defaultName: "EditKnowledge",
      name: "",
    },
  ];

  return (
    <>
      <DynamicToolbar
        defaultTitle="EditKnowledge"
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
                    <div className="col-12 col-md-6 col-lg-4">
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
                            value={orgName || ""}
                          />
                          <div
                            className="position-absolute translate-middle-y"
                            style={{
                              top: "50%",
                              left: intl.locale === "ar" ? "15px" : "",
                              right: intl.locale === "en" ? "15px" : "",
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
                    <div className="col-12 col-md-6 col-lg-4">
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
                            value={employeeNames?.join("-") || ""}
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
                      {/* {DisplayErrorMessage(
                        errors?.workParticipants?.message as string, intl , language
                      )} */}
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
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
                          className="form-control form-control-solid mb-3 mb-lg-2"
                          placeholder={intl.formatMessage({
                            id: "ReleaseDate",
                          })}
                          {...register("releaseDate")}
                        />
                        {errors.releaseDate && (
                          <p className="text-danger p-2">
                            {intl.formatMessage({
                              id: errors.releaseDate.message as string,
                            })}
                          </p>
                        )}
                      </div>
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
                                  alt="pic"
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
                              {subKnowledge?.knowledgeAttachments && (
                                <>
                                  <div>
                                    <ul>
                                      {knowledgeAttachments?.map(
                                        (file, index: number) => (
                                          <li
                                            key={index}
                                            className="d-flex gap-4 align-items-center my-2"
                                          >
                                            {(file?.fileName || file.name)
                                              ?.split("/")
                                              ?.pop()}
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                if (!(file instanceof File)) {
                                                  setOldImages((prev) =>
                                                    prev.filter(
                                                      (attachment) =>
                                                        attachment.filePath !==
                                                        file.filePath
                                                    )
                                                  );
                                                }

                                                setValue(
                                                  "knowledgeAttachments",
                                                  knowledgeAttachments.filter(
                                                    (attachment) =>
                                                      attachment !== file
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
                              {selectedImage && (
                                <>
                                  <div>
                                    <ul>
                                      {selectedImage?.map((file, index) => (
                                        <li
                                          key={index}
                                          className="d-flex gap-4 align-items-center my-2"
                                        >
                                          {file.name}
                                          <button
                                            onClick={(e) => {
                                              e.preventDefault();

                                              // Create updated list without the removed file
                                              const updatedFiles =
                                                selectedImage.filter(
                                                  (img) => img !== file
                                                );

                                              // Update local state
                                              setSelectedImage(updatedFiles);

                                              // 🔻 Update the form field as well
                                              setValue(
                                                "knowledgeAttachments",
                                                updatedFiles,
                                                { shouldValidate: true }
                                              );
                                            }}
                                            className="bg-transparent text-danger fw-bold border-0"
                                          >
                                            <i className="bi bi-trash fa-lg"></i>
                                          </button>
                                        </li>
                                      ))}
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
                                    knowledgeAttachments || [];
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
                          id: "Edit",
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
                        <span>{intl.formatMessage({ id: "Editing" })}</span>
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
        setEmployeeNames={setEmployeeNames}
        orgIds={orgIds}
        setOrgIds={setOrgIds}
        setOrgNames={setOrgNames}
      />
      <div className="modal fade" id="Rega_modal_viewallcards_hierarchy">
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
