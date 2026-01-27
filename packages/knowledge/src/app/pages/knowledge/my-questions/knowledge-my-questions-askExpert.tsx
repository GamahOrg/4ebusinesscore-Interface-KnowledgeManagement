import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { useDispatch } from "react-redux";
import { fetchOutgoingQuestions } from "../../../features/questions/questionSlice";
import OutgoingQuestionsAskExpert from "./components/OutgoingQuestionsAskExpert";
import IncomingQuestionsAskExpert from "./components/IncomingQuestionsAskExpert";

type ButtonTypes = {
  id: number;
  name: string;
};

const KnowledgeMyQuestionsAskExpert: FC = () => {
  let location = useLocation();
  const intl = useIntl();
  const dispatch = useDispatch();

  let cardName = location?.state?.cardTitle;
  let serviceName = location?.state?.serviceName;

  const breadcrumbItems = [
    {
      path: "/knowledge-ask-expert",
      defaultName: "AskExpert",
      name: "",
    },
    {
      path: "",
      defaultName: "MyQuestions",
      name: "",
    },
  ];

  const buttons: ButtonTypes[] = [
    {
      id: 1,
      name: "OutgoingQuestions",
    },
    {
      id: 2,
      name: "IncomingQuestions",
    },
  ];

  const [activeButton, setActiveButton] = useState<ButtonTypes>(buttons[0]);

  const handleButtonClick = (button: ButtonTypes) => {
    setActiveButton(button);
  };
  useEffect(() => {
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
        return <OutgoingQuestionsAskExpert />;
      case 2:
        return <IncomingQuestionsAskExpert />;
    }
  };
  return (
    <>
      <DynamicToolbar
        defaultTitle="MyQuestions"
        extraTitle={cardName || serviceName}
        breadcrumbItems={breadcrumbItems}
        showWorkspace={true}
        cardOption={cardName || serviceName}
        fixedTitle={true}
      />

      <div className="pb-4 w-100 position-relative">
        <div
          className="mb-5 p-4 mx-lg-4 mx-md-4 mx-sm-4 mx-0 position-absolute"
          style={{ zIndex: 50 }}
        >
          {buttons.map((button) => (
            <button
              key={button.id}
              className={`btn btn-active-color-primary rounded-0 bg-transparent border-0 p-5 fs-6  fw-bolder  border border-bottom border-white border-2 ${
                activeButton.id === button.id ? "text-dark active" : ""
              } px-5`}
              onClick={() => handleButtonClick(button)}
            >
              {intl.formatMessage({
                id: button.name,
              })}
            </button>
          ))}
        </div>
        {ActivatedUserDetailsTab()}
      </div>
    </>
  );
};

export { KnowledgeMyQuestionsAskExpert };
