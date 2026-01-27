import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { Dropdown, ButtonGroup } from "react-bootstrap";
import EditExpertFrontExperience from "../popup/edit-expert-front-experience-popup";
import { DeleteExpertExperienceFrontPopup } from "../popup/delete-expert-experience-front";

type ActionProps = {
  id: Number | string;
  setExperienceData?:any;
  experienceData?:any

};

export const FrontExperienceActions: FC<ActionProps> = ({ id ,setExperienceData,experienceData}) => {
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
        <DeleteExpertExperienceFrontPopup
          handleCloseDelete={handleCloseDelete}
          showDelete={showDelete}
          setExperienceData={setExperienceData}
          id={id as string}
        />
      </div>
      <div
        className="modal fade"
        id="EditExperiencePopup"
        tabIndex={-1}
        aria-hidden="true"
      >
        <EditExpertFrontExperience experienceData={experienceData} setExperienceData={setExperienceData} handleClose={handleClose} show={show} id={id as string}/>
      </div>
    </>
  );
};
