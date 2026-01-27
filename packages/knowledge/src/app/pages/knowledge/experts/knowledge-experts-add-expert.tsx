import {FC} from 'react'
import { AddExpert } from './components/AddExpert'
import DynamicToolbar from '@4eplatform/shared/components/DynamicToolbar'
import { useLocation } from 'react-router-dom'



const KnowledgeExpertsAddExpert: FC = () => {
  let location = useLocation();
  let id = location?.state?.mainClassificationId || "";
  let cardName = location?.state?.cardTitle;
  let serviceName = location?.state?.serviceName;

  const breadcrumbItems = [
    {
      path:"/knowledge-experts",
      defaultName: "Experts",
      name: cardName || serviceName || localStorage.getItem("state"),
    },
    {
      defaultName: "AddExpert",
    }
  ];


  return (
    <>
<DynamicToolbar
            defaultTitle="AddExpert"
            extraTitle=""
            breadcrumbItems={breadcrumbItems}
            showWorkspace={id ? false : true}
            cardOption={cardName || serviceName}
          />
      <AddExpert />
    </>
  )
}

export { KnowledgeExpertsAddExpert }
