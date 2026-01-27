import { FC, useState } from "react";
import { useIntl } from "react-intl";
import EditExperience from "../popup/edit-expert-experience-popup";
import { Dropdown, ButtonGroup } from "react-bootstrap";
import { DeleteExpertExperiencePopup } from "../popup/delete-experience-popup";
import { ExperienceModel } from "../../../../models/experienceModel";

type ActionProps = {
  id: Number | string;
  expertId?:string;
  experience?:ExperienceModel
};

export const Actions: FC<ActionProps> = ({ id,expertId,experience }) => {
  const intl = useIntl();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showDelete, setShowDelete] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);
  return (
    <>
      <Dropdown as={ButtonGroup}>
        <Dropdown.Toggle
          split
          variant="none"
          className=" p-0 text-center"
          id="dropdown-custom-2"
        >
          <i className="bi bi-three-dots fs-2" style={{ color: "#7e8299" }}></i>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={handleShow} className="text-primary">
            <span className="svg-icon svg-icon-3 mx-2">
            </span>{" "}
            {intl.formatMessage({ id: "Edit" })}
          </Dropdown.Item>

          <Dropdown.Item onClick={handleShowDelete} className="text-danger">
            <span className="svg-icon svg-icon-3 mx-2">
            </span>{" "}
            {intl.formatMessage({ id: "Delete" })}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <div className="modal fade" aria-hidden="true">
        <DeleteExpertExperiencePopup
          handleCloseDelete={handleCloseDelete}
          showDelete={showDelete}
          id={id as string}
          expertId={expertId}
        />
      </div>
      <div
        className="modal fade"
        id="EditExperiencePopup"
        tabIndex={-1}
        aria-hidden="true"
      >
        <EditExperience experience={experience} expertId={expertId} handleClose={handleClose} show={show} id={id as string}/>
      </div>
    </>
  );
};
