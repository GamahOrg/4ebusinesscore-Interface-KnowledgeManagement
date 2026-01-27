import { AdminExpertProfile } from "./components/AdminExpertProfile";
import { useLocation } from "react-router-dom";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";


const KnowledgeExpertsProfile = () => {
    let location = useLocation();
    let id = location?.state?.mainClassificationId || "";
    let cardName = location?.state?.cardTitle;
    let serviceName = location?.state?.serviceName;
  
    const breadcrumbItems = [
      {
        path:"/knowledge-experts",
        defaultName: "Experts",
        name: cardName || serviceName || localStorage.getItem("state"),
      },
      {
        defaultName: "ProfileExpert",
      }
    ];
    
    return (
      <>
  <DynamicToolbar
              defaultTitle="ProfileExpert"
              extraTitle=""
              breadcrumbItems={breadcrumbItems}
              showWorkspace={id ? false : true}
              cardOption={cardName || serviceName}
            />
        <AdminExpertProfile />
    </>
    );
}

export { KnowledgeExpertsProfile }

