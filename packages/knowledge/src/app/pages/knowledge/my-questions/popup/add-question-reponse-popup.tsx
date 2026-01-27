import { useIntl } from "react-intl";
import Modal from "react-bootstrap/Modal";
import { showSuccessAlert } from "@4eplatform/shared/services/helper";

type AddPopupProps = {
  show?: any;
  handleClose?: any;
};
function AddQuestionResponsePopup({ show, handleClose }: AddPopupProps) {
  const intl = useIntl();

  return (
    <div
      className="modal fade creatForm"
      id="Rega_modal_add-question-reponse"
      role="dialog"
      tabIndex={-1}
      aria-modal="true"
    >
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
                <h1 className="mb-3">
                  {intl.formatMessage({ id: "AddResponse" })}
                </h1>
                <div className="text-muted fw-bolder fs-5">
                  {intl.formatMessage({ id: "PleaseEnterTheData" })}
                </div>
              </Modal.Title>
            </div>
          </Modal.Header>

          <form
            noValidate
            className="form outputForm"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            {" "}
            <Modal.Body>
              <div className="row">
                <div className="col-12">
                  <div className="mb-2 pt-2 pb-3">
                    <label
                      htmlFor="WriteYourResponseRightHere"
                      className="form-label px-2 required fw-bolder"
                    >
                      {intl.formatMessage({ id: "ExpertResponse" })}
                    </label>
                    <textarea
                      id="WriteYourResponseRightHere"
                      className="form-control form-control form-control-solid mb-3 mb-lg-2 min-h-100px"
                      placeholder={intl.formatMessage({
                        id: "WriteYourResponseRightHere",
                      })}
                    />
                  </div>
                </div>

                <div className="col-12">
                  <div className="mb-2 pt-2 pb-3">
                    <input
                      className="myform-control"
                      hidden
                      id="files"
                      type="file"
                    />
                    <div className="position-relative">
                      <label
                        htmlFor="files"
                        className="w-100 h-60px d-flex align-items-center flex-wrap border border-gray-500 border-1 rounded-2 cursor-pointer px-3"
                      >
                        {intl.formatMessage({ id: "AddToRourResponse" })}
                      </label>
                      <div
                        className="position-absolute cursor-pointer"
                        style={{
                          top: "50%",
                          left: intl?.locale === "ar" ? "17%" : "",
                          transform: "translateY(-50%)",
                        }}
                      >
                        <label
                          htmlFor="files"
                          className="cursor-pointer text-muted"
                        >
                          <i className="fa-solid fa-paperclip mx-1 fs-3 fa-fw"></i>
                        </label>
                      </div>
                      <div
                        className="position-absolute cursor-pointer"
                        style={{
                          top: "50%",
                          left: intl?.locale == "ar" ? "12%" : "",
                          transform: "translateY(-50%)",
                        }}
                      >
                        <label
                          htmlFor="files"
                          className="cursor-pointer text-muted"
                        >
                          <i className="fa-solid fa-clapperboard mx-1 fs-3 fa-fw"></i>
                        </label>
                      </div>
                      <div
                        className="position-absolute cursor-pointer"
                        style={{
                          top: "50%",
                          left: intl?.locale == "ar" ? "7%" : "",
                          transform: "translateY(-50%)",
                        }}
                      >
                        <label
                          htmlFor="files"
                          className="cursor-pointer text-muted"
                        >
                          <i className="fa-solid fa-image mx-1 fs-3 fa-fw"></i>
                        </label>
                      </div>
                      <div
                        className="position-absolute cursor-pointer"
                        style={{
                          top: "50%",
                          left: intl?.locale == "ar" ? "2%" : "",
                          transform: "translateY(-50%)",
                        }}
                      >
                        <label
                          htmlFor="files"
                          className="cursor-pointer text-muted"
                        >
                          <i className="fa-solid fa-file mx-1 fs-3 fa-fw"></i>{" "}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="justify-content-center py-2">
              <div className="d-flex justify-content-center mt-5">
                <button
                  type="reset"
                  onClick={handleClose}
                  aria-hidden="true"
                  className="btn btn-secondary px-15 me-5"
                >
                  {intl.formatMessage({ id: "Cancel" })}
                </button>
                <button
                  data-bs-dismiss="modal"
                  onClick={(event) => {
                    event.preventDefault();
                    handleClose();
                    showSuccessAlert(true, "AddedSuccessfully", intl);
                  }}
                  className="btn btn-success px-15 ms-5"
                >
                  {intl.formatMessage({ id: "Add" })}
                </button>
              </div>
            </Modal.Footer>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default AddQuestionResponsePopup;
