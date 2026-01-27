import { FC } from "react";
import { RiFilter2Fill } from "react-icons/ri";
import { useIntl } from "react-intl";

const FilterDropdown: FC = () => {
  const intl = useIntl();

  return (
    <>
      <a onClick={(event) => { event.preventDefault() }} className="btn btn-custom btn-active-white btn-flex btn-color-white btn-active-color-primary fw-bolder" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
        <RiFilter2Fill size={17} data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end"/>
        {intl.formatMessage({ id: "Filtering" })}
      </a>

      <div
        className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-success w-250px fw-bold fs-7 py-4 "
        data-kt-menu="true"
      >
        <div className="menu-item d-flex justify-content-between align-items-center px-2 mb-2 ">
          <label htmlFor="myQ" className="text-gray-500 fw-normal">
            {intl.formatMessage({ id: "MyQuestions" })}
          </label>
          <div className="form-check form-check-success form-check-sm form-check-custom form-check-solid">
            <input
              className="form-check-input widget-9-check xCheckBg"
              type="checkbox"
              name="myQ"
              id="myQ"
            />
          </div>
        </div>
        <div className="menu-item d-flex justify-content-between align-items-center px-2 mb-2">
          <label htmlFor="allQ" className="text-gray-500 fw-normal">
            {intl.formatMessage({ id: "NewQuestions" })}
          </label>
          <div className="form-check form-check-success form-check-sm form-check-custom form-check-solid">
            <input
              className="form-check-input widget-9-check xCheckBg"
              type="checkbox"
              name="allQ"
              id="newQ"
            />
          </div>
        </div>
        <div className="menu-item d-flex justify-content-between align-items-center px-2 mb-2">
          <label htmlFor="allQ" className="text-gray-500 fw-normal">
            {intl.formatMessage({ id: "UnansweredQuestions" })}
          </label>
          <div className="form-check form-check-success form-check-sm form-check-custom form-check-solid">
            <input
              className="form-check-input widget-9-check xCheckBg"
              type="checkbox"
              name="allQ"
              id="unansweredQ"
            />
          </div>
        </div>
        <div className="menu-item d-flex justify-content-between align-items-center px-2 mb-2">
          <label htmlFor="allQ" className="text-gray-500 fw-normal">
            {intl.formatMessage({ id: "All" })}
          </label>
          <div className="form-check form-check-success form-check-sm form-check-custom form-check-solid">
            <input
              className="form-check-input widget-9-check xCheckBg"
              type="checkbox"
              name="allQ"
              id="allQ"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export { FilterDropdown };
