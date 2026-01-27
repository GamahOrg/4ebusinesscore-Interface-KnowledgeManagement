import { useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { Fragment, useEffect, useState } from "react";
import { TableRow } from "./TableRow";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { ResponseStatus } from "../../../../enums/responseStatus";
import {
  AddExpertBasicInfoProps,
  AddExpertBasicInfoSchema,
} from "../../../../validations/add-expert-basic-info-validation";
import {
  AddExpertExperiencesProps,
  AddExpertExperiencesSchema,
} from "../../../../validations/add-expert-experience-validation";
import {
  addExperiences,
  addExpertBasicInfo,
} from "../../../../features/experts/expertsSlice";
import { RootState } from "../../../../store/store";
import { EmployeeHierarchyPopup } from "../popup/EmployeeHierarchyPopup";
import { UserManagmentRootUrl } from "@4eplatform/shared/apis/user_management";
import { getSpecializations } from "../../../../features/experts/specializationsSlice";
import { SpecializationModel } from "../../../../models/specializationsModel";
import { fetchUserBasicInfo } from "../../../../features/users&departments/userBasicInfoSlice";
import { fetchExperiencesForExpert } from "../../../../features/experts/experienceSlice";
import { ExperienceModel } from "../../../../models/experienceModel";
import { getExpertsWithoutPagination } from "../../../../features/experts/expertsWithoutPaginationSlice";
import DisplayErrorMessage from "@4eplatform/shared/functions/displayErrorMessage";
import { showSuccessAlert } from "@4eplatform/shared/services/helper";
import { toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";
const AddExpert = () => {
  const [modalHShow, setModalHShow] = useState<boolean>(false);
  let [expertId, setExpertId] = useState<string>("");
  let [employeeId, setEmployeeId] = useState<string>("");
  let [employeeName, setEmployeeName] = useState<string>("");
  let [experienceData, setExperienceData] = useState<any>([]);
  const intl = useIntl();
  let dispatch = useDispatch();
  let language = intl.locale;
  const navigate = useNavigate();
  let [isOutside, setIsOutside] = useState<boolean>(false);
  const {
    register: basicInfoRegister,
    handleSubmit: basicInfoHandleSubmit,
    setValue: basicInfoSetValue,
    reset: basicInfoReset,
    watch: basicInfoWatch,
    trigger: basicInfoTrigger,
    formState: { errors: basicInfoErrors },
  } = useForm<AddExpertBasicInfoProps>({
    resolver: yupResolver(AddExpertBasicInfoSchema),
    mode: "all",
    reValidateMode: "onSubmit",
  });
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

  let basicInfoFormValues = basicInfoWatch();
  let experienceFormValues = experienceWatch();
  const [imagePreview, setImagePreview] = useState<string>(
    "/media/avatars/blank-img.png"
  );
  const [file, setFile] = useState<File | null>(null);
  let [disableAddExperience, setDisableAddExperience] = useState<boolean>(true);

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
  let expertsUsersIds = useSelector((state: RootState) => {
    return state?.expertsWithoutPagination?.data?.map((expert) => {
      return expert?.id;
    });
  });

  const objToFormData = (data: any) => {
    const formData = new FormData();
    for (let [key, value] of Object.entries(data)) {
      if (value)
        //@ts-ignore
        formData.append(key, value);
    }
    return formData;
  };
  let user = useSelector((state: RootState) => {
    return state?.user?.data;
  });
  let specializations = useSelector((state: RootState) => {
    return state?.specializations?.data;
  });
  useEffect(() => {
    dispatch(getSpecializations({}) as any);
  }, []);
  let userBasicInfo = useSelector((state: RootState) => {
    return state?.userBasicInfo?.data;
  });
  let expertExperiences = useSelector((state: RootState) => {
    return state?.expertExperience?.data;
  });
  let userExperiences = useSelector((state: RootState) => {
    return state?.userExperience?.data;
  });
  useEffect(() => {
    if (employeeId != "") {
      dispatch(fetchUserBasicInfo(employeeId) as any);
    }
  }, [employeeId]);
  useEffect(() => {
    setExperienceData(expertExperiences);
  }, [expertExperiences]);
  useEffect(() => {
    if (employeeId && isOutside == false) {
      basicInfoSetValue("firstName", userBasicInfo?.firstName);
      basicInfoSetValue("secondName", userBasicInfo?.secondName);
      basicInfoSetValue("thirdName", userBasicInfo?.thirdName);
      basicInfoSetValue("forthName", userBasicInfo?.forthName);
      basicInfoSetValue(
        "imgUrl",
        `${UserManagmentRootUrl}${userBasicInfo?.imageUrl}`
      );
      setImagePreview(`${UserManagmentRootUrl}${userBasicInfo?.imageUrl}`);
      basicInfoSetValue(
        "address",
        userBasicInfo?.address == "null" || userBasicInfo?.address == null
          ? ""
          : userBasicInfo?.address
      );
      if (userBasicInfo?.phoneNumber?.startsWith("+966")) {
        basicInfoSetValue(
          "phoneNumber",
          userBasicInfo?.phoneNumber?.replace("+966", "")
        );
      } else {
        basicInfoSetValue(
          "phoneNumber",
          userBasicInfo?.phoneNumber?.replace("966", "")
        );
      }
      basicInfoSetValue("email", userBasicInfo?.email);
      basicInfoSetValue(
        "nationality",
        userBasicInfo?.nationality == "null" ||
          userBasicInfo?.nationality == null
          ? ""
          : userBasicInfo?.nationality
      );
      basicInfoSetValue("birthDate", userBasicInfo?.birthDate?.split("T")[0]);
    }
  }, [userBasicInfo]);
  let [disabledSave, setDisabledSave] = useState(true);
  const AddExpertExperiences = async (
    formValues: AddExpertExperiencesProps
  ) => {
    let body = {
      experienceName: formValues.experienceName,
      experienceYears: formValues.experienceYears,
      specializationId: formValues.specializationId,
      jobLocation: formValues.jobLocation,
      expertId,
    };
    dispatch(addExperiences(body) as any).then((res: any) => {
      if (res?.payload?.statusEnum == ResponseStatus.SavedSuccessfully) {
        dispatch(fetchExperiencesForExpert(expertId) as any);
        experienceSetValue("experienceName", "");
        experienceSetValue("experienceYears", 0);
        experienceSetValue("jobLocation", "");
        experienceSetValue("specializationId", "");
        setDisabledSave(false);
        showSuccessAlert(true, "AddedSuccessfully", intl);
      } else if (res?.payload?.message) {
        showSuccessAlert(
          false,
          res?.payload?.message == '["ExperienceYears must be greater than 0."]'
            ? "ExperienceYearsMustBeGreaterThan0"
            : res?.payload?.message,
          intl
        );
      }
    });
  };
  useEffect(() => {
    basicInfoSetValue("isOutsideFromSystem", isOutside);
  }, [isOutside]);

  const AddExpertBasicInfo = async (formValues: AddExpertBasicInfoProps) => {
    let body =
      isOutside == true
        ? {
            firstName: formValues.firstName,
            secondName: formValues.secondName,
            thirdName: formValues.thirdName,
            fourthName: formValues.forthName,
            imgUrl: file,
            email: formValues.email,
            phoneNumber: formValues.phoneNumber
              ? `+966${formValues.phoneNumber}`
              : "",
            birthDate: formValues.birthDate,
            nationality: formValues.nationality,
            address: formValues.address,
            InformationAboutExpert: formValues.informationAboutExpert,
            isExternalExpert: isOutside,
          }
        : {
            userId: userBasicInfo?.id,
            firstName: formValues.firstName,
            secondName: formValues.secondName,
            thirdName: formValues.thirdName,
            fourthName: formValues.forthName,
            imgUrl: file ? file : null,
            email: formValues.email,
            phoneNumber: formValues.phoneNumber
              ? `+966${formValues.phoneNumber}`
              : "",
            birthDate: formValues.birthDate,
            nationality: formValues.nationality,
            address: formValues.address,
            InformationAboutExpert: formValues.informationAboutExpert,
            isExternalExpert: isOutside,
          };
    let formBody = objToFormData(body);
    if (expertsUsersIds?.includes(expertId)) {
      showSuccessAlert(false, "ExpertAlreadyExists", intl);
    } else {
      dispatch(addExpertBasicInfo(formBody) as any).then((res: any) => {
        if (res?.payload?.statusEnum == ResponseStatus.SavedSuccessfully) {
          let expertId = res?.payload?.result;
          setExpertId(expertId);
          showSuccessAlert(true, "AddedSuccessfully", intl);
          setDisableAddExperience(false);
          dispatch(fetchExperiencesForExpert(expertId) as any);
          dispatch(getExpertsWithoutPagination({}) as any);
        } else if (res?.payload?.message) {
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
    }
  };
  useEffect(() => {
    basicInfoSetValue("firstName", "");
    basicInfoSetValue("secondName", "");
    basicInfoSetValue("thirdName", "");
    basicInfoSetValue("forthName", "");
    basicInfoSetValue("imgUrl", "");
    basicInfoSetValue("birthDate", "");
    basicInfoSetValue("nationality", "");
    setImagePreview("/media/avatars/blank-img.png");
    basicInfoSetValue("address", "");
    basicInfoSetValue("phoneNumber", "");
    basicInfoSetValue("email", "");
    basicInfoSetValue("informationAboutExpert", "");
    setExpertId("");
    setEmployeeId("");
    setEmployeeName("");
    setExperienceData([]);
    setDisableAddExperience(true);
    experienceSetValue("experienceName", "");
    experienceSetValue("experienceYears", 0);
    experienceSetValue("jobLocation", "");
    experienceSetValue("specializationId", "");
  }, [isOutside]);
  return (
    <>
      <div className="card card-xl-stretch mb-xl-8 me-3">
        <div className="card-body py-3">
          <div className="mb-4 pt-2 pb-3 " style={{ width: "100%" }}>
            <div className="d-flex justify-content-between mb-3">
              {!isOutside ? (
                <>
                  <div className="w-50">
                    <label className="fs-6 fw-bold mb-2" htmlFor="name">
                      {intl.formatMessage({ id: "EmployeeName" })}
                    </label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="fas fa-user-cog special"></i>
                        </span>
                      </div>
                      <input
                        className="form-control"
                        placeholder={intl.formatMessage({
                          id: "EmployeeName",
                        })}
                        value={employeeName}
                      />
                      <div className="h-110 d-flex" role="button">
                        <span
                          className="input-group-text"
                          onClick={() => setModalHShow(true)}
                        >
                          <i className="bi bi-diagram-3 fs-3 text-muted"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-50"></div>
                </>
              )}
            </div>
            <div />
          </div>
          <Fragment>
            <p style={{ fontWeight: "700", fontSize: "18px" }} className="mb-4">
              {intl.formatMessage({ id: "BasicData" })}
            </p>
            <hr />
            <form onSubmit={basicInfoHandleSubmit(AddExpertBasicInfo)}>
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
                      className="w-125px h-125px"
                      alt={""}
                      src={
                        imagePreview
                          ? imagePreview
                          : toAbsoluteUrl("/media/avatars/300-3.jpg")
                      }
                      onError={(e: any) =>
                        (e.target.src = toAbsoluteUrl(
                          "/media/avatars/300-3.jpg"
                        ))
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
                {DisplayErrorMessage(
                  basicInfoErrors?.imgUrl?.message as string,
                  intl,
                  language
                )}
              </div>

              <div className="row mb-7">
                <div className="col-lg-2 fs-5 ms-3 mt-3 mb-2 mb-lg-0 fw-semibold text-muted"></div>
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
                              style={{ backgroundColor: "#F9F9F9" }}
                              readOnly
                              disabled
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
                          className="col-12 ms-3 mt-3 mb-2 fs-5 fw-semibold "
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
                              readOnly
                              disabled
                              style={{ backgroundColor: "#F9F9F9" }}
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
                          className="col-12 ms-3 mt-3 mb-2 fs-5 fw-semibold "
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
                    basicInfoFormValues?.isOutsideFromSystem ? "required" : ""
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
                      type="text"
                      className="form-control"
                      placeholder="5xxxxxxxx"
                      id="phone"
                      readOnly
                      disabled
                      style={{ backgroundColor: "#F9F9F9" }}
                      {...basicInfoRegister("phoneNumber")}
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
                  <div className=" my-2 ">
                    <textarea
                      id="AboutTheExpert"
                      style={{ backgroundColor: "#F9F9F9" }}
                      className="form-control form-control-lg border border-2 form-control-solid mb-3 mb-lg-2 min-h-150px"
                      placeholder={intl.formatMessage({
                        id: "AboutTheExpert",
                      })}
                      {...basicInfoRegister("informationAboutExpert")}
                    ></textarea>
                    {DisplayErrorMessage(
                      basicInfoErrors?.informationAboutExpert
                        ?.message as string,
                      intl,
                      language
                    )}
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-center w-100">
                <button className="btn btn-primary w-25" type="submit">
                  {intl.formatMessage({ id: "Add" })}
                </button>
              </div>
            </form>
          </Fragment>
          <form onSubmit={experienceHandleSubmit(AddExpertExperiences)}>
            <Fragment>
              <p
                style={{ fontWeight: "700", fontSize: "18px" }}
                className="mb-4 mt-3"
              >
                {intl.formatMessage({ id: "ExperienceData" })}
              </p>
              <hr />
              <div className="row mb-7 mt-4">
                <label
                  htmlFor="ExperienceName"
                  className="col-lg-2 fs-5 ms-3 mb-2 mt-3 mb-lg-0 fw-semibold required"
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
                  className="col-lg-2 fs-5 ms-3 mt-3 mb-2 mb-lg-0 fw-semibold required"
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
                  className="col-lg-2 fs-5 ms-3 mt-3 mb-2 mb-lg-0 fw-semibold required"
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
                  className="col-lg-2 fs-5 ms-3 mt-3 mb-2 mb-lg-0 fw-semibold required"
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
            </Fragment>
            <div className="my-4 d-flex align-items-center justify-content-center">
              <button
                className="btn btn-primary w-25"
                disabled={disableAddExperience}
                type="submit"
              >
                {intl.formatMessage({ id: "Add" })}
              </button>
            </div>
          </form>
          <Fragment>
            <p style={{ fontWeight: "700", fontSize: "18px" }} className="mb-4">
              {intl.formatMessage({ id: "ExperiencesData" })}{" "}
            </p>
            <hr />
            <div className="table-responsive mt-4">
              <table
                className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-7"
                id="REGA-WS-caseList"
              >
                <thead>
                  <tr className="fw-bolder text-muted">
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
                  {experienceData?.map(
                    (experience: ExperienceModel, index: number) => {
                      return (
                        <Fragment key={experience?.id}>
                          {" "}
                          <TableRow
                            index={index}
                            experience={experience}
                            expertId={expertId}
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
                  onClick={() => navigate("/knowledge-experts")}
                >
                  {intl.formatMessage({ id: "Cancel" })}
                </div>
                <button
                  className="btn btn-primary mx-3 text-center w-50"
                  disabled={disabledSave}
                  onClick={() =>
                    showSuccessAlert(true, "SavedSuccessfully", intl, () =>
                      navigate("/knowledge-experts")
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
      <EmployeeHierarchyPopup
        show={modalHShow}
        handleClose={() => setModalHShow(false)}
        employeeId={employeeId}
        setEmployeeId={setEmployeeId}
        setEmployeeName={setEmployeeName}
      />
    </>
  );
};

export { AddExpert };
