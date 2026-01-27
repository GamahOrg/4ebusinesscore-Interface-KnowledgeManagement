import React, { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { RootState, useAppDispatch } from "../../../../store/store";
import { useSelector } from "react-redux";
import { fetchUserAndIOrgIndicators } from "../../../../features/indicators/indicatorsSlice";
import Spinner from "react-bootstrap/esm/Spinner";

const SeventeenthAccordion = () => {
    const intl = useIntl();
    const dispatch = useAppDispatch();
    const { userAndIOrgIndicators, loading, error } = useSelector(
    (state: RootState) => state.knowledgeIndicators
  );

    useEffect(() => {
    if (!userAndIOrgIndicators) {
      dispatch(fetchUserAndIOrgIndicators());
    }
    }, [dispatch, userAndIOrgIndicators]);

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
  
  const statisticsCards = [
    {
      icon: "fas fa-folder-open fs-4 text-warning",
      title: intl.formatMessage({ id: "CountOfInteractiveUsers" }),
      percentage: 76,
      value: userAndIOrgIndicators?.countOfInteractiveUsers,
      cardClass: "bg-warning",
    },
  ];

  return (
    <div>
      <div className="row d-flex flex-wrap">
        {statisticsCards.map((card: any, index: number) => (
          <div className="col-12 mb-4" key={index}>
            <div
              className="p-5 rounded d-flex align-items-center shadow-sm"
              key={index}
            >
              <div className="w-100">
                <div className="d-flex flex-row align-items-center">
                  <div
                    className={`${card.cardClass} bg-opacity-10 rounded-circle p-2 d-flex flex-column align-items-center justify-content-center w-30px h-30px`}
                  >
                    {card.icon.type === undefined ? (
                      <i className={card.icon}> </i>
                    ) : (
                      <span className="symbol-label bg-light-danger">
                        <span className="svg-icon svg-icon-2 svg-icon-danger">
                          {card.icon}
                        </span>
                      </span>
                    )}
                  </div>
                  <span className="ms-2 fs-5">{card.title}</span>
                </div>
                <div className="d-flex align-items-center my-4">
                  <span className="h4 mb-0 fw-bolder">{card.value}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeventeenthAccordion;
