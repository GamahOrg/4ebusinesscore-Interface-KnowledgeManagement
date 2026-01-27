import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { useAppDispatch } from "../../../../store/store";
import { useParams } from "react-router-dom";
import {
  addChallengeComment,
  fetchChallengeComments,
} from "../../../../features/comments/commentSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addCommentChallengeValidations } from "../../../../validations/add-comment-challenge-validation";
import { ResponseStatus } from "../../../../enums/responseStatus";
import { fetchChallenge } from "../../../../features/challenge/challengeSlice";
import { showSuccessAlert } from "@4eplatform/shared/services/helper";
import { toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";

const ChallengeAddComment: FC = () => {
  const intl = useIntl();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState("");

  const { id: challengeId } = useParams();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>({
    resolver: yupResolver(addCommentChallengeValidations),
    mode: "all",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: any) => {
    let formdata = new FormData();
    formdata.append("Description", data?.description);
    if (challengeId) {
      formdata.append("ChallengeId", challengeId);
    }

    if (selectedFile) formdata.append("CommentAttachment", selectedFile);

    setLoading(true);
    await dispatch(addChallengeComment(formdata) as any).then((res: any) => {
      if (
        res?.payload?.message == "CommentIsAddedSuccessfully" &&
        res?.payload?.statusEnum == ResponseStatus.SavedSuccessfully
      ) {
        showSuccessAlert(true, "AddedSuccessfully", intl);
        reset();
        setLoading(false);
      } else if (res?.payload?.message) {
        showSuccessAlert(false, res?.payload?.message, intl);
        setLoading(false);
      }
    });
    await dispatch(fetchChallengeComments(challengeId) as any);
    await dispatch(fetchChallenge(challengeId) as any);
  };

  return (
    <>
      <div className="my-3">{intl.formatMessage({ id: "WriteAComment" })}</div>
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
            onError={(e: any) =>
              (e.target.src = toAbsoluteUrl("/media/avatars/300-3.jpg"))
            }
            className="w-100 rounded-3"
            alt="profile"
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
            {...register("description")}
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
      {errors.description && (
        <div className="text-danger mt-1">
          {intl.formatMessage({
            id: errors.description.message,
          })}
        </div>
      )}
    </>
  );
};

export { ChallengeAddComment };
