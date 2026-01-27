import { Fragment, useEffect, useState } from "react";
import { AddPopup } from "../../../partials/AddPopup";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../../../store/store";
import {
  addQuestion,
  fetchQuestionsByExpertId,
  getExpertById,
} from "../../../../features/experts/expertsSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  AddQuestionProps,
  AddQuestionSchema,
} from "../../../../validations/add-question-validation";
import { fetchUsers } from "../../../../features/users&departments/usersSlice";
import { UserManagmentRootUrl } from "@4eplatform/shared/apis/user_management";
import { useLocation } from "react-router-dom";
import { showSuccessAlert } from "@4eplatform/shared/services/helper";
import { Notification } from "@4eplatform/shared/services/notifications";
import {
  fetchRoles,
  fetchUserRoles,
} from "../../../../features/users&departments/rolesSlice";
import { toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";

const ExpertProfile = () => {
  const [modalShow, setModalShow] = useState<boolean>(false);
  const intl = useIntl();
  const { id } = useParams();
  const expertRootUrl =
    (window as any)._env_?.REACT_APP_API_AskExpert_Url + "/";
  const navigate = useNavigate();
  const [questionPrivacy, setQuestionPrivacy] = useState(false);

  let location = useLocation();
  let cardId = location?.state?.cardId;
  let cardName =
    location?.state?.cardTitle || location?.state?.serviceName || "";

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<AddQuestionProps>({
    resolver: yupResolver(AddQuestionSchema),
    mode: "all",
    reValidateMode: "onChange",
  });

  const dispatch = useDispatch();
  let expert = useSelector((state: RootState) => {
    return state?.experts?.expert;
  });
  const formattedId = id?.toString().replace(/^\//, "");
  useEffect(() => {
    if (formattedId) {
      dispatch(getExpertById(formattedId) as any);
    }
  }, [formattedId]);
  useEffect(() => {
    let params: any = {
      pageSize: "100000",
      pageNumber: "1",
    };
    dispatch(fetchRoles(params) as any);
  }, []);
  let roles = useSelector((state: RootState) => {
    return state?.roles?.roles;
  });
  let usersInRole = useSelector((state: RootState) => {
    return state?.roles?.usersInRole;
  });
  let roleIdForQuestionsRequestsManager = roles?.find((item) => {
    return (
      item?.nameAr?.trim() == "مسؤول طلبات اسأل خبير" ||
      item?.nameAr?.trim() == "مسؤول طلبات أسال خبير" ||
      item?.nameAr?.trim() == "مسؤول طلبات إسأل خبير" ||
      item?.nameAr?.trim() == "مسؤول طلبات أسأل خبير" ||
      item?.nameAr?.trim() == "مسئول اسال خبير" ||
      item?.nameAr?.trim() == "مسئوول اسال خبير"
    );
  })?.id;
  useEffect(() => {
    if (roleIdForQuestionsRequestsManager) {
      dispatch(
        fetchUserRoles({
          id: roleIdForQuestionsRequestsManager,
          myparams: {},
        }) as any
      );
    }
  }, [roleIdForQuestionsRequestsManager]);

  let myparams = {
    pageSize: 1000,
    pageNumber: 1,
  };

  useEffect(() => {
    if (formattedId) {
      dispatch(
        fetchQuestionsByExpertId({
          expertId: formattedId as string,
          myparams,
        }) as any
      );
    }
  }, [myparams.pageNumber, myparams.pageSize, formattedId]);

  let expertQuestion = useSelector((state: RootState) => {
    return state?.experts?.expertQuestions;
  });

  const filteredExpertQuestions = expertQuestion.filter(
    (expertQuestion) => expertQuestion.type === 0
  );
  let users = useSelector((state: RootState) => {
    return state?.users?.data;
  });
  useEffect(() => {
    dispatch(fetchUsers({}) as any);
  }, []);

  const AddQuestionSubmit = async (formvalues: AddQuestionProps) => {
    let body = {
      expertIds: [formattedId],
      specializationId: expert?.specializationId,
      body: formvalues.body,
      type: questionPrivacy ? 1 : 0,
    };
    await dispatch(addQuestion(body) as any).then((res: any) => {
      if (res.payload.statusEnum == 1) {
        showSuccessAlert(true, "AddedSuccessfully", intl, () => {});
        usersInRole?.forEach((user) => {
          Notification.addingRequestForKnowledge(
            user?.userId,
            `${
              (window as any)._env_?.PUBLIC_URL
            }/knowledge-posting-requests/askExpert/${
              res?.payload?.result
            }/details`,
            89,
            res?.payload?.result,
            user?.email,
            true,
            92,
            moment
              .tz(new Date(), "UTC")
              .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
              .format("llll"),
            formvalues.body,
            "إسأل خبير",
            "679d080f-78d7-45f7-96df-6b5bc1f3dafc",
            ""
          );
        });
        navigate("/knowledge-ask-expert", {
          state: {
            cardId: cardId,
            cardTitle: cardName,
          },
        });
      } else if (res.payload.message === '["SpecializationIsNotFound"]') {
        showSuccessAlert(false, "SpecializationIsNotFound", intl);
      }
    });
  };

  const hideForm = formattedId === localStorage.getItem("userId");

  const checkUndefinedName = (name: any) => {
    if (
      name == "undefined" ||
      name == "null" ||
      name == undefined ||
      name == null
    ) {
      return "";
    } else {
      return name;
    }
  };

  const [userData, setUserData] = useState({
    firstName: "",
    secondName: "",
    thirdName: "",
    fourthName: "",
  });

  useEffect(() => {
    setUserData({
      firstName: checkUndefinedName(expert?.firstName),
      secondName: checkUndefinedName(expert?.secondName),
      thirdName: checkUndefinedName(expert?.thirdName),
      fourthName: checkUndefinedName(expert?.fourthName),
    });
  }, [expert]);

  return (
    <Fragment>
      <div className="card p-5" style={{ height: "fitContent" }}>
        <div className="d-flex align-items-center justify-content-between">
          <p
            style={{ fontWeight: "700", fontSize: "18px" }}
            className="mb-3 mt-3 w-75"
          >
            {intl.formatMessage({ id: "ProfileExpert" })}{" "}
          </p>
        </div>
        <div className="row mb-7 mt-5">
          <label
            style={{ color: "#A1A5B7", fontWeight: "700", fontSize: "16px" }}
            className="col-lg-2 mb-2 mb-lg-0 fw-semibold"
          >
            {intl.formatMessage({ id: "ProfilePicture" })}
          </label>

          <div className="col-lg-9">
            <div>
              {expert?.isExternalExpert ? (
                <img
                  src={
                    expert?.imgUrl
                      ? expertRootUrl + expert?.imgUrl
                      : toAbsoluteUrl("/media/avatars/300-3.jpg")
                  }
                  className="image-input-wrapper w-125px h-125px mx-5"
                  alt="avatar"
                  onError={(e: any) =>
                    (e.target.src = toAbsoluteUrl("/media/avatars/300-3.jpg"))
                  }
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
                  className="image-input-wrapper w-125px h-125px mx-5"
                  alt="avatar"
                  onError={(e: any) =>
                    (e.target.src = toAbsoluteUrl("/media/avatars/300-3.jpg"))
                  }
                />
              )}
            </div>
          </div>
        </div>

        <div className="row mb-7">
          <label
            htmlFor="name"
            className="col-lg-2 ms-3 mb-2 mb-lg-0 fw-semibold "
            style={{ color: "#A1A5B7", fontWeight: "700", fontSize: "16px" }}
          >
            {intl.formatMessage({ id: "FullName" })}
          </label>

          <div className="col-lg-9 ">
            <p style={{ fontWeight: "700", fontSize: "16px" }}>
              {`${userData.firstName} ${
                userData.secondName
              } ${checkUndefinedName(userData.thirdName)} ${
                userData.fourthName
              }`.trim()}{" "}
            </p>
          </div>
        </div>

        <div className="row mb-7">
          <label
            style={{ color: "#A1A5B7", fontWeight: "700", fontSize: "16px" }}
            className="col-lg-2 ms-3  mb-2 mb-lg-0 fw-semibold "
          >
            {intl.formatMessage({ id: "Email" })}
          </label>

          <div className="col-lg-9 ">
            <p style={{ fontWeight: "700", fontSize: "16px" }}>
              {expert?.email}
            </p>
          </div>
        </div>

        <div className="row mb-7">
          <label
            style={{ color: "#A1A5B7", fontWeight: "700", fontSize: "16px" }}
            className="col-lg-2 ms-3 mb-2 mb-lg-0 fw-semibold "
          >
            {intl.formatMessage({ id: "Phone" })}
          </label>

          <div className="col-lg-9 ">
            <p style={{ fontWeight: "700", fontSize: "16px" }}>
              {expert?.phoneNumber}
            </p>
          </div>
        </div>
        <div className="row mb-7">
          <label
            className="col-lg-2 ms-3 mb-2 mb-lg-0 fw-semibold "
            style={{ color: "#A1A5B7", fontWeight: "700", fontSize: "16px" }}
          >
            {intl.formatMessage({ id: "YearsOfExperience" })}{" "}
          </label>

          <div className="col-lg-9 ">
            <p style={{ fontWeight: "700", fontSize: "16px" }}>
              {expert?.experiences[0]?.experienceYears} سنة
            </p>
          </div>
        </div>

        <div className="row mb-7">
          <label
            className="col-lg-2 ms-3 mb-2 mb-lg-0 fw-semibold "
            style={{ color: "#A1A5B7", fontWeight: "700", fontSize: "16px" }}
          >
            {intl.formatMessage({ id: "Specialization" })}{" "}
          </label>

          <div className="col-lg-9 ">
            <p style={{ fontWeight: "700", fontSize: "16px" }}>
              {expert?.experiences[0]?.experienceName}
            </p>
          </div>
        </div>

        <div className="row mb-7">
          <label
            className="col-lg-2 ms-3 mb-2 mb-lg-0 fw-semibold "
            style={{ color: "#A1A5B7", fontWeight: "700", fontSize: "16px" }}
          >
            {intl.formatMessage({ id: "AboutTheExpert" })}{" "}
          </label>

          <div className="col-lg-9 mb-5">
            <p style={{ fontWeight: "400", fontSize: "14px" }}>
              {expert?.informationAboutExpert ? (
                expert?.informationAboutExpert
              ) : (
                <span className="d-flex fw-bolder justify-content-start align-items-start">
                  {intl.formatMessage({ id: "No_data_yet" })}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="row mb-7">
          <p
            className="col-lg-2 ms-3 mb-3 fw-semibold"
            style={{ color: "#A1A5B7", fontWeight: "700", fontSize: "16px" }}
          >
            {intl.formatMessage({ id: "ExperiencesData" })}{" "}
          </p>
          <hr />
          <div
            style={{ overflow: "auto", maxHeight: "600px" }}
            className="table-responsive mt-4"
          >
            <table
              className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-7"
              id="REGA-WS-caseList"
            >
              <thead style={{ position: "sticky", top: "0" }}>
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
                </tr>
              </thead>
              <tbody>
                {expert?.experiences?.map((experience, idx) => {
                  return (
                    <Fragment key={Math.random()}>
                      <tr style={{ verticalAlign: "middle" }}>
                        <td style={{ verticalAlign: "middle" }}>
                          <p
                            style={{ color: "#A1A5B7" }}
                            className="text-center"
                          >
                            {idx + 1}
                          </p>
                        </td>
                        <td style={{ verticalAlign: "middle" }}>
                          <p
                            style={{ color: "#A1A5B7" }}
                            className="text-center"
                          >
                            {experience?.experienceName}
                          </p>
                        </td>
                        <td style={{ verticalAlign: "middle" }}>
                          <p
                            style={{ color: "#A1A5B7" }}
                            className="text-center"
                          >
                            {experience?.experienceYears}
                          </p>
                        </td>
                        <td style={{ verticalAlign: "middle" }}>
                          <p
                            style={{ color: "#A1A5B7" }}
                            className="text-center"
                          >
                            {experience?.specializationNameAr}
                          </p>
                        </td>
                        <td style={{ verticalAlign: "middle" }}>
                          <p
                            style={{ color: "#A1A5B7" }}
                            className="text-center"
                          >
                            {experience?.jobLocation}
                          </p>
                        </td>
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="row mb-7">
          <p
            className="col-lg-2 ms-3 mb-3 fw-semibold"
            style={{ color: "#A1A5B7", fontWeight: "700", fontSize: "16px" }}
          >
            {intl.formatMessage({ id: "EmpQuestions" })}{" "}
          </p>
          <hr />
          <div
            style={{ overflow: "auto", maxHeight: "400px" }}
            className="table-responsive mt-4"
          >
            <table
              className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-7"
              id="REGA-WS-caseList"
            >
              <thead style={{ top: "0" }}>
                <tr className="fw-bolder text-muted">
                  <th className="min-w-50px text-center">
                    {intl.formatMessage({ id: "Sequence" })}
                  </th>
                  <th className="min-w-150px text-center">
                    {intl.formatMessage({ id: "Question" })}
                  </th>
                  <th className="min-w-150px text-center">
                    {intl.formatMessage({ id: "Applicant" })}
                  </th>
                  <th className="min-w-100px text-center">
                    {intl.formatMessage({ id: "QuestionDate" })}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredExpertQuestions?.map((filteredExpertQuestion, idx) => {
                  return (
                    <Fragment key={Math.random()}>
                      <tr style={{ verticalAlign: "middle" }}>
                        <td
                          onClick={() =>
                            navigate(
                              `/knowledge-my-questions/knowledge-my-question-details/${filteredExpertQuestion.id}`,
                              {
                                state: { serviceName: cardName },
                              }
                            )
                          }
                          style={{ verticalAlign: "middle" }}
                        >
                          <p
                            style={{ cursor: "pointer" }}
                            className="text-center text-primary"
                          >
                            {idx + 1}
                          </p>
                        </td>
                        <td
                          onClick={() =>
                            navigate(
                              `/knowledge-my-questions/knowledge-my-question-details/${filteredExpertQuestion.id}`,
                              {
                                state: { serviceName: cardName },
                              }
                            )
                          }
                          style={{ verticalAlign: "middle" }}
                        >
                          <p
                            style={{ cursor: "pointer" }}
                            className="text-center text-primary"
                          >
                            {filteredExpertQuestion?.body}
                          </p>
                        </td>
                        <td style={{ verticalAlign: "middle" }}>
                          <p
                            style={{ color: "#A1A5B7" }}
                            className="text-center"
                          >
                            {filteredExpertQuestion?.firstName}{" "}
                            {filteredExpertQuestion?.secondName}{" "}
                            {filteredExpertQuestion?.thirdName}{" "}
                            {filteredExpertQuestion?.fourthName}{" "}
                          </p>
                        </td>
                        <td style={{ verticalAlign: "middle" }}>
                          <p
                            style={{ color: "#A1A5B7" }}
                            className="text-center"
                          >
                            {moment
                              .tz(filteredExpertQuestion?.createdOn, "UTC")
                              .tz(
                                Intl.DateTimeFormat().resolvedOptions().timeZone
                              )
                              .format("YYYY-MM-DD") +
                              " " +
                              intl.formatMessage({ id: "IN" }) +
                              " " +
                              moment
                                .tz(filteredExpertQuestion?.createdOn, "UTC")
                                .tz(
                                  Intl.DateTimeFormat().resolvedOptions()
                                    .timeZone
                                )
                                .format("LT")}
                          </p>
                        </td>
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="row mb-7">
          <div>
            {!hideForm && (
              <form
                onSubmit={handleSubmit(AddQuestionSubmit)}
                style={{ width: "100%", height: "fitContent" }}
                noValidate
              >
                <div className="my-5">
                  <label
                    htmlFor="notes"
                    className="form-label px-2 mb-2 fontSz-4"
                  >
                    {intl.formatMessage({ id: "WriteQuestionToExpert" })}
                  </label>
                  <textarea
                    id="notes"
                    {...register("body")}
                    className="form-control form-control-lg form-control-solid mb-3 mb-lg-2 h-150px"
                    placeholder={intl.formatMessage({ id: "ExpertQuestion" })}
                  ></textarea>
                  {DisplayErrorMessage(errors?.body?.message, intl)}
                </div>
                <div className="form-check form-check-success form-check-sm form-check-custom form-check-solid form-check-md mt-7">
                  <label className="d-flex gap-2 align-items-center">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={questionPrivacy}
                      onChange={() =>
                        setQuestionPrivacy((prevPeivacy) => !prevPeivacy)
                      }
                    />
                    {intl.formatMessage({ id: "PrivateQuestion" })}
                  </label>
                </div>
                <div className="d-flex justify-content-center">
                  <button
                    className="btn btn-primary"
                    type="submit"
                    data-kt-element="send"
                  >
                    {intl.formatMessage({ id: "Send" })}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      <div className="modal fade" id="Rega_modal_add" aria-hidden="true">
        <AddPopup show={modalShow} handleClose={() => setModalShow(false)} />
      </div>
    </Fragment>
  );
};

export { ExpertProfile };

const DisplayErrorMessage = (error: any, intl: any) => {
  return (
    <div
      className="invalid-feedback"
      style={{
        display: error ? "block" : "none",
      }}
    >
      <p>
        {error
          ? intl.formatMessage({
              id: error,
            })
          : ""}
      </p>
    </div>
  );
};
