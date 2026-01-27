import { KnowledgeQuestionDetails } from "./components/QuestionDetails";
import { useLocation } from "react-router-dom";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";

const KnowledgeMyQuestionDetails = () => {
  let location = useLocation();

  let cardName = location?.state?.cardTitle;
  let serviceName = location?.state?.serviceName;

  const breadcrumbItems = [
    {
      path: "/knowledge-my-questions",
      defaultName: "Questions",
      name: cardName || serviceName,
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
      />
      <KnowledgeQuestionDetails />
    </>
  );
};

export default KnowledgeMyQuestionDetails;
