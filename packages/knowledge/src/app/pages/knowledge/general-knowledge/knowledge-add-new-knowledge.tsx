import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";
import { AddPopup } from "../../partials/AddPopup";
import { KnowledgeManagement } from "./popup/KnowledgeManagement";
import { KnowledgeGeneralAddKnowledgeToolbar } from "./toolbar/KnowledgeAddKnowledgeToolbar";
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from "react-redux";
import { addKnowledge, fetchPublicKnowledges } from "../../../features/knowledge/PublicknowledgeSlice";
import { addKnowledgeValidations } from "../../../validations/add-knowledge-validations";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { Categories } from "../../../models/KnowledgeCategories";
import { fetchKnowledgesCategories } from "../../../features/knowledge/knowledgeCategorySlice";
import { showSuccessAlert } from "@4eplatform/shared/services/helper";
import Modal from "react-bootstrap/Modal";
import { useForm } from 'react-hook-form';;

type PopupProps = {
  show?: any;
  handleClose?: any;
  currentPage?: any;
  setCurrentPage?: any;
};

export const KnowledgeAddNewKnowledge: FC<PopupProps> = ({
  show = false, handleClose = () => { }, currentPage, setCurrentPage
}) => {

  const dispatch = useDispatch()
  const intl = useIntl();
  let language: string = intl.locale;

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<any>({
    resolver: yupResolver(addKnowledgeValidations),
    mode: "onChange"
  });

  const [modalShow, setModalShow] = useState<boolean>(false);

  const colorOptions = [
    {
      id: 1,
      name: "red",
    },
    {
      id: 2,
      name: "blue",
    },
    {
      id: 3,
      name: "green",
    },
    {
      id: 4,
      name: "yellow",
    },
  ];

  const knowledgeCategory: Categories = useSelector((state: RootState) => state?.knowledgeCategory.data);

  const [categories, setCategories] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    const result = dispatch(fetchKnowledgesCategories({}) as any);
    setCategories(result.Categories)
  }, [])
  const onSubmit = async (data: any) => {

    let formData = {
      name: data.name,
      knowledgeType: 1,
      icon: data.icon,
      color: data.colors,
    }
    await dispatch(addKnowledge(formData) as any).then((res: any) => {
      if (res.payload.statusEnum == 1) {
        setCurrentPage(1)
      dispatch(fetchPublicKnowledges({
      PageNumber: currentPage,
      PageSize: 10,
    }) as any)
    reset();
    showSuccessAlert(true , "AddedSuccessfully" , intl);
    handleClose();
    setValue("colors","")
    setValue("categories","")
      } else if (res.payload.message === "Knowledge Name Already exists!"){
        showSuccessAlert(false , "KnowledgeNameAlreadyExists" , intl);
      }
    });
  };


  return (
    <>
      <KnowledgeGeneralAddKnowledgeToolbar />
      <Modal
        size="xl"
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
                <h3 className="card-title align-items-center flex-column">

                  <span className="card-label fw-bolder fs-3 mb-2 ">
                    {intl.formatMessage({
                      id: "AddNewKnowledge",
                    })}
                  </span>
                  <span className="mt-1 fw-semibold fs-5 text-gray-800">
                    {intl.formatMessage({
                      id: "PleaseEnterTheData",
                    })}
                  </span>
                </h3>
              </Modal.Title>
            </div>
          </Modal.Header>
          <form
            className="form outputForm"
            onSubmit={handleSubmit(onSubmit)}
            noValidate={true}
            id="knowledgeForm"
          >
            <div className="card-body">
              <div className="row d-flex my-2">
                <div className="col-12 col-md-6 col-lg-4">
                  <div className="mb-2 pt-2 pb-3 ">
                    <label className="form-label px-2  fs-6 text-gray-800">
                      {intl.formatMessage({
                        id: "KnowledgeName",
                      })}
                    </label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="fas fa-book-reader special"></i>
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control text-gray-700"
                        placeholder={intl.formatMessage({
                          id: "KnowledgeName",
                        })}
                        {...register("name")}
                      />
                    </div>
                    {errors.name && <p className="text-danger p-2">{intl.formatMessage({ id: errors.name.message as string })}</p>}

                  </div>
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                  <div className="mb-2 pt-2 pb-3">
                    <label className="form-label px-2 fs-6 text-gray-800">
                      {intl.formatMessage({
                        id: "Icons",
                      })}
                    </label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="fas fa-icons special"></i>
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control "
                        placeholder={intl.formatMessage({
                          id: "IconsLink",
                        })}
                        {...register("icon")}
                      />
                      <div className="h-110 d-flex" role="button">
                        <a className="input-group-text"
                          href="https://fontawesome.com/v5/search?q=file&o=r&s=duotone"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="bi bi-link fa-lg special"></i>
                        </a>
                      </div>
                    </div>
                    {errors.icon && <p className="text-danger p-2">{intl.formatMessage({ id: errors.icon.message as string })}</p>}

                  </div>
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                  <div className="mb-2 pt-2 pb-3">
                    <label className="form-label px-2  fs-6 text-gray-800">
                      {intl.formatMessage({ id: "Color" })}
                    </label>

                    <div className="mx-auto mt-1  ">
                      <select
                        {...register("colors")}
                        className="form-select form-select-solid"
                        defaultValue={""}
                      >
                        <option value={""}  disabled
                          className="text-gray-700"

                        >
                          {intl.formatMessage({ id: "SelectAColor" })}
                        </option>
                        {colorOptions?.map((color) => (
                          <option value={color?.name} key={color?.name}>
                            {intl.formatMessage({id:color.name})}
                          </option>
                        ))}
                      </select>
                      {errors.colors && <p className="text-danger p-2">{intl.formatMessage({ id: errors.colors.message as string })}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 text-center pb-5">
              <Link
                className="btn btn-secondary m-3 px-5 py-3"
                style={{ width: "125px" }}
                to="/knowledge-general-knowledge"
                onClick={handleClose}
              >
                {intl.formatMessage({
                  id: "Cancel",
                })}
              </Link>

              <button
                type="submit"
                className="btn btn-success m-3 px-5 py-3"
                style={{ width: "125px" }}
                form="knowledgeForm"
              >
                {intl.formatMessage({
                  id: "Add",
                })}
              </button>
            </div>
          </form>
        </div>

        <div className="modal fade" id="Rega_modal_add" aria-hidden="true">
          <AddPopup show={modalShow} handleClose={() => setModalShow(false)} />
        </div>
        <div
          className="modal fade"
          id="rega_modal_knwoledge_management"
          aria-hidden="true"
        >
          <KnowledgeManagement />
        </div>
      </Modal >
    </>
  );
};
