
import { ExpertProfile } from "./components/ExpertProfile";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { useLocation } from "react-router-dom";
const KnowledgeProfileExpert = () => {
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
        path: "/knowledge-expert",
        defaultName: "Experts",
        name:"",
      },
      {
        path: "",
        defaultName: "ProfileExpert",
        name:"",
      },
    ];
    return(
    <>
        <DynamicToolbar
          fixedTitle={true}
          defaultTitle="ProfileExpert"
          extraTitle=""
          breadcrumbItems={breadcrumbItems}
          showWorkspace={true}
          cardOption={cardName || serviceName}
          cardId={id}
        />
        <ExpertProfile />
    </>
    );
}

export {KnowledgeProfileExpert}