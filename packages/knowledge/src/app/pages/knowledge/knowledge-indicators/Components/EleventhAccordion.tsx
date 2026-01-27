import React, { useState, useEffect } from "react";
import CustomBarChart from "./BarCharts";
import { useIntl } from "react-intl";
import { RootState, useAppDispatch } from "../../../../store/store";
import { useSelector } from "react-redux";
import { fetchAskExpertIndex } from "../../../../features/indicators/indicatorsSlice";
import Spinner from "react-bootstrap/esm/Spinner";

const EleventhAccordion = () => {
      const intl = useIntl();
      const dispatch = useAppDispatch();
      const { askExpertIndicators, loading, error } = useSelector(
      (state: RootState) => state.knowledgeIndicators
    );

    useEffect(() => {
    if (!askExpertIndicators) {
      dispatch(fetchAskExpertIndex());
    }
    }, [dispatch, askExpertIndicators]);
  
    if (loading) {
      return (
        <div className="d-flex gap-4 justify-content-center align-items-center py-4">
          {intl.formatMessage({ id: "DataIsLoaded..." })}
          <Spinner animation="border" variant="primary" />
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="d-flex justify-content-center align-items-center py-4">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      );
    }

    const truncateLabel = (label: any, maxLength = 15) => {
    if (!label) return '';
    return label.length > maxLength 
      ? label.substring(0, maxLength) + '...' 
      : label;
     };

    const experts = askExpertIndicators?.experts || [];
    
    const labels = experts?.map((item: any) => truncateLabel(item?.expertName));
    const dataValues = experts?.map((item: any)=> item?.countOFSpecializations);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "",
        data: dataValues,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  return <CustomBarChart chartData={data} />;
};

export default EleventhAccordion;
