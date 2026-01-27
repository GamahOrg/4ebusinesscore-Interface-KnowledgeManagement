import { FC } from "react";
import { useIntl } from "react-intl";
import { AllQuestion } from "./components/AllQuestion";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
const KnowledgeAskExpert: FC = () => {
  const intl = useIntl();
  const location = useLocation();
  let id =
    location?.state?.mainClassificationId || location?.state?.cardId || "";
  let cardName = location?.state?.cardTitle;
  let serviceName = location?.state?.serviceName;

  const breadcrumbItems = [
    {
      path: "",
      defaultName: "AskExpert",
      name: cardName || serviceName,
    },
  ];
  return (
    <>
      <div className="row ">
        <div className="col-12 col-md-6">
          <DynamicToolbar
            defaultTitle="AskExpert"
            extraTitle={cardName || serviceName}
            breadcrumbItems={breadcrumbItems}
            showWorkspace={true}
            cardOption={cardName || serviceName}
            cardId={id}
          />
        </div>
        <div className="d-flex align-items-center justify-content-md-end py-3 py-md-1 col-12 col-md-6">
          <div className="me-1">
            <Link
              to="/knowledge-ask-expert/knowledge-my-questions-ask-expert"
              className="btn btn-success mx-1 text-center me-1"
              state={{
                cardId: id,
                cardTitle: cardName || serviceName,
              }}
            >
              {intl.formatMessage({ id: "MyQuestions" })}
            </Link>
          </div>
          <div className="me-2">
            <Link
              to="/knowledge-ask-expert/knowledge-expert"
              className="btn btn-success mx-1 text-center me-1"
              state={{
                cardId: id,
                cardTitle: cardName || serviceName,
              }}
            >
              {intl.formatMessage({ id: "ViewExperts" })}
            </Link>
          </div>
          <Link
            to="/knowledge-ask-expert/knowledge-add-question"
            className="btn btn-bg-white btn-active-color-primary"
            state={{
              cardId: id,
              cardTitle: cardName || serviceName,
            }}
          >
            {intl.formatMessage({ id: "AddQuestion" })}
          </Link>
        </div>
      </div>
      <AllQuestion />
    </>
  );
};

export { KnowledgeAskExpert };
