import { FC, useEffect, useState } from "react";
import { KnowledgeBloggingBody } from "./components/KnowledgeBloggingBody";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { useLocation } from "react-router-dom";
import AddPostBlogPopup from "./popup/add-post-blog-popup";
import { useIntl } from "react-intl";


const KnowledgeBlogging: FC = () => {
  let location = useLocation();
  let id = location?.state?.mainClassificationId || "";
  let cardName = location?.state?.cardTitle;
  let serviceName = location?.state?.serviceName;

  const breadcrumbItems = [
    {
      defaultName: "Blogging",
      name: cardName || serviceName  || localStorage.getItem("state"),
    }
  ];
  
  const cardTitle =location?.state?.serviceName || location?.state?.cardTitle || "";
  useEffect(() => {
    if (cardTitle !== null && cardTitle !== "")
      localStorage.setItem("state",cardTitle as string);
  }, []);

  const intl = useIntl();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
    <div
          id="kt_toolbar_container"
          className="container-xxl d-flex flex-stack flex-wrap p-0"
        > 
      <DynamicToolbar
            defaultTitle="Blogging"
            extraTitle=""
            breadcrumbItems={breadcrumbItems}
            showWorkspace={id ? false : true}
            cardOption={cardName || serviceName}
          />

      <div className="d-flex align-items-center py-3 py-md-1">
            <div>
              <a
                className="btn btn-bg-white btn-active-color-primary"
                onClick={handleShow}
              >
                {intl.formatMessage({ id: "AddPost" })}
              </a>
            </div>
          </div>
          <div
            className="modal fade"
            id="rega_modal_blog_post"
          >
            <AddPostBlogPopup handleClose={handleClose} show={show} />
          </div>
          </div>
      <KnowledgeBloggingBody />
    </>
  );
};

export { KnowledgeBlogging };
