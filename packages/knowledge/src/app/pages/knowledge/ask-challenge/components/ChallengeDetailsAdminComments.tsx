import { FC, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RootState, useAppDispatch } from "../../../../store/store";
import { useSelector } from "react-redux";
import { fetchChallengeComments } from "../../../../features/comments/commentSlice";
import { ChallengeAdminComment } from "./ChallengeAdminComment";
import { ChallengeAddComment } from "./ChallengeAddComment";

const ChallengeDetailsAdminComments: FC = () => {
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
  }, [challengeId]);


  return (
    <>
      {comments?.map((comment) => (
        <ChallengeAdminComment key={comment?.id} comment={comment} />
      ))}
      <ChallengeAddComment />
    </>
  );
};

export { ChallengeDetailsAdminComments };
