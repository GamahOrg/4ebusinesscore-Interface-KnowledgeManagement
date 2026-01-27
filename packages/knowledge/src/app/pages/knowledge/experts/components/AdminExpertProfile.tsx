import { Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import { getExpertById } from "../../../../features/experts/expertsSlice";
import { fetchUsers } from "../../../../features/users&departments/usersSlice";
import { UserManagmentRootUrl } from "@4eplatform/shared/apis/user_management";
import { KTSVG, toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";
import { DeleteExpertPopup } from "../popup/delete-expert-popup";

const AdminExpertProfile = () => {
  const intl = useIntl();
  const expertRootUrl =
    (window as any)._env_?.REACT_APP_API_AskExpert_Url + "/";
  const { id } = useParams();
  const [imagePreview, setImagePreview] = useState<string>(
    "/media/avatars/blank-img.png"
  );
  const [file, setFile] = useState<File | null>(null);
  const [showDelete, setShowDelete] = useState(false);

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

  const dispatch = useDispatch();

  let users = useSelector((state: RootState) => {
    return state?.users?.data;
  });
  useEffect(() => {
    dispatch(fetchUsers({}) as any);
  }, []);
  let expert = useSelector((state: RootState) => {
    return state?.experts?.expert;
  });
  const formattedId = id?.toString().replace(/^\//, "");
  useEffect(() => {
    if (formattedId) {
      dispatch(getExpertById(formattedId) as any);
    }
  }, [formattedId]);

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
            className="col-lg-2 mb-2 mb-lg-0 fw-semibold"
            style={{ color: "#A1A5B7", fontWeight: "700", fontSize: "16px" }}
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

          <div className="row mb-7 mt-5">
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
          <div className="d-flex justify-content-center mt-5 gap-3">
            <Link
              to={`/knowledge-experts/knowledge-experts-edit-expert/${formattedId}`}
              className="btn btn-primary"
            >
              <i className="fa-regular fa-pen-to-square mx-2 fs-4 fa-fw"></i>
              {intl.formatMessage({ id: "Edit" })}
            </Link>

            <Link
              to={"#"}
              className="btn btn-danger"
              onClick={(event) => {
                event.preventDefault();
                setShowDelete(true);
              }}
            >
              <span className="svg-icon svg-icon-3 mx-2">
                <KTSVG path="/media/icons/duotune/general/gen088.svg" />
              </span>{" "}
              {intl.formatMessage({ id: "Delete" })}
            </Link>
          </div>
        </div>

        <div className="modal fade" aria-hidden="true">
          <DeleteExpertPopup
            id={id}
            showDelete={showDelete}
            handleCloseDelete={() => setShowDelete(false)}
          />
        </div>
      </div>
    </Fragment>
  );
};

export { AdminExpertProfile };
