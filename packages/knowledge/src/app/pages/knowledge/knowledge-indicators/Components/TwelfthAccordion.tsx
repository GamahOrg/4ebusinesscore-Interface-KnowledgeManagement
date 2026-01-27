import React, { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { RootState, useAppDispatch } from "../../../../store/store";
import { useSelector } from "react-redux";
import { fetchChallengeIndex } from "../../../../features/indicators/indicatorsSlice";
import Spinner from "react-bootstrap/esm/Spinner";

const TwelfthAccordion = () => {
    const intl = useIntl();
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
  
  const statisticsCards = [
    {
      icon: "fas fa-folder-open fs-4 text-warning",
      title: intl.formatMessage({ id: "CountOfChallenges" }),
      percentage: 76,
      value: challengesIndicators?.countOFChallenges,
      cardClass: "bg-warning",
    },
    {
      icon: "fas fa-folder fs-4 text-danger",
      title: intl.formatMessage({ id: "CountUsersReacted" }),
      percentage: 50,
      value: challengesIndicators?.countUsersReacted,
      cardClass: "bg-danger",
    },
    {
      icon: "fad fa-chalkboard-teacher fs-4 text-info",
      title: intl.formatMessage({ id: "CountOfComments" }),
      percentage: 8,
      value: challengesIndicators?.countOfComments,
      cardClass: "bg-info",
    },
    {
      icon: "bi bi-chat-text fs-4 text-success",
      title: intl.formatMessage({ id: "InteractionsOnChallenges" }),
      percentage: 55,
      value: challengesIndicators?.interactionsOnChallenges,
      cardClass: "bg-success",
    },
  ];

  return (
    <div>
      <div className="row d-flex flex-wrap">
        {statisticsCards.map((card: any, index: number) => (
          <div className="col-12 col-md-4 mb-4" key={index}>
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

export default TwelfthAccordion;
