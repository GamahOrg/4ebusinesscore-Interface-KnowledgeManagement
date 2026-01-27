import {FC, useEffect} from 'react'
import { useIntl } from 'react-intl'
import { AdminExpertCard } from './components/AdminExpertCard'
import { Link, useLocation } from 'react-router-dom'
import DynamicToolbar from '@4eplatform/shared/components/DynamicToolbar'


const KnowledgeExperts: FC = () => {
  let location = useLocation();
  let id = location?.state?.mainClassificationId || "";
  let cardName = location?.state?.cardTitle;
  let serviceName = location?.state?.serviceName;

  const breadcrumbItems = [
    {
      defaultName: "Experts",
      name: cardName || serviceName,
    },
  ];

  const cardTitle =location?.state?.serviceName || location?.state?.cardTitle || "";
  useEffect(() => {
  if (cardTitle !== null && cardTitle !== "")
    localStorage.setItem("state",cardTitle as string);
  }, []);
  const intl = useIntl()

  return (
    <>
        <div id="kt_toolbar_container" className="container-xxl d-flex flex-stack flex-wrap p-0">

          <DynamicToolbar
            defaultTitle="Experts"
            extraTitle=""
            breadcrumbItems={breadcrumbItems}
            showWorkspace={id ? false : true}
            cardOption={cardName || serviceName}
          />
          <div className="d-flex align-items-center py-3 px-3 py-md-1">
          <Link
            to="/knowledge-experts-add-expert"
                className="btn btn-bg-white btn-active-color-primary"
          >
            {intl.formatMessage({ id: "AddExpert" })}
          </Link>
      </div>
      </div>
      <AdminExpertCard />
    </>
  )
}

export { KnowledgeExperts }
