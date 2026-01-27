import React, { useState, useEffect } from "react";
import { IdeaComment } from "./IdeaComment";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../../store/store";
import { Comment as Comment } from "../../../../models/Comment";
import AddAnswer from "../popup/add-answer";
import { useIntl } from "react-intl";
import { fetchIdeaComments } from "../../../../features/comments/commentSlice";

interface IdeaCommentsProps {
  ideaId: string;
  setPageSize: any;
  pageSize: any;
}

const IdeaComments: React.FC<IdeaCommentsProps> = ({
  ideaId,
  setPageSize,
  pageSize,
}) => {
  const intl = useIntl();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const dispatch = useAppDispatch();

  const comments = useSelector((state: RootState) => {
    return state?.comments?.data?.comments;
  });

  const TotalItems = useSelector((state: RootState) => {
    return state?.comments?.data?.totalItems;
  });

  useEffect(() => {
    const fetchData = async () => {
      let params = `${ideaId}?pageSize=${pageSize}`;
      await dispatch(fetchIdeaComments(params) as any);
    };

    fetchData();
  }, [dispatch, ideaId, pageSize]);

  const showMoreHandler = () => {
    if (TotalItems - pageSize < 4) {
      setPageSize(pageSize + (TotalItems - pageSize));
    } else setPageSize(pageSize + 4);
  };

  return (
    <>
      {comments?.map((comment: Comment) => (
        <IdeaComment key={comment?.id} comment={comment} page={pageSize} />
      ))}

      <div className="d-flex border-top mt-3">
        <div className="d-flex flex-column pt-2">
          {pageSize < TotalItems ? (
            <div
              onClick={showMoreHandler}
              className="btn btn-outline-danger mb-2 text-hover-white"
            >
              {intl.formatMessage({ id: "MoreComments" })}
            </div>
          ) : null}
          <div
            className="btn btn-outline-primary text-hover-white"
            onClick={handleShow}
          >
            {intl.formatMessage({ id: "AddComment" })}...
          </div>
        </div>
      </div>
      <div className="modal fade" id="Rega_modal_Delete" aria-hidden="true">
        <AddAnswer
          show={show}
          handleClose={handleClose}
          id={ideaId}
          page={pageSize}
        />
      </div>
    </>
  );
};

export default IdeaComments;
