import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { KnowledgeAskChallengeBody } from "./components/KnowledgeAskChallengeBody";
import AddChallengePopup from "./popup/add-challenge-popup";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { useLocation } from "react-router-dom";

const KnowledgeAskChallenge: FC = () => {
  const intl = useIntl();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let location = useLocation();

  let id = location?.state?.mainClassificationId || "";
  let cardName = location?.state?.cardTitle;
  let serviceName = location?.state?.serviceName;

  const breadcrumbItems = [
    {
      defaultName: "Challenges",
      name: cardName || serviceName,
    },
  ];
  const cardTitle =location?.state?.serviceName || location?.state?.cardTitle || "";
  useEffect(() => {
    if (cardTitle !== null && cardTitle !== "")
      localStorage.setItem("state",cardTitle as string);
  }, []);
  return (
    <>
      <div id="kt_toolbar_container" className="container-xxl d-flex flex-stack flex-wrap p-0">
        <DynamicToolbar defaultTitle="Challenges" extraTitle="" breadcrumbItems={breadcrumbItems} showWorkspace={id ? false : true} cardOption={cardName || serviceName} />

        <div className="d-flex align-items-center py-3 py-md-1">
          <div>
            <a className="btn btn-bg-white btn-active-color-primary" onClick={handleShow}>
              {intl.formatMessage({ id: "AddChallenge" })}
            </a>
          </div>
        </div>
        <div className="modal fade" aria-hidden="true">
          <AddChallengePopup handleClose={handleClose} show={show} />
        </div>
      </div>
      <KnowledgeAskChallengeBody />
    </>
  );
};

export { KnowledgeAskChallenge };
