import { useIntl } from "react-intl";
import { QuestionCard } from "./QuestionsCard";
import { useEffect, useState } from "react";
import { fetchExpertsQuestions } from "../../../../features/questions/questionSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import { SystemPagination } from "@4eplatform/shared/components/SystemPagination";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { getExperts } from "../../../../features/experts/expertsSlice";
import { Spinner } from "react-bootstrap";

const AllQuestion = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  let [managerId, setManagerId] = useState<string>();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState("");
  let myQuestions = useSelector((state: RootState) => {
    return state?.questions?.data;
  });
  let totalItems = useSelector((state: RootState) => {
    return state?.questions?.taotalItems;
  });
  let totalPages = useSelector((state: RootState) => {
    return state?.questions?.totalpages;
  });
  let [allQuestions, setAllQuestions] = useState<any>([]);

  const encodedSearchTerm = searchTerm?.split(" ")?.slice(0)[0];

  useEffect(() => {
    setIsLoading(true);
    dispatch(
      fetchExpertsQuestions({
        pageSize: pageSize,
        pageNumber: pageIndex,
        searchTerm: encodedSearchTerm,
      }) as any
    ).then((res: any) => {
      setIsLoading(false);
      setAllQuestions(res?.payload?.result);
    });
  }, [pageSize, pageIndex, searchTerm]);

  useEffect(() => {
    dispatch(
      getExperts({
        searchTerm: "",
        pageNumber: 1,
        pageSize: 1000,
      }) as any
    );
  }, []);

  let expetrs = useSelector((state: RootState) => {
    return state?.experts?.data;
  });

  const options = expetrs?.map((expetr: any) => ({
    value: expetr?.userId,
    label: expetr?.expertName,
  }));

  const {
    control,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    mode: "all",
    reValidateMode: "onChange",
  });
  return (
    <div className="card card-custom card-stretch gutter-b">
      <div className="card-body">
        <div className="d-flex flex-column flex-md-row gap-5 gap-md-0 justify-content-between align-items-md-center mb-5">
          <div className="col-12 col-sm-8 col-md-8 col-xl-4 col-lg-4 col-md-4 col-sm-4 position-relative text-center ms-md-0">
            <Controller
              name="managerId"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  {...field}
                  id="ExpertName"
                  className="react-select__container"
                  classNamePrefix="react-select"
                  placeholder={intl.formatMessage({
                    id: "ExpertName",
                  })}
                  options={options}
                  isClearable={true}
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption ? selectedOption.value : "");
                    setManagerId(selectedOption ? selectedOption.value : null);
                    setSearchTerm(selectedOption ? selectedOption.label : null);
                  }}
                  value={options?.find(
                    (option: any) => option.value === field.value
                  )}
                  noOptionsMessage={() =>
                    intl.formatMessage({
                      id: "NotAvailableUserName",
                    })
                  }
                />
              )}
            />
          </div>
          <span className="text-primary  card-label fw-bolder fs-5">
            {intl.formatMessage({ id: "QuestionsTotalNumber" })} :{" "}
            {allQuestions?.length}{" "}
          </span>
        </div>
        {isLoading ? (
          <div className="d-flex gap-4 justify-content-center align-items-center py-4">
            {intl.formatMessage({ id: "LoadingData" })}
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <div className="row gx-10 gy-10">
            {allQuestions?.map((question: any, index: any) => (
              <div key={index} className="col-md-6">
                <QuestionCard
                  question={question}
                  pageIndex={pageIndex}
                  pageSize={pageSize}
                  setAllQuestions={setAllQuestions}
                />
              </div>
            ))}
            {allQuestions.length > 0 ? (
              <SystemPagination
                totalPages={myQuestions?.totalPages || totalPages}
                totalItems={myQuestions?.totalItems || totalItems}
                pageIndex={pageIndex}
                pageSize={pageSize}
                setPageIndex={setPageIndex}
                setPageSize={setPageSize}
              />
            ) : (
              <div className="col-12 text-center mt-10">
                <p>{intl.formatMessage({ id: "No_data_yet" })} </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export { AllQuestion };
