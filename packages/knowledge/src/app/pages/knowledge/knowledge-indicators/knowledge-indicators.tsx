import { FC } from "react";
import { GenericToolbar } from "../../partials/GenericToolbar";
import { ReportsIndicators } from "./Components/ReportsIndicators";

const KnowledgeIndicators: FC = () => {
  return (
    <>
      <GenericToolbar
        list={[
          { key: "Workspace", value: "/" },
          { key: "KnowledgeIndicators", value: "" },
        ]}
      />
      <ReportsIndicators />
    </>
  );
};

export default KnowledgeIndicators ;
