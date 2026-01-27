import { useIntl } from "react-intl";
import Modal from "react-bootstrap/Modal";
import { addCommentValidations } from "../../../../validations/add-comment-validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  addIdeaComment,
  fetchIdeaComments,
} from "../../../../features/comments/commentSlice";
import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { fetchIdea } from "../../../../features/idea/ideaSlice";
import { showSuccessAlert } from "@4eplatform/shared/services/helper";

type AddPopupProps = {
  show?: any;
  handleClose?: any;
  id?: string;
  parentId?: string | null;
  isReply?: boolean;
  page?: Number;
};
function AddAnswer({
  show,
  handleClose,
  id,
  parentId = null,
  page = 10,
}: AddPopupProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(addCommentValidations),
    mode: "onChange",
  });

  const dispatch = useDispatch();
  const intl = useIntl();
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (data: any) => {
    let tempData = { ...data };
    tempData.ideaBankId = id;

    if (parentId) {
      tempData.parentCommentId = parentId;
    }
    setLoading(true);
    await dispatch(addIdeaComment(tempData) as any).then((res: any) => {
      if (res.payload.statusEnum == 1) {
        dispatch(fetchIdea(id) as any);
        let params = `${id}?pageSize=${page}`;
        dispatch(fetchIdeaComments(params) as any);

        showSuccessAlert(true, "AddedSuccessfully", intl);
        handleClose();
        reset();
      } else {
        showSuccessAlert(true, res?.payload?.message, intl);
      }
      setLoading(false);
    });
  };

  return (
    <div className="modal-dialog modal-dialog-centered mw-850px">
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
                <h3 className="card-title d-flex justify-content-center align-items-center flex-column">
                  <span className="card-label fs-4 my-5">
                    {" "}
                    {intl.formatMessage({
                      id: parentId ? "AddReply" : "AddComment",
                    })}
                  </span>
                  <span className="mt-1 fw-semibold fs-6 text-muted my-5">
                    {intl.formatMessage({ id: "PleaseEnterTheFollowingData" })}{" "}
                  </span>
                </h3>
              </Modal.Title>
            </div>
          </Modal.Header>

          <form className="form outputForm" onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body>
              <div className="row">
                <div className="col-12">
                  <div className="mb-2 pt-2 pb-3">
                    <label
                      htmlFor="whatOnYourMind"
                      className="form-label px-2 required"
                    >
                      {intl.formatMessage({ id: "WhatOnYourMind" })}
                    </label>
                    <textarea
                      id="whatOnYourMind"
                      className="form-control form-control-solid min-h-90px mb-3 mb-lg-2"
                      placeholder={intl.formatMessage({
                        id: "WriteYourAnswerHere",
                      })}
                      {...register("commentText")}
                    />
                    {errors.commentText && (
                      <p className="text-danger p-2">
                        {intl.formatMessage({
                          id: errors.commentText.message as string,
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="justify-content-center py-2">
              <div className="d-flex justify-content-center my-5">
                <button
                  type="reset"
                  onClick={handleClose}
                  aria-hidden="true"
                  className="btn btn-secondary px-15 me-5"
                >
                  {intl.formatMessage({ id: "Cancel" })}
                </button>

                {!loading ? (
                  <button
                    type="submit"
                    data-bs-dismiss="modal"
                    className="btn btn-success px-15 me-5"
                  >
                    {intl.formatMessage({ id: "Add" })}
                  </button>
                ) : (
                  <Button variant="success" disabled className="px-15 me-5">
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="mx-2"
                    />
                    <span>{intl.formatMessage({ id: "Adding" })}</span>
                  </Button>
                )}
              </div>
            </Modal.Footer>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default AddAnswer;
