import { FC } from "react";
import { EditExpert } from "./components/EditExpert";
import { useLocation, useParams } from "react-router-dom";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";

const KnowledgeExpertsEditExpert: FC = () => {
  let location = useLocation();
  let id2 = location?.state?.mainClassificationId || "";
  let cardName = location?.state?.cardTitle;
  let serviceName = location?.state?.serviceName;
  let { id } = useParams();

  const breadcrumbItems = [
    {
      path: "/knowledge-experts",
      defaultName: "Experts",
      name: cardName || serviceName || localStorage.getItem("state"),
    },
    {
      path: `/knowledge-experts/knowledge-experts-profile/${id}`,
      defaultName: "ProfileExpert",
    },
    {
      defaultName: "EditExpertProfile",
    },
  ];

  return (
    <>
      <DynamicToolbar
        defaultTitle="EditExpertProfile"
        extraTitle=""
        breadcrumbItems={breadcrumbItems}
        showWorkspace={id2 ? false : true}
        cardOption={cardName || serviceName}
        fixedTitle={true}
      />
      <EditExpert />
    </>
  );
};

export { KnowledgeExpertsEditExpert };
