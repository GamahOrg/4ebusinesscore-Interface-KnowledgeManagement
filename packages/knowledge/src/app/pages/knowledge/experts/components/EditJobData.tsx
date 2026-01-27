import { Fragment } from "react";
import { useIntl } from "react-intl";

function EditJobData() {
  const intl = useIntl();

  return (
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
          {intl.formatMessage({ id: "JobData" })}{" "}
        </p>
      </div>
      <hr />
      <div className="row mb-7 mt-4">
        <label
          htmlFor="ExperienceName"
          className="col-lg-2 fs-5 ms-3 mb-2 mt-3 mb-lg-0 fw-semibold text-muted"
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
            />
          </div>
        </div>
      </div>
      <div className="row mb-7">
        <label
          htmlFor="number"
          className="col-lg-2 fs-5 ms-3 mt-3 mb-2 mb-lg-0 fw-semibold text-muted"
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
            />
          </div>
        </div>
      </div>
      <div className="row mb-7">
        <label
          htmlFor="field"
          className="col-lg-2 fs-5 ms-3 mt-3 mb-2 mb-lg-0 fw-semibold text-muted"
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
            <input
              placeholder="خبير شؤون قانونيه"
              type="text"
              className="form-control"
              id="field"
              style={{ backgroundColor: "#F9F9F9" }}
            />
          </div>
        </div>
      </div>
      <div className="row mb-7">
        <label
          htmlFor="PlaceOfEmployment"
          className="col-lg-2 fs-5 ms-3 mt-3 mb-2 mb-lg-0 fw-semibold text-muted"
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
              placeholder={intl.formatMessage({ id: "PlaceOfEmployment" })}
              type="text"
              className="form-control"
              id="PlaceOfEmployment"
              style={{ backgroundColor: "#F9F9F9" }}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default EditJobData;
