import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { RootState, useAppDispatch } from "../../../../store/store";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ChallengeComment } from "./ChallengeComment";
import { ChallengeAddComment } from "./ChallengeAddComment";
import { fetchChallengeComments } from "../../../../features/comments/commentSlice";

const KnowledgeChallengeComments: FC = () => {
  const intl = useIntl();
  const [changeState, setChangeState] = useState(false)
  const { id: challengeId } = useParams();
  const dispatch = useAppDispatch();

  const comments = useSelector((state: RootState) => {
    return state?.comments?.data?.comments;
  });

  const getChallengeComments = async (id: string) => {
    await dispatch(fetchChallengeComments(id) as any);
  };

  useEffect(() => {
    if (challengeId) getChallengeComments(challengeId);
  }, [challengeId, changeState]);

  useEffect(() => {
    if (changeState) { 
      if (challengeId) {
        getChallengeComments(challengeId)
        setChangeState(false)
      }
    }
  }, [changeState]);


  return (
    <>
      {comments?.map((comment) => (
        <ChallengeComment key={comment?.id} comment={comment} setChangeState={setChangeState} />
      ))}
      <ChallengeAddComment />
    </>
  );
};

export { KnowledgeChallengeComments };
