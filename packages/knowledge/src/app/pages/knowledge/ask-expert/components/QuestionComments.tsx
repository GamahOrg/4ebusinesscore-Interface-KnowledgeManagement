import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../../../store/store";
import { fetchQuestionsComments } from "../../../../features/comments/commentSlice";
import { QuestionComment } from "./QuestionComment";
import { QuestionAddComment } from "./QuestionAddComment";

const QuestionComments: FC = () => {
  const intl = useIntl();
  const [showDelete, setShowDelete] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);

  const { id: questionId } = useParams();
  const dispatch = useDispatch();

  const comments = useSelector((state: RootState) => {
    return state?.comments?.data?.comments;
  });

  const getQuestionComments = async (id: string) => {
    await dispatch(fetchQuestionsComments(id) as any);
  };

  useEffect(() => {
    if (questionId) getQuestionComments(questionId);
  }, [questionId]);

  return (
    <>
      {comments?.reverse()?.map((comment) => (
        <QuestionComment key={comment?.id} comment={comment} />
      ))}
      <QuestionAddComment />
    </>
  );
};

export { QuestionComments };
