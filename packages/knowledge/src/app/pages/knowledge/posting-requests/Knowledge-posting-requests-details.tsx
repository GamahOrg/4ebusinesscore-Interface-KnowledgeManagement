import KnowledgePostingRequestsDetailsHome from './components/KnowledgePostingRequestsDetails'
import { useLocation } from "react-router-dom";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
function KnowledgePostingRequestsDetails() {
  let location = useLocation();
  let id = location?.state?.mainClassificationId || "";
  let cardName = location?.state?.cardTitle;
  let serviceName = location?.state?.serviceName;

  const breadcrumbItems = [
    {
      path:"/knowledge-posting-requests",
      defaultName: "PostingRequests",
      name: cardName || serviceName || localStorage.getItem("state"),
    },
    {
      defaultName: "RequestDetails",
    }
  ];


  return (
    <>
      <DynamicToolbar
        defaultTitle="PostingRequests"
        extraTitle=""
        breadcrumbItems={breadcrumbItems}
        showWorkspace={id ? false : true}
        cardOption={cardName || serviceName}
      />
      <KnowledgePostingRequestsDetailsHome />
    </>
  );
}

export default KnowledgePostingRequestsDetails;
