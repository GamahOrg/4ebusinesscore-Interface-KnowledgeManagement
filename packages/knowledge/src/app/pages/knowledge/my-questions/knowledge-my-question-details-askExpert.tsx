import { useLocation } from "react-router-dom";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { QuestionDetailsAskExpert } from "./components/QuestionDetailsAskExpert";

const KnowledgeMyQuestionDetailsAskExpert = () => {
  let location = useLocation();

  let cardName = location?.state?.cardTitle;
  let serviceName = location?.state?.serviceName;
  let id =
    location?.state?.mainClassificationId || location?.state?.cardId || "";

  const breadcrumbItems = [
    {
      path: "/knowledge-ask-expert",
      defaultName: "AskExpert",
      name: cardName || serviceName,
    },
    {
      path: "/knowledge-ask-expert/knowledge-my-questions-ask-expert",
      defaultName: "MyQuestions",
    },
    {
      path: "",
      defaultName: "QuestionDetails",
      name: "",
    },
  ];
  return (
    <>
      <DynamicToolbar
        defaultTitle="QuestionDetails"
        extraTitle=""
        breadcrumbItems={breadcrumbItems}
        showWorkspace={true}
        cardOption={cardName || serviceName}
        fixedTitle={true}
        cardId={id}
      />
      <QuestionDetailsAskExpert />
    </>
  );
};

export default KnowledgeMyQuestionDetailsAskExpert;
