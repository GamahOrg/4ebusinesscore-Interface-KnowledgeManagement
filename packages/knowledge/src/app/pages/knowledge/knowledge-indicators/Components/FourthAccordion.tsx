import React, { useState, useEffect } from "react";
import CustomLineChart from "./LineCharts";
import { useIntl } from "react-intl";
import { RootState, useAppDispatch } from "../../../../store/store";
import { useSelector } from "react-redux";
import { fetchChallengeIndex } from "../../../../features/indicators/indicatorsSlice";
import Spinner from "react-bootstrap/esm/Spinner";

const FourthAccordion = () => {
        const intl = useIntl()
        const dispatch = useAppDispatch();
        const { challengesIndicators, loading, error } = useSelector(
        (state: RootState) => state.knowledgeIndicators
      );
    
        useEffect(() => {
        if (!challengesIndicators) {
          dispatch(fetchChallengeIndex());
        }
        }, [dispatch, challengesIndicators]);
    
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
  
      const chaleges = challengesIndicators?.chaleges || [];
      
      const labels = chaleges?.map((item: any) => truncateLabel(item?.chalegeTitle));
      const dataValues = chaleges?.map((item: any) => item?.countOfChallengeComments);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "",
        data: dataValues,
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  };
  return <CustomLineChart chartData={data} />;
};

export default FourthAccordion;
