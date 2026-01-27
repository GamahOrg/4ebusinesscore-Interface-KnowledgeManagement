import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import Modal from "react-bootstrap/Modal";
import { ChangeEvent, FC, useState, useEffect } from "react";
import { editBlogValidations } from "../../../../validations/add-blog-validations";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { editBlog, fetchBlogs } from "../../../../features/blog/blogSlice";
import FormData from "@4eplatform/shared/assets/forms/FormData";
import { Button, Spinner } from "react-bootstrap";
import { showSuccessAlert } from "@4eplatform/shared/services/helper";
type EditPopupProps = {
  show?: any;
  handleClose?: any;
  blog?: any;
};
const EditPostBlogPopup: FC<EditPopupProps> = ({ show, handleClose, blog }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [page, setPage] = useState(3);

  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    reset,
    setValue,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(editBlogValidations),
    mode: "onChange",
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      clearErrors("blogAttachments");
      setSelectedFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  useEffect(() => {
    if (isEdited) {
      dispatch(fetchBlogs({ pageSize: page }) as any);
    }
  }, [isEdited]);

  useEffect(() => {
    if (blog) {
      setValue("title", blog?.title);
      setValue("description", blog?.description);
      setSelectedFiles(
        blog?.blogAttachments?.map((item: any) => {
          return { name: item?.split("/")?.slice(-1)[0] };
        })
      );
    }
  }, [blog]);
  const MAX_SIZE_MB = 10;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
  const onSubmit = async (data: any) => {
    let { blogAttachments, ...rest } = data;
    let formdata = FormData(rest);
    selectedFiles?.forEach((file) => {
      if (file?.size > 0) {
        formdata.append("blogAttachments", file);
      } else {
        formdata.append(
          "oldAttachments",
          blog?.blogAttachments[0]?.split("/")?.slice(0, -1)?.join("/") +
            "/" +
            file?.name
        );
      }
    });
    const validFiles = selectedFiles?.filter((file) => file.size > 0);
    const totalSize = validFiles?.reduce((acc, file) => acc + file.size, 0);

    if (totalSize > MAX_SIZE_BYTES) {
      showSuccessAlert(false, "MaxSizeAttachments", intl);
      return;
    }
    const videoExtensions = [
      ".mp4",
      ".mov",
      ".avi",
      ".mkv",
      ".webm",
      ".flv",
      ".ts",
    ];
    const hasVideo = selectedFiles?.some((file) =>
      videoExtensions.some((ext) => file?.name?.endsWith(ext))
    );
    if (hasVideo) {
      showSuccessAlert(false, "VideoAttachmentsNotAccepted", intl);
      return;
    }
    try {
      setLoading(true);
      await dispatch(editBlog({ blog: formdata, id: blog?.id }) as any).then(
        (res: any) => {
          if (res.payload.statusEnum == 1) {
            showSuccessAlert(true, "EditedSuccessfully", intl);
            setIsEdited(true);
          } else if (res?.payload?.message) {
            showSuccessAlert(false, "AnErrorOccured", intl);
          }
          setLoading(false);
        }
      );
    } catch (err) {}
    handleClose();
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
                    {intl.formatMessage({ id: "EditBlog" })}
                  </span>
                  <span className="mt-1 fw-semibold fs-6 text-gray-700 my-5">
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
                  <div className="mb-2 pt-2 pb-3 ">
                    <label
                      htmlFor="theTitle"
                      className="form-label px-2 required"
                    >
                      {intl.formatMessage({ id: "TheTitle" })}
                    </label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text justify-content-center">
                          <i className="bi bi-window-plus special text-gray-700"></i>
                        </span>
                      </div>
                      <input
                        id="theTitle"
                        type="text"
                        className="form-control"
                        placeholder={intl.formatMessage({
                          id: "EditTheTitleOfThePost",
                        })}
                        {...register("title")}
                      />
                    </div>
                    {errors.title && (
                      <p className="text-danger p-2">
                        {intl.formatMessage({
                          id: errors.title.message as string,
                        })}
                      </p>
                    )}
                  </div>
                </div>

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
                        id: "WriteYourBlogPostHere",
                      })}
                      {...register("description")}
                    />
                    {errors.description && (
                      <p className="text-danger p-2">
                        {intl.formatMessage({
                          id: errors.description.message as string,
                        })}
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-12">
                  <div className="mb-2 pt-2 pb-3">
                    <input
                      className="myform-control"
                      hidden
                      id="files"
                      type="file"
                      {...register("blogAttachments")}
                      onChange={handleFileChange}
                      multiple
                    />
                    <div className="position-relative">
                      <label
                        htmlFor="files"
                        className="w-100 h-60px d-flex align-items-center border border-gray-500 border-1 rounded-2 cursor-pointer px-3"
                      >
                        {intl.formatMessage({ id: "AddAttachment" })}
                      </label>
                      <div
                        className="position-absolute cursor-pointer"
                        style={{
                          top: "50%",
                          left: intl?.locale == "ar" ? "17%" : "",
                          right: intl?.locale == "en" ? "17%" : "",

                          transform: "translateY(-50%)",
                        }}
                      >
                        <label htmlFor="files" className="cursor-pointer">
                          <i className="fa-solid fa-paperclip mx-1 fs-3 fa-fw"></i>
                        </label>
                      </div>
                      <div
                        className="position-absolute cursor-pointer"
                        style={{
                          top: "50%",
                          left: intl?.locale == "ar" ? "12%" : "",
                          right: intl?.locale == "en" ? "12%" : "",
                          transform: "translateY(-50%)",
                        }}
                      >
                        <label htmlFor="files" className="cursor-pointer">
                          <i className="fa-solid fa-clapperboard mx-1 fs-3 fa-fw"></i>
                        </label>
                      </div>
                      <div
                        className="position-absolute cursor-pointer"
                        style={{
                          top: "50%",
                          left: intl?.locale == "ar" ? "7%" : "",
                          right: intl?.locale == "en" ? "7%" : "",
                          transform: "translateY(-50%)",
                        }}
                      >
                        <label htmlFor="files" className="cursor-pointer">
                          <i className="fa-solid fa-image mx-1 fs-3 fa-fw"></i>
                        </label>
                      </div>
                      <div
                        className="position-absolute cursor-pointer"
                        style={{
                          top: "50%",
                          left: intl?.locale == "ar" ? "2%" : "",
                          right: intl?.locale == "en" ? "2%" : "",
                          transform: "translateY(-50%)",
                        }}
                      >
                        <label htmlFor="files" className="cursor-pointer">
                          <i className="fa-solid fa-file mx-1 fs-3 fa-fw"></i>
                        </label>
                      </div>
                    </div>
                    {selectedFiles && (
                      <div>
                        <ul>
                          {selectedFiles?.map((file, index) => (
                            <li
                              key={index}
                              className="d-flex justify-content-between align-items-center my-2"
                            >
                              {file.name}

                              <div
                                onClick={() => handleRemoveFile(index)}
                                className="bg-transparent cursor-pointer text-danger fw-bold border-0"
                              >
                                X
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
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
                  className="btn btn-secondary px-15 me-5"
                >
                  {intl.formatMessage({ id: "Cancel" })}
                </button>
                {!loading ? (
                  <button type="submit" className="btn btn-success px-15 me-5">
                    {intl.formatMessage({ id: "Edit" })}
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
                    <span>{intl.formatMessage({ id: "Editing" })}</span>
                  </Button>
                )}
              </div>
            </Modal.Footer>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default EditPostBlogPopup;
