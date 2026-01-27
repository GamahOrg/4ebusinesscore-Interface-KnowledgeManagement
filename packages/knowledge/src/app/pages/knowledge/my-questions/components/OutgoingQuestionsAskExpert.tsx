import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import { fetchOutgoingQuestions } from "../../../../features/questions/questionSlice";
import { SystemPagination } from "@4eplatform/shared/components/SystemPagination";
import QuestionAskExpert from "./QuestionAskExpert";

const OutgoingQuestionsAskExpert = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  let myOutgoingQuestions = useSelector((state: RootState) => {
    return state?.questions?.outgoingQuestions;
  });
  let totalItems = useSelector((state: RootState) => {
    return state?.questions?.totalItemsForOutgoing;
  });
  let totalPages = useSelector((state: RootState) => {
    return state?.questions?.totalPagesForOutgoing;
  });

  useEffect(() => {
    dispatch(
      fetchOutgoingQuestions({
        pageSize: pageSize,
        pageNumber: pageIndex,
      }) as any
    );
  }, [pageSize, pageIndex]);

  return (
    <div className="card card-xl-stretch mb-xl-0 pb-4 pt-15">
      <div className="card-body py-3 px-3 mx-8">
        <div className="tab-content">
          <div
            className="tab-pane fade active show"
            id="REGA_table_widget_5_tab_1"
          >
            <div className="d-flex justify-content-between mb-5 mt-20">
              <span className="text-dark  card-label fw-bolder fs-5">
                {intl.formatMessage({ id: "Questions" })}
              </span>
              <span className="text-primary  card-label fw-bolder fs-5">
                {intl.formatMessage({ id: "QuestionsTotalNumber" })} :{" "}
                {totalItems}{" "}
              </span>
            </div>
            <div className="row gx-10 gy-10">
              {myOutgoingQuestions?.length ? (
                <>
                  {myOutgoingQuestions?.map((question: any, index: any) => (
                    <div key={index} className="col-md-6">
                      <QuestionAskExpert
                        question={question}
                        pageIndex={pageIndex}
                        pageSize={pageSize}
                      />
                    </div>
                  ))}
                </>
              ) : (
                <div className="d-flex fw-bolder justify-content-center align-items-center">
                  {intl.formatMessage({ id: "No_data_yet" })}
                </div>
              )}
            </div>

            <SystemPagination
              totalPages={totalPages}
              totalItems={totalItems}
              pageIndex={pageIndex}
              pageSize={pageSize}
              setPageIndex={setPageIndex}
              setPageSize={setPageSize}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutgoingQuestionsAskExpert;
