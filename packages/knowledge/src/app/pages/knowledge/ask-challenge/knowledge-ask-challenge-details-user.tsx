import { FC } from "react";
import { KnowledgeChallengeDetailsUser } from "./components/KnowledgeChallengeDetailsUser";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { useLocation } from "react-router-dom";

const KnowledgeAskChallengeDetailsUser: FC = () => {
  let location = useLocation();
  let id = location?.state?.mainClassificationId || "";
  let cardName = location?.state?.cardTitle;
  let serviceName = location?.state?.serviceName;

  const breadcrumbItems = [
    {
      path:"/knowledge-ask-challenge",
      defaultName: "Challenges",
      name: cardName || serviceName
    },
    {
      defaultName: "ChallengeDetails",
    }
  ];
  return (
    <>
      <DynamicToolbar defaultTitle="ChallengeDetails" extraTitle="" breadcrumbItems={breadcrumbItems} showWorkspace={id ? false : true} cardOption={cardName || serviceName} />
      <KnowledgeChallengeDetailsUser />
    </>
  );
};

export { KnowledgeAskChallengeDetailsUser };
