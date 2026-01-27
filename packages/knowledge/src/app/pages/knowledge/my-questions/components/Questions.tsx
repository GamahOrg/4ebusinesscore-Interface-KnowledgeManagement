import { useState, useEffect } from "react";
import Question from "./Question";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import { fetchExpertsQuestions } from "../../../../features/questions/questionSlice";
import { SystemPagination } from "@4eplatform/shared/components/SystemPagination";

const Questions = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  let myQuestions = useSelector((state: RootState) => {
    return state?.questions?.data;
  });
  let totalItems = useSelector((state: RootState) => {
    return state?.questions?.taotalItems;
  });
  let totalPages = useSelector((state: RootState) => {
    return state?.questions?.totalpages;
  });
  const userLogged = localStorage.getItem("userId");
  let [allQuestions, setAllQuestions] = useState<any>([]);

  useEffect(() => {
    dispatch(
      fetchExpertsQuestions({
        pageSize: pageSize,
        pageNumber: pageIndex,
      }) as any
    ).then((res: any) => {
      setAllQuestions(res?.payload?.result);
    });
  }, [pageSize, pageIndex, userLogged]);
  let [filteredQuestions, setFilteredQuestions] = useState<any>([]);

  useEffect(() => {
    setFilteredQuestions(
      allQuestions?.filter((question: any) => question?.createdBy == userLogged)
    );
  }, [userLogged, allQuestions]);

  return (
    <div className="card card-custom card-stretch gutter-b">
      <div className="card-body">
        <div className="d-flex justify-content-between mb-5">
          <span className="text-dark  card-label fw-bolder fs-5">
            {intl.formatMessage({ id: "Questions" })}
          </span>
          <span className="text-primary  card-label fw-bolder fs-5">
            {intl.formatMessage({ id: "QuestionsTotalNumber" })} :{" "}
            {filteredQuestions?.length}{" "}
          </span>
        </div>
        <div className="row gx-10 gy-10">
          {filteredQuestions?.map((question: any, index: any) => (
            <div key={index} className="col-md-6">
              <Question
                question={question}
                pageIndex={pageIndex}
                pageSize={pageSize}
              />
            </div>
          ))}
        </div>
        {myQuestions?.questions?.length ? (
          <SystemPagination
            totalPages={totalPages}
            totalItems={totalItems}
            pageIndex={pageIndex}
            pageSize={pageSize}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
          />
        ) : (
          <div className="d-flex fw-bolder justify-content-center align-items-center">
            {intl.formatMessage({ id: "No_data_yet" })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Questions;
