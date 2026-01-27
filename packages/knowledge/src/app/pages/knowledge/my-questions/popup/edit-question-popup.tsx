import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Modal } from "react-bootstrap";
import { getExpertsBySpecializationId } from "../../../../features/experts/expertsSlice";
import { useDispatch } from "react-redux";
import {
  editQuestion,
  fetchExpertsQuestion,
} from "../../../../features/questions/questionSlice";
import { getSpecializations } from "../../../../features/experts/specializationsSlice";
import { RootState, useAppSelector } from "../../../../store/store";
import { fetchUsers } from "../../../../features/users&departments/usersSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  EditQuestionProps,
  EditQuestionSchema,
} from "../../../../validations/add-question-validation";
import { ExpertModel } from "../../../../models/getAllExpertsModel";
import { showSuccessAlert } from "@4eplatform/shared/services/helper";
import DisplayErrorMessage from "@4eplatform/shared/functions/displayErrorMessage";

type EditPopupProps = {
  id?: string | undefined;
  handleEdit?: (id: string, additionalData: {}) => void;
  additionalData?: {};
  showEdit?: any;
  handleCloseEdit?: any;
};

export const EditQuestionPopup: FC<EditPopupProps> = ({
  showEdit,
  handleCloseEdit,
  id = 0,
  handleEdit = null,
  additionalData = {},
}) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [usersModel, setUsersModel] = useState<any>();
  const [usersSelected, setUsersSelected] = useState<ExpertModel[]>([]);
  const [selectedSpecializationsId, setSelectedSpecializationstId] =
    useState<any>();

  const question = useAppSelector(
    (state: RootState) => state?.questions?.data?.question
  );

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<EditQuestionProps>({
    resolver: yupResolver(EditQuestionSchema),
    mode: "onChange",
  });


  useEffect(() => {
    dispatch(getSpecializations({}) as any);
    dispatch(fetchUsers({}) as any);
  }, []);

  useEffect(() => {
    if (showEdit && id) {
      dispatch(fetchExpertsQuestion(id?.toString()) as any);
      setValue("body", question?.body || "");
    }
  }, [showEdit, id]);

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

  const EditQuestionSubmit = async (formvalues: any) => {
    if (id) {
      let body = {
        specializationId: selectedSpecializationsId,
        body: formvalues.body,
        expertIds: usersSelected?.map(({ id }) => id),
      };
      await dispatch(editQuestion({ body, id }) as any).then((res: any) => {
        if (
          res?.payload?.message === "QuestionIsEditedSuccessfully" ||
          res?.payload?.statusEnum === 1
        ) {
          handleCloseEdit();
          showSuccessAlert(true, "EditedSuccessfully", intl);
        } else if (res?.payload?.message === '["QuestionIsNotFound"]') {
          handleCloseEdit();
          showSuccessAlert(false, "AnErrorOccured", intl);
        } else if (res?.payload?.message) {
          handleCloseEdit();
          showSuccessAlert(false, "AnErrorOccured", intl);
        }
      });
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


  return (
    <div className="modal-dialog modal-dialog-centered mw-650px">
      <Modal size="lg" centered show={showEdit} onHide={handleCloseEdit}>
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
                  {intl.formatMessage({ id: "EditQuestion" })}
                </h1>
              </Modal.Title>
            </div>
          </Modal.Header>

          <form
            noValidate
            className="form outputForm"
            onSubmit={handleSubmit(EditQuestionSubmit)}
          >
            {" "}
            <Modal.Body>
              <div className="row g-4">
                <div className="col-12">
                  <div className="mb-2 pt-2 pb-3">
                    <label
                      htmlFor="ExpertQuestion"
                      className="form-label px-2 required fw-bolder"
                    >
                      {intl.formatMessage({ id: "ExpertQuestion" })}
                    </label>
                    <textarea
                      {...register("body")}
                      id="body"
                      className="form-control form-control form-control-solid mb-3 mb-lg-2 min-h-100px"
                      placeholder={intl.formatMessage({
                        id: "WriteYourQuestion",
                      })}
                    />
                  </div>
                  {DisplayErrorMessage(
                    errors?.body?.message,
                    intl,
                    intl.locale
                  )}
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="justify-content-center py-2">
              <div className="d-flex justify-content-center mt-5">
                <button
                  type="reset"
                  onClick={handleCloseEdit}
                  aria-hidden="true"
                  className="btn btn-secondary px-15 me-5"
                >
                  {intl.formatMessage({ id: "Cancel" })}
                </button>
                <button
                  className="btn btn-success px-15 ms-5"
                >
                  {intl.formatMessage({ id: "Save" })}
                </button>
              </div>
            </Modal.Footer>
          </form>
        </div>
      </Modal>
    </div>
  );
};
