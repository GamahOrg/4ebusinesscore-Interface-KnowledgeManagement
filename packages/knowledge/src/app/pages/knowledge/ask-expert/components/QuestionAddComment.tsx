import { FC, useState } from "react";
import { useIntl } from "react-intl";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../../../../store/store";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ResponseStatus } from "../../../../enums/responseStatus";
import {
  addQuestionsComment,
  fetchQuestionsComments,
} from "../../../../features/comments/commentSlice";
import { addCommentQuestionValidations } from "../../../../validations/add-comment-question-validation";
import { Notification } from "@4eplatform/shared/services/notifications";
import { showSuccessAlert } from "@4eplatform/shared/services/helper";
import { toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";
const QuestionAddComment: FC = () => {
  const intl = useIntl();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState("");

  const { id: questionId } = useParams();
  const dispatch = useAppDispatch();
  const question = useAppSelector((state: RootState) => {
    return state?.questions?.data?.question;
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(addCommentQuestionValidations),
    mode: "all",
    reValidateMode: "onChange",
  });

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  let loggedInUserId = localStorage.getItem("userId");

  const onSubmit = async (data: any) => {
    let formdata = new FormData();
    formdata.append("Body", data?.body);
    if (questionId) formdata.append("QuestionId", questionId);
    if (selectedFile) formdata.append("CommentAttachment", selectedFile);

    setLoading(true);
    await dispatch(addQuestionsComment(formdata) as any).then((res: any) => {
      if (
        res?.payload?.message == "CommentIsAddedSuccessfully" &&
        res?.payload?.statusEnum == ResponseStatus.SavedSuccessfully
      ) {
        showSuccessAlert(true, "AddedSuccessfully", intl);
        reset();
        setLoading(false);
        dispatch(fetchQuestionsComments(questionId) as any);
        if (
          question?.createdBy?.toLowerCase() == loggedInUserId?.toLowerCase()
        ) {
        } else {
          Notification.replyQuestionFromExpert(
            question?.createdBy as string,
            `${
              (window as any)._env_?.PUBLIC_URL
            }/knowledge-my-questions/knowledge-my-question-details/${questionId}`,
            89,
            questionId as string,
            question?.email as string,
            true,
            100,
            question?.createdOn as string,
            question?.body as string,
            data?.body,
            "679d080f-78d7-45f7-96df-6b5bc1f3dafc",
            ""
          );
        }
      } else if (res?.payload?.message) {
        showSuccessAlert(false, res?.payload?.message, intl);
        setLoading(false);
        reset();
      }
    });
  };

  return (
    <>
      <div className="my-4">{intl.formatMessage({ id: "WriteAComment" })}</div>
      <div className="d-flex align-items-start">
        <div className="w-50px h-50px">
          <img
            src={
              JSON.parse(localStorage.getItem("userInfo") as string)?.imageUrl
                ? (window as any)._env_?.REACT_APP_API_User_Url +
                  "/" +
                  JSON.parse(localStorage.getItem("userInfo") as string)
                    .imageUrl
                : toAbsoluteUrl("/media/avatars/300-3.jpg")
            }
            className="w-100 rounded-3"
            alt="profile"
            onError={(e: any) =>
              (e.target.src = toAbsoluteUrl("/media/avatars/300-3.jpg"))
            }
          />
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate={true}
          style={{
            marginRight: intl?.locale == "ar" ? ".5rem" : "",
            marginLeft: intl?.locale == "en" ? ".5rem" : "",
          }}
          className="position-relative w-100"
        >
          <textarea
            style={{
              paddingLeft: intl?.locale == "ar" ? "105px" : ".75rem",
              paddingRight: intl?.locale == "ar" ? ".75rem" : "105px",
            }}
            className="form-control border-1 min-h-30px fs-6"
            rows={2}
            placeholder={intl.formatMessage({ id: "WriteAComment" })}
            {...register("body")}
          ></textarea>

          <div
            className="position-absolute d-flex translate-middle-y"
            style={{
              left: intl?.locale == "ar" ? "10px" : "",
              top: "50%",
              right: intl?.locale == "en" ? "10px" : "",
            }}
          >
            <label
              htmlFor="comment-submit"
              className="d-flex justify-content-center align-items-center bg-secondary w-35px h-35px rounded-circle mx-3"
              role="button"
            >
              <i
                className={`fa-regular fa-paper-plane fs-3 fa-fw text-gray-600  ${
                  intl?.locale == "ar" ? "fa-flip-horizontal" : ""
                }`}
              ></i>
            </label>
          </div>
          <input hidden type="submit" id="comment-submit" />
        </form>
      </div>
    </>
  );
};

export { QuestionAddComment };
