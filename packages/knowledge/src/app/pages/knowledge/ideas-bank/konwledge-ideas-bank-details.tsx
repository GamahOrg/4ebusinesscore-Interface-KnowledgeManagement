import { FC } from "react";
import { IdeaDetails } from "./components/IdeaDetails";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { useLocation } from "react-router-dom";

const KnowledgeIdeasBankDetails: FC = () => {
  const location = useLocation();
  let id =
    location?.state?.mainClassificationId || location?.state?.cardId || "";
  let cardName = location?.state?.cardTitle;
  let serviceName = location?.state?.serviceName;

  const breadcrumbItems = [
    {
      path: "/knowledge-ideas-bank",
      defaultName: "IdeaBank",
      name: cardName || serviceName,
    },
    {
      path: "",
      defaultName: "IdeaDetails",
      name: "",
    },
  ];
  return (
    <>
      <DynamicToolbar
        fixedTitle={true}
        defaultTitle="IdeaDetails"
        extraTitle=""
        breadcrumbItems={breadcrumbItems}
        showWorkspace={true}
        cardOption={cardName || serviceName}
        cardId={id}
      />
      <IdeaDetails />
    </>
  );
};

export { KnowledgeIdeasBankDetails };
