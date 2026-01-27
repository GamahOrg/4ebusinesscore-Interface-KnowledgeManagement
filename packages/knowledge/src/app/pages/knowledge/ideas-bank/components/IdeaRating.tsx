import { FC, useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { AddRatingPopup } from "../../../partials/AddRatingPopup";
import { useAppDispatch } from "../../../../store/store";
import {
  fetchIdea,
  likeDislike,
  rateIdea,
} from "../../../../features/idea/ideaSlice";
import Idea from "../../../../models/Idea";
import AddAnswer from "../popup/add-answer";
import { RatingItems } from "../../../partials/RatingItems";
import { useNavigate } from "react-router-dom";

enum ReactionState {
  Liked = 0,
  NotLikedOrDisliked = -1,
  Disliked = 1,
}
interface props {
  idea: Idea;
  update: any;
  pageSize?: any;
}

const IdeaRating: FC<props> = ({ idea, update, pageSize }) => {
  const navigate = useNavigate();
  const intl = useIntl();
  const [modalRShow, setModalRShow] = useState<boolean>(false);
  const [stars, setStars] = useState<number>(0);
  const [actionLoading, setActionLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [isLiked, setIsLiked] = useState<ReactionState>(
    ReactionState.NotLikedOrDisliked
  );
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const handleReaction = async (value: any) => {
    if (!actionLoading) {
      setActionLoading(true);
      await dispatch(
        likeDislike({ ideaBankId: idea.id, likeStatus: value }) as any
      ).then((res: any) => {
        setActionLoading(false);
        if (res.payload.statusEnum == 1) {
          if (value == isLiked) {
            setIsLiked((prev) => -1);
          } else {
            setIsLiked((prev) => value);
          }
        }
      });

      await dispatch(fetchIdea(idea?.id) as any);
    }
  };

  const ratingHandler = async (value: number) => {
    dispatch(rateIdea({ ideaBankId: idea.id, rateValue: value }) as any);
  };

  useEffect(() => {
    if (idea) {
      if (idea.isLikedByLoggedInUser) {
        setIsLiked(() => 0);
      } else if (idea.isDisLikedByLoggedInUser) {
        setIsLiked(() => 1);
      } else {
        setIsLiked(() => -1);
      }
      setStars(idea?.rates || 0);
    }
  }, [idea]);

  return (
    <>
      <div>
        <div>
          <div className="mb-4 pt-2">
            <div className="border-bottom mb-2 py-1">
              <h5>{intl.formatMessage({ id: "Approval" })}</h5>
            </div>
            <div className="row gy-5 py-5 my-4 align-items-center">
              <div className="col-md-3">
                <div>
                  <h5 className="text-gray-700">
                    {intl.formatMessage({ id: "DoYouSupportThisIdea" })}
                  </h5>
                </div>
              </div>
              <div className="col-md-9">
                <div className="d-flex justify-content-start align-items-center">
                  <div
                    role="button"
                    onClick={() => handleReaction(0)}
                    className={`bg-success px-3 py-2 rounded-2 text-white mx-2  ${
                      isLiked == 0 ? "" : "opacity-60"
                    }`}
                  >
                    <i
                      className={`fa-regular fa-thumbs-up mx-1 fs-3 fa-fw`}
                    ></i>{" "}
                    {intl.formatMessage({ id: "Like" })}
                  </div>
                  <div
                    role="button"
                    onClick={() => handleReaction(1)}
                    className={`bg-danger px-3 py-2 rounded-2 text-white mx-2  ${
                      isLiked == 1 ? "" : "opacity-60"
                    }`}
                  >
                    <i
                      className={`fa-regular fa-thumbs-down mx-1 fs-3 fa-fw`}
                    ></i>{" "}
                    {intl.formatMessage({ id: "Dislike" })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4 pt-2">
            <div className="border-bottom mb-2 py-1">
              <h5>{intl.formatMessage({ id: "Reviews" })}</h5>
            </div>
            <div className="row gy-5 py-5 my-4 align-items-center">
              <div className="col-md-2">
                <div>
                  <h5 className="text-gray-700">
                    {intl.formatMessage({ id: "AddYourReview" })}
                  </h5>
                </div>
              </div>
              <div
                onClick={() => setModalRShow(true)}
                className="cursor-pointer"
              >
                {RatingItems(stars, "fa-2x mx-2")}
              </div>
            </div>
          </div>
          <div className="mb-4 pt-2">
            <div className="border-bottom mb-2 py-1">
              <h5>{intl.formatMessage({ id: "Comments" })}</h5>
            </div>
            <div className="row gy-5 pt-5  my-4 align-items-center">
              <div className="col-md-3">
                <div>
                  <h5 className="text-gray-700">
                    {intl.formatMessage({ id: "AddAComment" })}
                  </h5>
                </div>
              </div>
              <div className="col-md-9">
                <div className="d-flex justify-content-start align-items-center">
                  <button
                    type="reset"
                    data-bs-dismiss="modal"
                    aria-hidden="true"
                    className="btn btn-sm btn-secondary px-15 me-5"
                    onClick={() => navigate(`/knowledge-ideas-bank`)}
                  >
                    {intl.formatMessage({ id: "Cancel" })}
                  </button>
                  <button
                    className="btn btn-sm btn-success px-15 ms-5"
                    onClick={() => setShow(true)}
                  >
                    {intl.formatMessage({ id: "Add" })}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="Rega_modal_add_rating" aria-hidden="true">
        <AddRatingPopup
          show={modalRShow}
          handleClose={() => setModalRShow(false)}
          setStars={setStars}
          ratingHandler={ratingHandler}
        />
      </div>
      <div className="modal fade" id="Rega_modal_Delete" aria-hidden="true">
        <AddAnswer
          show={show}
          handleClose={handleClose}
          id={idea.id}
          page={pageSize}
        />
      </div>
    </>
  );
};

export { IdeaRating };
