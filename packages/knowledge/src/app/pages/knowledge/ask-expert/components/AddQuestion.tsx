import { useIntl } from "react-intl";
import { Col, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../../../../store/store";
import { useForm } from "react-hook-form";
import {
  addQuestion,
  getExpertsBySpecializationId,
} from "../../../../features/experts/expertsSlice";
import { ExpertModel } from "../../../../models/getAllExpertsModel";
import { getSpecializations } from "../../../../features/experts/specializationsSlice";
import { SpecializationModel } from "../../../../models/specializationsModel";
import {
  AddQuestionProps,
  AddQuestionSchema,
} from "../../../../validations/add-question-validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { fetchUsers } from "../../../../features/users&departments/usersSlice";
import { UserManagmentRootUrl } from "@4eplatform/shared/apis/user_management";
import { useLocation } from "react-router-dom";
import { Notification } from "@4eplatform/shared/services/notifications";
import {
  fetchRoles,
  fetchUserRoles,
} from "../../../../features/users&departments/rolesSlice";
import "moment-timezone";
import moment from "moment";
import { showSuccessAlert } from "@4eplatform/shared/services/helper";
import DisplayErrorMessage from "@4eplatform/shared/functions/displayErrorMessage";
import { Button, Spinner } from "react-bootstrap";
import { toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";

const AddQuestion = () => {
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    let params: any = {
      pageSize: "100000",
      pageNumber: "1",
    };
    dispatch(fetchRoles(params) as any);
  }, []);
  let roles = useAppSelector((state: RootState) => {
    return state?.roles?.roles;
  });
  let usersInRole = useAppSelector((state: RootState) => {
    return state?.roles?.usersInRole;
  });
  let roleIdForQuestionsRequestsManager = roles?.find((item) => {
    return (
      item?.nameAr?.trim() == "مسؤول طلبات اسأل خبير" ||
      item?.nameAr?.trim() == "مسؤول طلبات أسال خبير" ||
      item?.nameAr?.trim() == "مسؤول طلبات إسأل خبير" ||
      item?.nameAr?.trim() == "مسؤول طلبات أسأل خبير" ||
      item?.nameAr?.trim() == "مسئول اسال خبير" ||
      item?.nameAr?.trim() == "مسئوول اسال خبير" ||
      item?.nameAr?.trim() == "مسؤول اسال خبير" ||
      item?.nameAr?.trim() == "ادمن اسال خبير"
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
  const intl = useIntl();
  let language = intl.locale;
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [list, setList] = useState<number[]>([]);
  let newList = [];
  const [usersSelected, setUsersSelected] = useState<ExpertModel[]>([]);
  const experts = useAppSelector(
    (state: RootState) => state?.experts?.expertsBySpecializationId[0]
  );
  const [usersModel, setUsersModel] = useState<any>();
  const [selectedSpecializationsId, setSelectedSpecializationstId] =
    useState<any>();
  const [questionPrivacy, setQuestionPrivacy] = useState(false);
  const navigate = useNavigate();

  let location = useLocation();
  let cardId = location?.state?.cardId;
  let cardName =
    location?.state?.cardTitle || location?.state?.serviceName || "";
  useEffect(() => {
    dispatch(getSpecializations({}) as any);
  }, []);
  let users = useAppSelector((state: RootState) => {
    return state?.users?.data;
  });
  useEffect(() => {
    dispatch(fetchUsers({}) as any);
  }, []);

  const handleSpecializationsChange = (event: any) => {
    const specializationsId = event.target.value;
    setSelectedSpecializationstId(specializationsId);
    dispatch(getExpertsBySpecializationId(specializationsId) as any);
  };

  useEffect(() => {
    if (selectedSpecializationsId) {
      setUsersModel([]);
      dispatch(
        getExpertsBySpecializationId(selectedSpecializationsId) as any
      ).then((res: any) => {
        setUsersModel(res?.payload?.result[0]?.experts);
      });
    }
  }, [selectedSpecializationsId]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddQuestionProps>({
    resolver: yupResolver(AddQuestionSchema),
    mode: "onChange",
  });
  const AddQuestionSubmit = async (formvalues: any) => {
    setIsLoading(true);
    let body = {
      specializationId: selectedSpecializationsId,
      body: formvalues.body,
      expertIds: usersSelected?.map(({ id }) => id),
      type: questionPrivacy ? 1 : 0,
    };

    await dispatch(addQuestion(body) as any).then((res: any) => {
      setIsLoading(false);
      if (!selectedSpecializationsId) {
        showSuccessAlert(false, "SpecializationIsNotSelectedYet", intl);
        return;
      }
      if (usersSelected.length == 0 && questionPrivacy) {
        showSuccessAlert(false, "YouShouldSelectAnExpert", intl);
        return;
      }
      if (res.payload.statusEnum == 1) {
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
            "",
            localStorage.getItem("mainClassificationId") ||
              "00000000-0000-0000-0000-000000000000"
          );
        });
        showSuccessAlert(true, "AddedSuccessfully", intl, () =>
          navigate("/knowledge-ask-expert", {
            state: {
              cardId: cardId,
              cardTitle: cardName,
            },
          })
        );
      }
    });
  };
  const addusers = async (id: number) => {
    if (list.includes(id)) {
      newList = list.filter((item) => item !== id);
      setList(newList);
    } else {
      newList = [...list, id];
      setList(newList);
    }
  };

  const updateUsers = async (experts: ExpertModel) => {
    if (usersSelected.length > 0) {
      var filterUsers = usersSelected.filter((x) => x.id == experts.id);
      if (filterUsers.length > 0) {
        const index = usersSelected.indexOf(experts, 0);
        if (index > -1) {
          usersSelected.splice(index, 1);
          setUsersSelected([...usersSelected]);

          var userSearch = usersModel.find((x: any) => x.id === experts.id);
          if (userSearch) {
            const updatedUserSearch = { ...userSearch, isChecked: false };
            const updatedUsersModel = usersModel.map((user: any) =>
              user.id === experts.id ? updatedUserSearch : user
            );
            setUsersModel(updatedUsersModel);
          }
        }
      } else {
        var userSearch = usersModel.find((x: any) => x.id === experts.id);
        if (userSearch) {
          const updatedUserSearch = { ...userSearch, isChecked: true };
          const updatedUsersModel = usersModel.map((user: any) =>
            user.id === experts.id ? updatedUserSearch : user
          );
          setUsersModel(updatedUsersModel);
          setUsersSelected([...usersSelected, experts]);
        }
      }
    } else {
      var userSearch = usersModel.find((x: any) => x.id === experts.id);
      if (userSearch) {
        const updatedUserSearch = { ...userSearch, isChecked: true };
        const updatedUsersModel = usersModel.map((user: any) =>
          user.id === experts.id ? updatedUserSearch : user
        );
        setUsersModel(updatedUsersModel);
        setUsersSelected([...usersSelected, experts]);
      }
    }
  };
  let specializations = useAppSelector((state: RootState) => {
    return state?.specializations?.data;
  });
  const expertRootUrl =
    (window as any)._env_?.REACT_APP_API_AskExpert_Url + "/";

  return (
    <>
      <div>
        <div className="card card-xl-stretch mb-xl-8">
          <div className="card-body py-3">
            <form
              noValidate
              className="card mb-3 p-5"
              onSubmit={handleSubmit(AddQuestionSubmit)}
            >
              <div className="mb-5 d-flex mt-5 align-items-center">
                <label htmlFor="field" className="flex-shrink-0 fs-5 px-3">
                  {intl.formatMessage({ id: "ChooseSpecialization" })}:{" "}
                </label>
                <select
                  onChange={handleSpecializationsChange}
                  value={selectedSpecializationsId}
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
              </div>
              {DisplayErrorMessage(
                errors?.specializationId?.message as string,
                intl,
                language
              )}
              <div className="col-lg-12 mb-2 pt-2 pb-3">
                <label htmlFor="notes" className="form-label px-2 fontSz-6">
                  {intl.formatMessage({ id: "ExpertQuestion" })}
                </label>
                <form
                  id="kt_forms_widget_1_form"
                  className="ql-quil ql-quil-plain pb-3"
                >
                  <div className="editor-wrapper  my-2">
                    <textarea
                      id="notes"
                      className="form-control form-control-lg form-control-solid 
                      mb-3 
                      mb-lg-2"
                      placeholder={intl.formatMessage({ id: "ExpertQuestion" })}
                      rows={6}
                      {...register("body")}
                    ></textarea>
                    {DisplayErrorMessage(
                      errors?.body?.message as string,
                      intl,
                      language
                    )}
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
                </form>
              </div>
              <p style={{ fontWeight: "400", fontSize: "16px" }}>
                {intl.formatMessage({ id: "ChooseExpert" })}
              </p>
              <p
                style={{
                  fontWeight: "400",
                  fontSize: "14px",
                  color: "#A1A5B7",
                }}
                className="mb-5"
              >
                {intl.formatMessage({ id: "ChooseExpert" })} /{" "}
                {intl.formatMessage({ id: "ExpertsWhoAsked" })}
              </p>
              <div className="col-12">
                <div className="mb-3">
                  <div className="border border-secondary-subtle borderRadius-top">
                    <div className="position-relative text-center py-4 w-75 mx-auto">
                      <input
                        style={{
                          background: "#F5F8FA",
                          borderRadius: "6px",
                          outline: "unset",
                          border: "0",
                          padding: "1rem 3rem 1rem 1rem",
                        }}
                        type="search"
                        name="searchForProject"
                        className="input input-group searchBoxDesign"
                        id="searchForProject"
                        placeholder={intl.formatMessage({ id: "SearchExpert" })}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <i
                        className="fa-solid fa-light fa-magnifying-glass fs-3 fa-fw position-absolute"
                        style={{
                          top: "50%",
                          right: "1rem",
                          transform: "translateY(-50%)",
                        }}
                      ></i>
                    </div>
                    <div className=" d-flex justify-content-center px-3 py-2 ">
                      <div
                        className="scroll-y mb-3 me-n5 pe-5 h-200px d-flex justify-content-between px-3 py-2 flex-column w-100"
                        data-kt-scroll="true"
                        data-kt-scroll-activate="{default: false, lg: true}"
                        data-kt-scroll-max-height="auto"
                        data-kt-scroll-dependencies="#kt_header, #kt_toolbar, #kt_footer, #kt_contacts_list_header"
                        data-kt-scroll-wrappers="#kt_content, #kt_contacts_list_body"
                        data-kt-scroll-stretch="#kt_contacts_list, #kt_contacts_main"
                        data-kt-scroll-offset="5px"
                      >
                        {usersModel
                          ? usersModel
                              ?.filter((userExperts: ExpertModel) => {
                                const fullName =
                                  `${userExperts?.firstName} ${userExperts?.secondName} ${userExperts?.thirdName} ${userExperts?.fourthName}`.toLowerCase();
                                const search = searchQuery.trim().toLowerCase();
                                return fullName.includes(search);
                              })
                              ?.map((userExperts: any) => (
                                <div key={userExperts?.id}>
                                  <div className="d-flex justify-content-between mb-4">
                                    <div className="d-flex justify-content-between">
                                      {userExperts?.isExternalExpert ? (
                                        <img
                                          src={
                                            userExperts?.imgUrl
                                              ? expertRootUrl +
                                                userExperts?.imgUrl
                                              : toAbsoluteUrl(
                                                  "/media/avatars/300-3.jpg"
                                                )
                                          }
                                          style={{
                                            display: "block",
                                            height: "46px",
                                            width: "46px",
                                            borderRadius: "50%",
                                          }}
                                          onError={(e: any) =>
                                            (e.target.src = toAbsoluteUrl(
                                              "/media/avatars/300-3.jpg"
                                            ))
                                          }
                                        />
                                      ) : (
                                        <img
                                          src={
                                            users?.find((user) => {
                                              return (
                                                user?.id == userExperts?.userId
                                              );
                                            })?.imageUrl &&
                                            userExperts?.imgUrl == null
                                              ? UserManagmentRootUrl +
                                                users?.find((user) => {
                                                  return (
                                                    user?.id ==
                                                    userExperts?.userId
                                                  );
                                                })?.imageUrl
                                              : userExperts?.imgUrl
                                              ? expertRootUrl +
                                                userExperts?.imgUrl
                                              : toAbsoluteUrl(
                                                  "/media/avatars/300-3.jpg"
                                                )
                                          }
                                          onError={(e: any) =>
                                            (e.target.src = toAbsoluteUrl(
                                              "/media/avatars/300-3.jpg"
                                            ))
                                          }
                                          style={{
                                            display: "block",
                                            height: "46px",
                                            width: "46px",
                                            borderRadius: "50%",
                                          }}
                                        />
                                      )}
                                      <div>
                                        <div
                                          style={{
                                            fontWeight: "700",
                                            fontSize: "14px",
                                          }}
                                        >
                                          {userExperts?.firstName}{" "}
                                          {userExperts?.secondName}{" "}
                                          {userExperts?.thirdName}{" "}
                                          {userExperts?.fourthName}
                                        </div>
                                        <div
                                          className="text-muted"
                                          style={{
                                            fontWeight: "400",
                                            fontSize: "13px",
                                          }}
                                        >
                                          {language === "ar"
                                            ? experts?.specializationNameAr
                                            : experts?.specializationNameEn}
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={userExperts?.isChecked}
                                        onClick={() => {
                                          addusers(userExperts?.id);
                                        }}
                                        id={userExperts?.id.toString()}
                                        onChange={(e) => {
                                          updateUsers(userExperts);
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))
                          : intl.formatMessage({ id: "ChooseSpecialization" })}
                      </div>
                    </div>
                  </div>
                  <div className="border borderRadius-bottom mt-5">
                    <Row className="gy-5 mt-5 px-5 py-2">
                      {usersSelected?.map((userExperts) => (
                        <Col xs={12} sm={6} md={4} lg={3} key={userExperts.id}>
                          <div className="mx-3 ">
                            <div className="card mb-3 py-5">
                              <div
                                role="button"
                                className="position-absolute"
                                style={{
                                  backgroundColor: "red",
                                  color: "white",
                                  top: "5%",
                                  left: "-5%",
                                  width: " 20px",
                                  height: "20px",
                                  borderRadius: "50%",
                                  border: "none",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                                onClick={() => {
                                  updateUsers(userExperts);
                                }}
                              >
                                x
                              </div>
                              <div
                                className="d-flex align-items-center py-5"
                                style={{
                                  boxShadow: "0px 2px 15px rgba(0, 0, 0, 0.1)",
                                  height: "80%",
                                }}
                              >
                                {userExperts?.isExternalExpert ? (
                                  <img
                                    src={
                                      userExperts?.imgUrl
                                        ? expertRootUrl + userExperts?.imgUrl
                                        : toAbsoluteUrl(
                                            "/media/avatars/300-3.jpg"
                                          )
                                    }
                                    style={{
                                      display: "block",
                                      height: "46px",
                                      width: "46px",
                                      borderRadius: "50%",
                                    }}
                                    onError={(e: any) =>
                                      (e.target.src = toAbsoluteUrl(
                                        "/media/avatars/300-3.jpg"
                                      ))
                                    }
                                  />
                                ) : (
                                  <img
                                    src={
                                      users?.find((user) => {
                                        return user?.id == userExperts?.userId;
                                      })?.imageUrl &&
                                      userExperts?.imgUrl == null
                                        ? UserManagmentRootUrl +
                                          users?.find((user) => {
                                            return (
                                              user?.id == userExperts?.userId
                                            );
                                          })?.imageUrl
                                        : userExperts?.imgUrl
                                        ? expertRootUrl + userExperts?.imgUrl
                                        : toAbsoluteUrl(
                                            "/media/avatars/300-3.jpg"
                                          )
                                    }
                                    onError={(e: any) =>
                                      (e.target.src = toAbsoluteUrl(
                                        "/media/avatars/300-3.jpg"
                                      ))
                                    }
                                    style={{
                                      display: "block",
                                      height: "46px",
                                      width: "46px",
                                      borderRadius: "50%",
                                    }}
                                  />
                                )}
                                <div>
                                  <div
                                    style={{
                                      fontWeight: "700",
                                      fontSize: "14px",
                                    }}
                                  >
                                    {userExperts?.firstName}{" "}
                                    {userExperts?.secondName}{" "}
                                    {userExperts?.thirdName}{" "}
                                    {userExperts?.fourthName}
                                  </div>
                                  <div
                                    className="text-muted"
                                    style={{
                                      fontWeight: "400",
                                      fontSize: "13px",
                                    }}
                                  >
                                    {language === "ar"
                                      ? experts?.specializationNameAr
                                      : experts?.specializationNameEn}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-center mt-5">
                <div
                  className="btn btn-secondary mx-1 text-center "
                  onClick={() =>
                    navigate("/knowledge-ask-expert", {
                      state: {
                        cardId: cardId,
                        cardTitle: cardName,
                      },
                    })
                  }
                >
                  {intl.formatMessage({ id: "Cancel" })}
                </div>
                {isLoading ? (
                  <Button
                    variant="primary"
                    disabled
                    className="px-4  d-flex align-items-center justify-content-center"
                  >
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2 p-2"
                    />
                    <span className="text-nowrap">
                      {intl.formatMessage({ id: "Sending" })}
                    </span>
                  </Button>
                ) : (
                  <button
                    className="btn btn-primary"
                    type="submit"
                    onClick={() => setModalShow(true)}
                  >
                    {intl.formatMessage({ id: "Send" })}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export { AddQuestion };
