import { ExpertCard } from "./components/ExpertCard";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { useLocation } from "react-router-dom";

const KonwledgeExpert = () => {

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
      defaultName: "Experts",
      name:"",
    },
  ];
  return (
    <>
      <DynamicToolbar
          fixedTitle={true}
          defaultTitle="Experts"
          extraTitle=""
          breadcrumbItems={breadcrumbItems}
          showWorkspace={true}
          cardOption={cardName || serviceName}
          cardId={id}
        />
      <ExpertCard />
    </>
  )
}

export {KonwledgeExpert}