import { AddQuestion } from "./components/AddQuestion";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { useLocation } from "react-router-dom";

const KnowledgeAddQuestion = () => {
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
        defaultName: "AddQuestion",
        name:"",
      },
    ];
  return (
    <>
      <DynamicToolbar
          fixedTitle={true}
          defaultTitle="AddQuestion"
          extraTitle=""
          breadcrumbItems={breadcrumbItems}
          showWorkspace={true}
          cardOption={cardName || serviceName}
          cardId={id}
        />
      <AddQuestion />
    </>
  )
}

export {KnowledgeAddQuestion}