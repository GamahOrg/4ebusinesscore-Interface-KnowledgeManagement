import { FC } from "react";
import { KnowledgeChallengeDetailsAdmin } from "./components/KnowledgeChallengeDetailsAdmin";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { useLocation } from "react-router-dom";

const KnowledgeAskChallengeDetailsAdmin: FC = () => {
  let location = useLocation();
  let id = location?.state?.mainClassificationId || "";
  let cardName = location?.state?.cardTitle;
  let serviceName = location?.state?.serviceName;

  const breadcrumbItems = [
    {
      path:"/knowledge-ask-challenge",
      defaultName: "Challenges",
      name: cardName || serviceName || localStorage.getItem("state"),
    },
    {
      defaultName: "ChallengeDetails",
    }
  ];
  return (
    <>
        <DynamicToolbar defaultTitle="ChallengeDetails" extraTitle="" breadcrumbItems={breadcrumbItems} showWorkspace={id ? false : true} cardOption={cardName || serviceName} />
      <KnowledgeChallengeDetailsAdmin />
    </>
  );
};

export { KnowledgeAskChallengeDetailsAdmin };
