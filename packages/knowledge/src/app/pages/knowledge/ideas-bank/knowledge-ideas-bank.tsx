import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { IdeaCard } from "./components/IdeaCard";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { useLocation } from "react-router-dom";
import AddIdeaPopup from "./popup/add-idea-popup";

const KnowledgeIdeasBank: FC = () => {
  const intl = useIntl();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const location = useLocation()
  let id = location?.state?.mainClassificationId || location?.state?.cardId || "";
  let cardName = location?.state?.cardTitle;
  let serviceName = location?.state?.serviceName;

  const breadcrumbItems = [
    {
      path: "",
      defaultName: "IdeaBank",
      name: cardName || serviceName,
    },
  ];
  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <DynamicToolbar
          defaultTitle="IdeaBank"
          extraTitle={cardName || serviceName}
          breadcrumbItems={breadcrumbItems}
          showWorkspace={true}
          cardOption={cardName || serviceName}
          cardId={id}
        />
        <div onClick={handleShow}>
          <div className="d-flex align-items-center py-3 py-md-1">
            <a className="btn btn-bg-white btn-active-color-primary">
              {intl.formatMessage({ id: "AddIdea" })}
            </a>
          </div>
        </div>
      </div>
      <div className="modal fade">
        <AddIdeaPopup handleClose={handleClose} show={show} />
      </div>
      <IdeaCard />
    </>
  );
};

export { KnowledgeIdeasBank };
