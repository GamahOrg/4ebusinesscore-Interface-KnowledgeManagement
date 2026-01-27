import { Fragment, useState } from "react";
import { useIntl } from "react-intl";

function EditBasicData() {
  const intl = useIntl();

  const [imagePreview, setImagePreview] = useState<string>(
    "/media/avatars/blank-img.png"
  );
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

  return (
    <Fragment>
      <hr />
      <div className="row mb-7 mt-5">
        <label className="col-lg-2 mb-2 mb-lg-0 fw-semibold text-muted fs-5">
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
            <div
              className="image-input-wrapper w-125px h-125px"
              style={{ backgroundImage: `url(${imagePreview})` }}
            ></div>

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
                name="avatar"
                accept=".png, .jpg, .jpeg"
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
        <label
          htmlFor="name"
          className="col-lg-2 ms-3 mt-3 mb-2 fs-5 mb-lg-0 fw-semibold text-muted"
        >
          {intl.formatMessage({ id: "FullName" })}
        </label>

        <div className="col-lg-9">
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="fas fa-user special"></i>
              </span>
            </div>
            <input
              placeholder="محمد محمود"
              type="text"
              className="form-control"
              id="name"
              style={{ backgroundColor: "#F9F9F9" }}
            />
          </div>
        </div>
      </div>

      <div className="row mb-7">
        <label
          htmlFor="email"
          className="col-lg-2 fs-5 ms-3 mt-3 mb-2 mb-lg-0 fw-semibold text-muted"
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
            />
          </div>
        </div>
      </div>

      <div className="row mb-7">
        <label
          htmlFor="phone"
          className="col-lg-2 fs-5 ms-3 mt-3 mb-2 mb-lg-0 fw-semibold text-muted"
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
            />
          </div>
        </div>
      </div>

      <div className="row mb-7">
        <label
          className="col-lg-2 ms-3 mt-3 mb-2 mb-lg-0 fw-semibold text-muted fs-5"
          htmlFor="nationality"
        >
          {intl.formatMessage({ id: "Nationality" })}
        </label>

        <div className="col-lg-9 d-flex align-items-center">
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="bi bi-globe special"></i>
              </span>
            </div>
            <input
              placeholder="سعودي"
              type="text"
              className="form-control"
              id="nationality"
              style={{ backgroundColor: "#F9F9F9" }}
            />
          </div>
        </div>
      </div>

      <div className="row mb-7">
        <label
          htmlFor="birthdate"
          className="col-lg-2 fs-5 ms-3 mt-3 mb-2 mb-lg-0 fw-semibold text-muted"
        >
          {intl.formatMessage({ id: "BirthDay" })}
        </label>

        <div className="col-lg-9">
          <input
            placeholder="12-9-2023"
            type="date"
            className="form-control"
            id="birthdate"
            style={{ backgroundColor: "#F9F9F9" }}
          />
        </div>
      </div>

      <div className="row mb-7">
        <label
          htmlFor="address"
          className="col-lg-2 fs-5 ms-3 mt-3 mb-2 mb-lg-0 fw-semibold text-muted"
        >
          {intl.formatMessage({ id: "TheTitle" })}
        </label>

        <div className="col-lg-9">
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="special fas fa-briefcase"></i>
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              id="address"
              style={{ backgroundColor: "#F9F9F9" }}
            />
          </div>
        </div>
      </div>
      <div className="row mb-7">
        <label
          className="col-lg-2 ms-3 mb-3 fs-5 fw-mt-3 semibold text-muted"
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
              ></textarea>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
}

export default EditBasicData;
