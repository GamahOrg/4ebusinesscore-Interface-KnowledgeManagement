import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useLocation, useNavigate } from "react-router-dom";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import OutgoingQuestions from "./components/OutgoingQuestions";
import IncomingQuestions from "./components/IncomingQuestions";
import { useDispatch } from "react-redux";
import { fetchOutgoingQuestions } from "../../../features/questions/questionSlice";

type ButtonTypes = {
  id: number;
  name: string;
  url: string;
};

const KnowledgeMyQuestions: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const intl = useIntl();
  const dispatch = useDispatch();

  let cardName = location?.state?.cardTitle;
  let serviceName = location?.state?.serviceName;

  const breadcrumbItems = [
    {
      path: "",
      defaultName: "Questions",
      name: cardName || serviceName,
    },
  ];

  const buttons: ButtonTypes[] = [
    {
      id: 1,
      name: "OutgoingQuestions",
      url: "outgoing-questions",
    },
    {
      id: 2,
      name: "IncomingQuestions",
      url: "incoming-questions",
    },
  ];

  const [activeButton, setActiveButton] = useState<ButtonTypes>(buttons[0]);

  const handleButtonClick = (button: ButtonTypes) => {
    setActiveButton(button);
    navigate(`${location.pathname}#${button.url}`);
  };

  useEffect(() => {
    navigate(`${location.pathname}#outgoing-questions`);
    dispatch(
      fetchOutgoingQuestions({
        pageSize: "10",
        pageNumber: "1",
      }) as any
    );
  }, []);
  const ActivatedUserDetailsTab = () => {
    switch (activeButton.id) {
      case 1:
        return <OutgoingQuestions />;
      case 2:
        return <IncomingQuestions />;
    }
  };
  return (
    <>
      <DynamicToolbar
        defaultTitle="Questions"
        extraTitle={cardName || serviceName}
        breadcrumbItems={breadcrumbItems}
        showWorkspace={true}
        cardOption={cardName || serviceName}
      />

      <div className="card card-xl-stretch mb-xl-0 pb-4 pt-5">
        <div className="card-body py-3 px-3 mx-8">
          {buttons.map((button) => (
            <button
              key={button.id}
              className={`btn btn-active-color-primary rounded-0 bg-transparent border-0 p-5 fs-5 fw-bolder ${
                activeButton.id === button.id
                  ? "active text-dark border-bottom border-primary border-2"
                  : "text-muted"
              }`}
              onClick={() => handleButtonClick(button)}
            >
              {intl.formatMessage({ id: button.name })}
            </button>
          ))}
          {ActivatedUserDetailsTab()}
        </div>
      </div>
    </>
  );
};

export { KnowledgeMyQuestions };
