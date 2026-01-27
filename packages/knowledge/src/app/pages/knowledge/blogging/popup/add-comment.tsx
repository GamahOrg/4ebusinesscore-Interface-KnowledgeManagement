import { useIntl } from "react-intl";
import Modal from "react-bootstrap/Modal";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { addCommentValidations } from "../../../../validations/add-comment-blog-validation";
import {
  addBlogComment,
  fetchBlogComments,
} from "../../../../features/comments/commentSlice";
import { fetchBlogs } from "../../../../features/blog/blogSlice";
import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { showSuccessAlert } from "@4eplatform/shared/services/helper";

type AddPopupProps = {
  show?: any;
  handleClose?: any;
  id?: string;
  parentId?: string | null;
  page?: Number;
  commentFromOut?: boolean;
  isReply?: boolean;
};
function AddComment({
  show = true,
  handleClose = () => {},
  id,
  parentId = null,
  page,
  commentFromOut,
  isReply,
}: AddPopupProps) {
  const intl = useIntl();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(addCommentValidations),
    mode: "onChange",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("BlogId", id || "");
    formData.append("Body", data.Body);

    if (parentId) {
      formData.append("ParentId", parentId);
    }
    setLoading(true);
    await dispatch(addBlogComment(formData) as any).then((res: any) => {
      if (res.payload.statusEnum == 1) {
        let params = `${id}?pageSize=${page}`;
        if (commentFromOut) {
          let pageSize = page;
          dispatch(fetchBlogs({ pageSize }) as any);
        } else dispatch(fetchBlogComments(params) as any);
        showSuccessAlert(true, "AddedSuccessfully", intl);
        handleClose();
        reset(); // Reset the form here
      } else if (res?.payload?.message) {
        handleClose();
        showSuccessAlert(false, res?.payload?.message, intl);
      }
    });
    setLoading(false);
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
                <h3 className="card-title d-flex justify-content-center align-items-center flex-column">
                  <span className="card-label fs-4 my-5">
                    {isReply
                      ? intl.formatMessage({ id: "AddReply" })
                      : intl.formatMessage({ id: "AddComment" })}
                  </span>
                  <span className="mt-1 fw-semibold fs-6 text-gray-700 my-5">
                    {intl.formatMessage({ id: "PleaseEnterTheFollowingData" })}{" "}
                  </span>
                </h3>
              </Modal.Title>
            </div>
          </Modal.Header>

          <form
            noValidate
            className="form outputForm"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Modal.Body>
              <div className="row">
                <div className="col-12">
                  <div className="mb-2 pt-2 pb-3">
                    <label
                      htmlFor="whatOnYourMind"
                      className="form-label px-2 required text-gray-700"
                    >
                      {intl.formatMessage({ id: "WhatOnYourMind" })}
                    </label>
                    <textarea
                      id="whatOnYourMind"
                      className="form-control form-control-solid min-h-90px mb-3 mb-lg-2 text-gray-700"
                      placeholder={intl.formatMessage({
                        id: "WriteYourCommentHere",
                      })}
                      {...register("Body")}
                    />
                    {errors.Body && (
                      <p className="text-danger p-2">
                        {intl.formatMessage({
                          id: errors.Body.message as string,
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
                  onClick={() => {
                    handleClose();
                    reset();
                  }}
                  aria-hidden="true"
                  className="btn btn-secondary px-15 me-5"
                >
                  {intl.formatMessage({ id: "Cancel" })}
                </button>
                {!loading ? (
                  <button type="submit" className="btn btn-success px-15 me-5">
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

export default AddComment;
