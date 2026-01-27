import { Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { ResponseStatus } from "../../../../enums/responseStatus";

import {
  AddExpertExperiencesProps,
  AddExpertExperiencesSchema,
} from "../../../../validations/add-expert-experience-validation";
import {
  addExperiences,
  editExpertBasicInfo,
  getExpertById,
} from "../../../../features/experts/expertsSlice";
import { RootState } from "../../../../store/store";
import { getSpecializations } from "../../../../features/experts/specializationsSlice";
import { SpecializationModel } from "../../../../models/specializationsModel";
import { useParams } from "react-router-dom";
import {
  EditExpertBasicInfoProps,
  EditExpertBasicInfoSchema,
} from "../../../../validations/edit-expert-basic-info-validation";
import { TableRow } from "./TableRow";
import { fetchUsers } from "../../../../features/users&departments/usersSlice";
import { UserManagmentRootUrl } from "@4eplatform/shared/apis/user_management";
import DisplayErrorMessage from "@4eplatform/shared/functions/displayErrorMessage";
import { showSuccessAlert } from "@4eplatform/shared/services/helper";
import { toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";

const EditExpert = () => {
  const [imagePreview, setImagePreview] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        setFile(file);
        setImagePreview(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  }

  function handleCancel() {
    setImagePreview("/media/avatars/blank-img.png");
    setFile(null);
  }

  function handleRemove() {
    setImagePreview("/media/avatars/blank-img.png");
    setFile(null);
  }
  let { id } = useParams();
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);
  const intl = useIntl();
  let dispatch = useDispatch();
  let language = intl.locale;
  const {
    register: basicInfoRegister,
    handleSubmit: basicInfoHandleSubmit,
    setValue: basicInfoSetValue,
    reset: basicInfoReset,
    watch: basicInfoWatch,
    trigger: basicInfoTrigger,
    formState: { errors: basicInfoErrors },
  } = useForm<EditExpertBasicInfoProps>({
    resolver: yupResolver(EditExpertBasicInfoSchema),
    mode: "all",
    reValidateMode: "onSubmit",
  });
  let basicInfoValues = basicInfoWatch();
  const {
    register: experienceRegister,
    handleSubmit: experienceHandleSubmit,
    setValue: experienceSetValue,
    reset: experienceReset,
    watch: experienceWatch,
    trigger: experienceTrigger,
    formState: { errors: experienceErrors },
  } = useForm<AddExpertExperiencesProps>({
    resolver: yupResolver(AddExpertExperiencesSchema),
    mode: "all",
    reValidateMode: "onChange",
  });
  let [disabledSave, setDisabledSave] = useState(true);

  let specializations = useSelector((state: RootState) => {
    return state?.specializations?.data;
  });
  let expert = useSelector((state: RootState) => {
    return state?.experts?.expert;
  });

  const expertRootUrl =
    (window as any)._env_?.REACT_APP_API_AskExpert_Url + "/";

  useEffect(() => {
    dispatch(getSpecializations({}) as any);
  }, []);
  useEffect(() => {
    if (id) {
      dispatch(getExpertById(id as string) as any);
    }
  }, [id]);
  let users = useSelector((state: RootState) => {
    return state?.users?.data;
  });
  useEffect(() => {
    dispatch(fetchUsers({}) as any);
  }, []);
  useEffect(() => {
    basicInfoSetValue("firstName", expert?.firstName);
    basicInfoSetValue("secondName", expert?.secondName);
    basicInfoSetValue(
      "thirdName",
      expert?.thirdName !== "undefined" ? expert?.thirdName : ""
    );
    basicInfoSetValue(
      "forthName",
      expert?.fourthName !== "undefined" ? expert?.thirdName : ""
    );
    basicInfoSetValue("isOutsideFromSystem", expert?.isExternalExpert);
    if (
      expert?.imgUrl == null &&
      expert?.isExternalExpert == false &&
      users?.find((user) => {
        return user?.id == expert?.userId;
      })?.imageUrl
    ) {
      basicInfoSetValue(
        "imgUrl",
        UserManagmentRootUrl +
          users?.find((user) => {
            return user?.id == expert?.userId;
          })?.imageUrl
      );
      setImagePreview(
        users?.find((user) => {
          return user?.id == expert?.userId;
        })?.imageUrl
          ? UserManagmentRootUrl +
              users?.find((user) => {
                return user?.id == expert?.userId;
              })?.imageUrl
          : toAbsoluteUrl("/media/avatars/300-3.jpg")
      );
    } else if (
      expert?.imgUrl == null &&
      expert?.isExternalExpert == false &&
      !users?.find((user) => {
        return user?.id == expert?.userId;
      })?.imageUrl
    ) {
      basicInfoSetValue("imgUrl", "/media/avatars/300-3.jpg");
      setImagePreview("/media/avatars/300-3.jpg");
    } else {
      basicInfoSetValue("imgUrl", `${expertRootUrl}${expert?.imgUrl}`);
      setImagePreview(
        expert?.imgUrl
          ? `${expertRootUrl}${expert?.imgUrl}`
          : toAbsoluteUrl("/media/avatars/300-3.jpg")
      );
    }
    basicInfoSetValue("address", expert?.address);
    basicInfoSetValue(
      "phoneNumber",
      expert?.phoneNumber?.toString()?.replace("+966", "") as any
    );
    basicInfoSetValue("email", expert?.email);
    basicInfoSetValue("nationality", expert?.nationality);
    basicInfoSetValue("birthDate", expert?.birthDate?.split("T")[0]);
    basicInfoSetValue("informationAboutExpert", expert?.informationAboutExpert);
  }, [expert]);

  const AddExpertExperiences = async (
    formValues: AddExpertExperiencesProps
  ) => {
    let body = {
      experienceName: formValues.experienceName,
      experienceYears: formValues.experienceYears,
      specializationId: formValues.specializationId,
      jobLocation: formValues.jobLocation,
      expertId: id,
    };
    dispatch(addExperiences(body) as any).then((res: any) => {
      if (res?.payload?.statusEnum == ResponseStatus.SavedSuccessfully) {
        dispatch(getExpertById(id as string) as any);
        showSuccessAlert(true, "SavedSuccessfully", intl);
        experienceSetValue("experienceName", "");
        experienceSetValue("experienceYears", 0);
        experienceSetValue("jobLocation", "");
        experienceSetValue("specializationId", "");
        setDisabledSave(false);
      } else if (res?.payload?.message) {
        showSuccessAlert(
          false,
          res?.payload?.message == '["ExperienceYears must be greater than 0."]'
            ? "ExperienceYearsMustBeGreaterThan0"
            : res?.payload?.message == "Email is already in use!"
            ? "EmailIsAlreadyInUse"
            : res?.payload?.message,
          intl
        );
      }
    });
  };

  const EditExpertBasicInfo = async (formValues: EditExpertBasicInfoProps) => {
    let body = file
      ? {
          id,
          firstName: formValues.firstName,
          secondName: formValues.secondName,
          thirdName:
            formValues.thirdName == "" ? "undefined" : formValues.thirdName,
          fourthName:
            formValues.forthName == "" ? "undefined" : formValues.forthName,
          imgUrl: file,
          email: formValues.email,
          phoneNumber: formValues.phoneNumber
            ? `+966${formValues.phoneNumber}`
            : "",
          birthDate: formValues.birthDate,
          nationality: formValues.nationality,
          address: formValues.address,
          informationAboutExpert: formValues.informationAboutExpert,
          isExternalExpert: expert?.isExternalExpert,
        }
      : {
          id,
          firstName: formValues.firstName,
          secondName: formValues.secondName,
          thirdName:
            formValues.thirdName == "" ? "undefined" : formValues.thirdName,
          fourthName:
            formValues.forthName == "" ? "undefined" : formValues.forthName,
          email: formValues.email,
          phoneNumber: formValues.phoneNumber
            ? `+966${formValues.phoneNumber}`
            : "",
          birthDate: formValues.birthDate,
          nationality: formValues.nationality,
          address: formValues.address,
          informationAboutExpert: formValues.informationAboutExpert,
          isExternalExpert: expert?.isExternalExpert,
        };

    dispatch(editExpertBasicInfo(body) as any).then((res: any) => {
      if (res?.payload?.statusEnum == ResponseStatus.SavedSuccessfully) {
        showSuccessAlert(true, "SavedSuccessfully", intl);
      } else {
        showSuccessAlert(
          false,
          res?.payload?.message ==
            '["PhoneNumber must be a valid Saudi mobile number"]'
            ? "YouMustEnterValidSaudiNumber"
            : res?.payload?.message,
          intl
        );
      }
    });
  };
  return (
    <Fragment>
      <div className="card card-xl-stretch mb-xl-8 me-3">
        <div className="card-body py-3">
          <form onSubmit={basicInfoHandleSubmit(EditExpertBasicInfo)}>
            <div className="d-flex align-items-center justify-content-between py-5">
              <p
                style={{
                  fontWeight: "700",
                  width: "80%",
                  fontSize: "18px",
                }}
                className="mb-3"
              >
                {intl.formatMessage({ id: "BasicData" })}
              </p>
              <hr />
            </div>
            <hr />
            <div className="row mb-7 mt-5">
              <label
                style={{ color: "rgb(161, 165, 183)" }}
                className="col-lg-2 mb-2 mb-lg-0 fw-semibold fs-5"
              >
                {intl.formatMessage({ id: "ProfilePicture" })}
              </label>
              <div className="col-lg-9 px-5">
                <div
                  className="image-input image-input-outline px-5"
                  data-kt-image-input="true"
                  style={{
                    backgroundImage: `url(${"/media/svg/brand-logos/plurk.svg"})`,
                  }}
                >
                  <img
                    alt={""}
                    className=" w-125px h-125px"
                    src={imagePreview}
                    onError={(e: any) =>
                      (e.target.src = toAbsoluteUrl("/media/avatars/300-3.jpg"))
                    }
                  />

                  <label
                    className="btn btn-icon btn-circle btn-color-muted btn-active-color-primary w-25px h-25px bg-body shadow "
                    data-kt-image-input-action="change"
                    data-bs-toggle="tooltip"
                    data-bs-dismiss="click"
                    title="Change avatar"
                  >
                    <i className="fas fa-edit">
                      <span className="path1"></span>
                      <span className="path2"></span>
                    </i>

                    <input
                      type="file"
                      accept=".png, .jpg, .jpeg"
                      {...basicInfoRegister("imgUrl")}
                      onChange={handleImageChange}
                    />
                    {file && <input type="hidden" name="avatar_remove" />}
                  </label>

                  {file && (
                    <span
                      className="btn btn-icon btn-circle btn-color-muted btn-active-color-primary w-25px h-25px bg-body shadow"
                      data-kt-image-input-action="cancel"
                      data-bs-toggle="tooltip"
                      data-bs-dismiss="click"
                      title="Cancel avatar"
                      onClick={handleCancel}
                    >
                      <i className="fas fa-xmark "></i>
                    </span>
                  )}

                  {file && (
                    <span
                      className="btn btn-icon btn-circle btn-color-muted btn-active-color-primary w-25px h-25px bg-body shadow"
                      data-kt-image-input-action="remove"
                      data-bs-toggle="tooltip"
                      data-bs-dismiss="click"
                      title="Remove avatar"
                      onClick={handleRemove}
                    >
                      <i className="fas fa-xmark "></i>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="row mb-7">
              <div className="col-lg-2 fs-5 ms-3 mt-3 mb-2 mb-lg-0 fw-semibold"></div>
              <div className="col-lg-9 fv-row">
                <div className="row">
                  <div className="col-lg-3 col-md-5">
                    <div className="row">
                      <label
                        htmlFor="FirstName"
                        className="col-12 ms-3 mt-3 mb-2 fs-5 fw-semibold required"
                        style={{ color: "rgb(161, 165, 183)" }}
                      >
                        {intl.formatMessage({ id: "FirstName" })}
                      </label>
                      <div className="col-12">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="fas fa-user special"></i>
                            </span>
                          </div>
                          <input
                            type="text"
                            className="form-control"
                            id="FirstName"
                            readOnly
                            disabled
                            style={{ backgroundColor: "#F9F9F9" }}
                            {...basicInfoRegister("firstName")}
                          />
                          {DisplayErrorMessage(
                            basicInfoErrors?.firstName?.message as string,
                            intl,
                            language
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-5">
                    <div className="row">
                      <label
                        htmlFor="SecondName"
                        className="col-12 ms-3 mt-3 mb-2 fs-5 fw-semibold required"
                        style={{ color: "rgb(161, 165, 183)" }}
                      >
                        {intl.formatMessage({ id: "SecondName" })}
                      </label>
                      <div className="col-12">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="fas fa-user special"></i>
                            </span>
                          </div>
                          <input
                            type="text"
                            className="form-control"
                            id="SecondName"
                            readOnly
                            disabled
                            style={{ backgroundColor: "#F9F9F9" }}
                            {...basicInfoRegister("secondName")}
                          />
                          {DisplayErrorMessage(
                            basicInfoErrors?.secondName?.message as string,
                            intl,
                            language
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-5">
                    <div className="row">
                      <label
                        htmlFor="ThirdName"
                        className="col-12 ms-3 mt-3 mb-2 fs-5 fw-semibold"
                        style={{ color: "rgb(161, 165, 183)" }}
                      >
                        {intl.formatMessage({ id: "ThirdName" })}
                      </label>
                      <div className="col-12">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="fas fa-user special"></i>
                            </span>
                          </div>
                          <input
                            type="text"
                            className="form-control"
                            id="ThirdName"
                            style={{ backgroundColor: "#F9F9F9" }}
                            readOnly
                            disabled
                            {...basicInfoRegister("thirdName")}
                          />
                          {DisplayErrorMessage(
                            basicInfoErrors?.thirdName?.message as string,
                            intl,
                            language
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-5">
                    <div className="row">
                      <label
                        htmlFor="FourthName"
                        className="col-12 ms-3 mt-3 mb-2 fs-5 fw-semibold"
                        style={{ color: "rgb(161, 165, 183)" }}
                      >
                        {intl.formatMessage({ id: "FourthName" })}
                      </label>
                      <div className="col-12">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="fas fa-user special"></i>
                            </span>
                          </div>
                          <input
                            type="text"
                            className="form-control"
                            id="FourthName"
                            style={{ backgroundColor: "#F9F9F9" }}
                            {...basicInfoRegister("forthName")}
                            readOnly
                            disabled
                          />
                          {DisplayErrorMessage(
                            basicInfoErrors?.forthName?.message as string,
                            intl,
                            language
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-7">
              <label
                htmlFor="email"
                className={`col-lg-2 fs-5 ms-3 mt-3 mb-2 mb-lg-0 fw-semibold ${
                  basicInfoValues?.isOutsideFromSystem ? "required" : ""
                }`}
                style={{ color: "rgb(161, 165, 183)" }}
              >
                {intl.formatMessage({ id: "Email" })}
              </label>

              <div className="col-lg-9 fv-row">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="far fa-envelope special"></i>
                    </span>
                  </div>
                  <input
                    placeholder="M@gmail.com"
                    type="email"
                    className="form-control"
                    id="email"
                    style={{ backgroundColor: "#F9F9F9" }}
                    {...basicInfoRegister("email")}
                    readOnly
                    disabled
                  />
                  {DisplayErrorMessage(
                    basicInfoErrors?.email?.message as string,
                    intl,
                    language
                  )}
                </div>
              </div>
            </div>

            <div className="row mb-7">
              <label
                htmlFor="phone"
                className="col-lg-2 fs-5 ms-3 mt-3 mb-2 mb-lg-0 fw-semibold"
                style={{ color: "rgb(161, 165, 183)" }}
              >
                {intl.formatMessage({ id: "Phone" })}
              </label>

              <div className="col-lg-9 fv-row">
                <div className="input-group ">
                  <div className="input-group-prepend">
                    <span className="input-group-text">966+</span>
                  </div>

                  <input
                    type="number"
                    className="form-control"
                    placeholder="5xxxxxxxx"
                    id="phone"
                    style={{ backgroundColor: "#F9F9F9" }}
                    {...basicInfoRegister("phoneNumber")}
                    readOnly
                    disabled
                  />
                  {DisplayErrorMessage(
                    basicInfoErrors?.phoneNumber?.message as string,
                    intl,
                    language
                  )}
                </div>
              </div>
            </div>
            <div className="row mb-7">
              <label
                className="col-lg-2 ms-3 mb-3 fs-5 fw-mt-3 semibold"
                style={{ color: "rgb(161, 165, 183)" }}
                htmlFor="AboutTheExpert"
              >
                {intl.formatMessage({ id: "AboutTheExpert" })}{" "}
              </label>
              <div className="col-lg-9 mb-2 pt-2 pb-3">
                <form
                  id="kt_forms_widget_1_form"
                  className="ql-quil ql-quil-plain pb-3"
                >
                  <div className=" my-2 ">
                    <textarea
                      id="AboutTheExpert"
                      style={{ backgroundColor: "#F9F9F9" }}
                      className="form-control form-control-lg border border-2 form-control-solid mb-3 mb-lg-2 min-h-150px"
                      placeholder={intl.formatMessage({ id: "AboutTheExpert" })}
                      {...basicInfoRegister("informationAboutExpert")}
                    ></textarea>
                    {DisplayErrorMessage(
                      basicInfoErrors?.informationAboutExpert
                        ?.message as string,
                      intl,
                      language
                    )}
                  </div>
                </form>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-center w-100">
              <button className="btn btn-primary w-25" type="submit">
                {intl.formatMessage({ id: "Save" })}
              </button>
            </div>
          </form>
          <Fragment>
            <div className="d-flex align-items-center justify-content-between">
              <p
                style={{
                  fontWeight: "700",
                  width: "80%",
                  fontSize: "18px",
                  color: "#181C32",
                }}
                className="mb-3"
              >
                {intl.formatMessage({ id: "ExperienceData" })}{" "}
              </p>
            </div>
            <hr />
            <form onSubmit={experienceHandleSubmit(AddExpertExperiences)}>
              <div className="row mb-7 mt-4">
                <label
                  htmlFor="ExperienceName"
                  className="col-lg-2 fs-5 ms-3 mb-2 mt-3 mb-lg-0 fw-semibold"
                  style={{ color: "rgb(161, 165, 183)" }}
                >
                  {intl.formatMessage({ id: "ExperienceName" })}
                </label>

                <div className="col-lg-9">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="bi bi-person-lines-fill special"></i>
                      </span>
                    </div>
                    <input
                      placeholder="خبير شئون ماليه"
                      type="text"
                      className="form-control"
                      id="ExperienceName"
                      style={{ backgroundColor: "#F9F9F9" }}
                      {...experienceRegister("experienceName")}
                    />
                    {DisplayErrorMessage(
                      experienceErrors?.experienceName?.message as string,
                      intl,
                      language
                    )}
                  </div>
                </div>
              </div>
              <div className="row mb-7">
                <label
                  htmlFor="number"
                  className="col-lg-2 fs-5 ms-3 mt-3 mb-2 mb-lg-0 fw-semibold"
                  style={{ color: "rgb(161, 165, 183)" }}
                >
                  {intl.formatMessage({ id: "NumberOfYearsOfExperience" })}{" "}
                </label>

                <div className="col-lg-9 fv-row">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="bi bi-person-lines-fill special"></i>
                      </span>
                    </div>
                    <input
                      placeholder="10 سنوات"
                      type="number"
                      className="form-control"
                      id="number"
                      style={{ backgroundColor: "#F9F9F9" }}
                      {...experienceRegister("experienceYears")}
                    />
                    {DisplayErrorMessage(
                      experienceErrors?.experienceYears?.message as string,
                      intl,
                      language
                    )}
                  </div>
                </div>
              </div>
              <div className="row mb-7">
                <label
                  htmlFor="field"
                  className="col-lg-2 fs-5 ms-3 mt-3 mb-2 mb-lg-0 fw-semibold"
                  style={{ color: "rgb(161, 165, 183)" }}
                >
                  {intl.formatMessage({ id: "Specialization" })}
                </label>

                <div className="col-lg-9 fv-row">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="special fas fa-file-signature"></i>
                      </span>
                    </div>
                    <select
                      {...experienceRegister("specializationId")}
                      className="form-select form-select-solid"
                      defaultValue={""}
                    >
                      <option value={""} disabled>
                        {intl.formatMessage({ id: "Choose" })}
                      </option>
                      {specializations?.map(
                        (specialization: SpecializationModel) => (
                          <option
                            value={specialization?.id}
                            key={specialization?.id}
                          >
                            {language == "ar"
                              ? specialization?.nameAr
                              : specialization?.nameEn}
                          </option>
                        )
                      )}
                    </select>
                    {DisplayErrorMessage(
                      experienceErrors?.specializationId?.message as string,
                      intl,
                      language
                    )}
                  </div>
                </div>
              </div>
              <div className="row mb-7">
                <label
                  htmlFor="PlaceOfEmployment"
                  className="col-lg-2 fs-5 ms-3 mt-3 mb-2 mb-lg-0 fw-semibold"
                  style={{ color: "rgb(161, 165, 183)" }}
                >
                  {intl.formatMessage({ id: "PlaceOfEmployment" })}
                </label>

                <div className="col-lg-9 fv-row">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="fas fa-map-marker-alt special"></i>
                      </span>
                    </div>
                    <input
                      placeholder={intl.formatMessage({
                        id: "PlaceOfEmployment",
                      })}
                      type="text"
                      className="form-control"
                      id="PlaceOfEmployment"
                      style={{ backgroundColor: "#F9F9F9" }}
                      {...experienceRegister("jobLocation")}
                    />
                    {DisplayErrorMessage(
                      experienceErrors?.jobLocation?.message as string,
                      intl,
                      language
                    )}
                  </div>
                </div>
              </div>
              <div className="my-4 d-flex align-items-center justify-content-center">
                <button className="btn btn-primary w-25" type="submit">
                  {intl.formatMessage({ id: "Add" })}
                </button>
              </div>
            </form>
          </Fragment>
          <Fragment>
            <p
              style={{
                fontWeight: "700",
                fontSize: "18px",
                color: "#181C32",
              }}
              className="mb-4"
            >
              {intl.formatMessage({ id: "ExperiencesData" })}{" "}
            </p>
            <hr />
            <div className="table-responsive mt-4">
              <table
                className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-7"
                id="REGA-WS-caseList"
              >
                <thead>
                  <tr className="fw-bolder">
                    <th className="min-w-50px text-center">
                      {intl.formatMessage({ id: "Sequence" })}
                    </th>
                    <th className="min-w-150px text-center">
                      {intl.formatMessage({ id: "ExperienceName" })}
                    </th>
                    <th className="min-w-150px text-center">
                      {intl.formatMessage({ id: "YearsOfExperience" })}
                    </th>
                    <th className="min-w-150px text-center">
                      {intl.formatMessage({ id: "Specialization" })}
                    </th>
                    <th className="min-w-100px text-center">
                      {intl.formatMessage({ id: "PlaceOfPractice" })}
                    </th>
                    <th className="min-w-100px text-center">
                      {intl.formatMessage({ id: "Procedures" })}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {expert?.experiences?.map(
                    (experience: any, index: number) => {
                      return (
                        <Fragment key={experience?.id}>
                          <TableRow
                            index={index}
                            experience={experience}
                            expertId={id}
                          />
                        </Fragment>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </Fragment>
          <div className="col-12 col-lg-7 mx-auto mb-10">
            <div className=" card-diff-toolbar w-100 mt-3 d-flex justify-content-center">
              <div className="d-flex justify-content-center align-items-center w-50">
                <div
                  className="btn btn-secondary mx-1 text-center w-50"
                  onClick={() =>
                    navigate(
                      `/knowledge-experts/knowledge-experts-profile/${id}`
                    )
                  }
                >
                  {intl.formatMessage({ id: "Cancel" })}
                </div>
                <button
                  className="btn btn-primary mx-3 text-center w-50"
                  onClick={() =>
                    showSuccessAlert(true, "SavedSuccessfully", intl, () =>
                      navigate(
                        `/knowledge-experts/knowledge-experts-profile/${id}`
                      )
                    )
                  }
                >
                  {intl.formatMessage({ id: "Save" })}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export { EditExpert };
