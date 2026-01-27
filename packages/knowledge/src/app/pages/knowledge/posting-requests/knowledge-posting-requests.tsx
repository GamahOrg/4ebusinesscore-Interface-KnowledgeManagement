import { FC, useEffect } from "react";
import KnowledgePostingRequestsHome from "./components/KnowledgePostingRequestsHome";
import { useLocation } from "react-router-dom";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";

const KnowledgePostingRequests: FC = () => {
  let location = useLocation();
  let id = location?.state?.mainClassificationId || "";
  let cardName = location?.state?.cardTitle;
  let serviceName = location?.state?.serviceName;

  const breadcrumbItems = [
    {
      defaultName: "PostingRequests",
      name: cardName || serviceName  ,
    }
  ];

  const cardTitle = location?.state?.serviceName || location?.state?.cardTitle || "";
  useEffect(() => {
    if (cardTitle !== null && cardTitle !== "")
      localStorage.setItem("state", cardTitle as string);
  }, []);

  return (
    <>
      <DynamicToolbar
        defaultTitle="PostingRequests"
        extraTitle=""
        breadcrumbItems={breadcrumbItems}
        showWorkspace={id ? false : true}
        cardOption={cardName || serviceName}
      />
      <KnowledgePostingRequestsHome />
    </>
  );
};

export { KnowledgePostingRequests };
