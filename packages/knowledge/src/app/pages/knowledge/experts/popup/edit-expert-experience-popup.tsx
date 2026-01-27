import React, { Fragment, useEffect } from "react";
import { useIntl } from "react-intl";
import Modal from "react-bootstrap/Modal";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../../store/store";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SpecializationModel } from "../../../../models/specializationsModel";
import {
  EditExpertExperiencesProps,
  EditExpertExperiencesSchema,
} from "../../../../validations/edit-expert-experience-validation";
import {
  editExperience,
  getExpertById,
} from "../../../../features/experts/expertsSlice";
import { fetchExperiencesForExpert } from "../../../../features/experts/experienceSlice";
import { ExperienceModel } from "../../../../models/experienceModel";
import { useLocation, useParams } from "react-router-dom";
import DisplayErrorMessage from "@4eplatform/shared/functions/displayErrorMessage";
import { showSuccessAlert } from "@4eplatform/shared/services/helper";

type PopupProps = {
  show?: any;
  handleClose?: any;
  id?: string;
  setExperienceData?: any;
  experienceData?: any;
  expertId?: string;
  experience?: ExperienceModel;
};
const EditExpertExperience: React.FC<PopupProps> = ({
  show,
  handleClose,
  id,
  expertId,
  experience,
}) => {
  const intl = useIntl();
  let dispatch = useAppDispatch();
  let language = intl.locale;
  let specializations = useSelector((state: RootState) => {
    return state?.specializations?.data;
  });
  let params = useParams();
  let expertIdFromEdit = params?.id;
  let location = useLocation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    trigger,
    formState: { errors },
  } = useForm<EditExpertExperiencesProps>({
    resolver: yupResolver(EditExpertExperiencesSchema),
    mode: "all",
    reValidateMode: "onChange",
  });
  useEffect(() => {
    setValue("experienceName", experience?.experienceName as string);
    setValue(
      "experienceYears",
      experience?.experienceYears as unknown as number
    );
    setValue("jobLocation", experience?.jobLocation as string);
    setValue("specializationId", experience?.specializationId as string);
  }, [experience]);

  let handleEditExperience = (data: any) => {
    dispatch(
      editExperience({
        experienceName: data.experienceName,
        experienceYears: data.experienceYears,
        specializationId: data.specializationId,
        jobLocation: data.jobLocation,
        expertId,
        id,
      }) as any
    ).then((res: any) => {
      if (res?.payload?.statusEnum == 1) {
        handleClose();
        if (location.pathname == "/knowledge-experts-add-expert") {
          dispatch(fetchExperiencesForExpert(expertId as string) as any);
        } else {
          dispatch(getExpertById(expertIdFromEdit as string) as any);
        }
        showSuccessAlert(true, "ModifiedSuccessfully", intl);
      } else {
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
  return (
    <Fragment>
      <div className="modal-dialog modal-dialog-centered mw-1000px">
        <Modal
          size="lg"
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
                  {" "}
                  <h3 className="card-title flex-column align-items-center">
                    <span className="card-label fw-bolder fs-3 mb-2 ">
                      {intl.formatMessage({ id: "EditExperience" })}
                    </span>
                    <span className="mt-1 fw-semibold fs-5 text-muted">
                      {intl.formatMessage({ id: "PleaseEnterTheData" })} :
                    </span>
                  </h3>
                </Modal.Title>
              </div>
            </Modal.Header>

            <form onSubmit={handleSubmit(handleEditExperience)}>
              <Modal.Body>
                <div className="row">
                  <div className="col-sm-6 col-12">
                    <div className="mb-2 pt-2 pb-3 ">
                      <label className="form-label px-2  fs-6 text-gray-700">
                        {intl.formatMessage({ id: "ExperienceName" })}
                      </label>
                      <div className="mx-auto mt-1">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="bi bi-person-lines-fill special"></i>
                            </span>
                          </div>
                          <input
                            id="riskTitle"
                            type="text"
                            className="form-control"
                            placeholder={intl.formatMessage({
                              id: "ExperienceName",
                            })}
                            {...register("experienceName")}
                          />
                          {DisplayErrorMessage(
                            errors?.experienceName?.message as string,
                            intl,
                            language
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mb-2 pt-5 pb-3">
                      <label className="form-label px-2  fs-6 text-gray-700">
                        {intl.formatMessage({ id: "Specialization" })}
                      </label>
                      <div className="mx-auto mt-1">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="special fas fa-file-signature"></i>
                            </span>
                          </div>
                          <select
                            {...register("specializationId")}
                            className="form-select form-select-solid"
                          >
                            <option value={""} selected disabled>
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
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6 col-12">
                    <div className="mb-2 pt-2 pb-3 ">
                      <label className="form-label px-2  fs-6 text-gray-700">
                        {intl.formatMessage({
                          id: "NumberOfYearsOfExperience",
                        })}
                      </label>
                      <div className="mx-auto mt-1">
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
                            {...register("experienceYears")}
                          />
                          {DisplayErrorMessage(
                            errors?.experienceYears?.message as string,
                            intl,
                            language
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mb-2 pt-2 pb-3 ">
                      <label className="form-label px-2  fs-6 text-gray-700">
                        {intl.formatMessage({ id: "PlaceOfPractice" })}
                      </label>
                      <div className="mx-auto mt-1">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="fas fa-map-marker-alt special"></i>
                            </span>
                          </div>
                          <input
                            id="riskTitle"
                            type="text"
                            className="form-control"
                            placeholder={intl.formatMessage({
                              id: "PlaceOfPractice",
                            })}
                            {...register("jobLocation")}
                          />
                          {DisplayErrorMessage(
                            errors?.jobLocation?.message as string,
                            intl,
                            language
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer className="justify-content-center py-2">
                <div className="col-12 col-lg-7 mx-auto mb-10">
                  <div className=" card-diff-toolbar w-100 mt-3 d-flex justify-content-center">
                    <div className="d-flex justify-content-center align-items-center w-50">
                      <div
                        className="btn btn-secondary mx-1 text-center w-100"
                        onClick={handleClose}
                      >
                        {intl.formatMessage({ id: "Cancel" })}
                      </div>
                      <button
                        className="btn btn-primary mx-1 text-center w-100"
                        type="submit"
                      >
                        {intl.formatMessage({ id: "Save" })}
                      </button>
                    </div>
                  </div>
                </div>
              </Modal.Footer>
            </form>
          </div>
        </Modal>
      </div>
    </Fragment>
  );
};

export default EditExpertExperience;
