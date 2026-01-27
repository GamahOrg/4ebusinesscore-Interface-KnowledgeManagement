import { FC } from "react";
import { KnowledgeBlogDetailsAdmin } from "./components/KnowledgeBlogDetailsAdmin";
import { useLocation } from "react-router-dom";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";

const KnowledgeBloggingDetailsAdmin: FC = () => {
  let location = useLocation();
  let id = location?.state?.mainClassificationId || "";
  let cardName = location?.state?.cardTitle;
  let serviceName = location?.state?.serviceName;

  const breadcrumbItems = [
    {
      path: "/knowledge-blogging",
      defaultName: "Blogging",
      name: cardName || serviceName  || localStorage.getItem("state"),
    },
    {
    defaultName: "BlogDetails",
    }
  ];
  
  return (
    <>
    
<DynamicToolbar
            defaultTitle="Blogging"
            extraTitle=""
            breadcrumbItems={breadcrumbItems}
            showWorkspace={id ? false : true}
            cardOption={cardName || serviceName}
          />
      <KnowledgeBlogDetailsAdmin />
    </>
  );
};

export { KnowledgeBloggingDetailsAdmin };
