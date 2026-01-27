import { FC } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

type WorkParticipantsTooltipProps = {
  count: any;
  names: any;
};

export const WorkParticipantsTooltip: FC<WorkParticipantsTooltipProps> = ({
  count,
  names,
}) => {

  const renderTooltip = (props: any) => (
    <Tooltip
      id="button-tooltip"
      className="menu-rounded menu-gray-800 fw-bold w-150px p-0"
      {...props}
    >
      {names?.map((name:any) => {
        return (
          <p className="menu-link px-3 text-dark pe-none my-2">
            {name.firstName+ " " + name.secondName}
          </p>
        );
      })}
    </Tooltip>
  );
  
  return (
    <div className="card-toolbar text-center">
      <div className="me-n3">
        <OverlayTrigger
          placement="bottom"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip}
        >
          <button className="btn btn-sm btn-icon btn-transparent">
            {`${count}`}
          </button>
        </OverlayTrigger>
      </div>
    </div>
  );
};
