import { FC, useEffect, useState } from "react";
import { KnowledgeChallengeCard } from "./KnowledgeChallengeCard";
import { RootState, useAppDispatch } from "../../../../store/store";
import { fetchChallenges } from "../../../../features/challenge/challengeSlice";
import { useSelector } from "react-redux";
import { SystemPagination } from "../../../partials/SystemPagination";
import { useIntl } from "react-intl";
import { Spinner } from "react-bootstrap";

const KnowledgeAskChallengeBody: FC = () => {
  const intl = useIntl();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setLoading] = useState(true);

  const dispatch = useAppDispatch();

  const challenges = useSelector((state: RootState) => {
    return state?.challenges?.data?.Challenges;
  });
  const totalPages = useSelector((state: RootState) => {
    return state?.challenges?.data?.totalPages;
  });

  const getAllChallenges = async () => {
    setLoading(true);
    await dispatch(
      fetchChallenges({ PageNumber: currentPage, PageSize: pageSize }) as any
    );
    setLoading(false);
  };

  useEffect(() => {
    getAllChallenges();
  }, [currentPage, pageSize]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="card card-custom card-stretch gutter-b">
        <div className="card-body">
          <div className="row gy-5">
            {!isLoading ? (
              challenges?.length ? (
                <>
                  {challenges?.map((challenge) => (
                    <KnowledgeChallengeCard
                      key={challenge?.id}
                      challenge={challenge}
                    />
                  ))}
                  <SystemPagination
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    pageSize={pageSize}
                    currentPage={currentPage}
                  />
                </>
              ) : (
                <p className="text-center py-10">
                  {intl.formatMessage({ id: "NoChallenges" })}
                </p>
              )
            ) : (
              <div className="d-flex gap-4 justify-content-center align-items-center py-4">
                {intl.formatMessage({ id: "LoadingData" })}
                <Spinner animation="border" variant="primary" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export { KnowledgeAskChallengeBody };
