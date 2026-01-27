import { KnowledgeQuestionDetails } from "./components/QuestionDetails";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { useLocation } from "react-router-dom";

const KonwledgeQuestionDetails = () => {

    const location=useLocation()
    let id = location?.state?.mainClassificationId || location?.state?.cardId || "" ;
    let cardName = location?.state?.cardTitle;
    let serviceName = location?.state?.serviceName;
  
    const breadcrumbItems = [
      {
        path: "/knowledge-ask-expert",
        defaultName: "AskExpert",
        name:cardName || serviceName,
      },
      {
        path: "",
        defaultName: "QuestionDetails",
        name:"",
      },
    ];
  return (
    <>
      <DynamicToolbar
          fixedTitle={true}
          defaultTitle="QuestionDetails"
          extraTitle=""
          breadcrumbItems={breadcrumbItems}
          showWorkspace={true}
          cardOption={cardName || serviceName}
          cardId={id}
        />
      <KnowledgeQuestionDetails />
    </>
  )
}

export {KonwledgeQuestionDetails}