import { FC, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useIntl } from "react-intl";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../../../../store/store";
import { fetchOrgs } from "../../../../features/users&departments/orgHierarchySlice";
import { KTSVG } from "@4eplatform/gateway/src/app/helpers";
import { getExpertsWithoutPagination } from "../../../../features/experts/expertsWithoutPaginationSlice";
import { showSuccessAlert } from "@4eplatform/shared/services/helper";

const EN_LANG = "en";

type PopupProps = {
  show: boolean;
  handleClose: any;
  employeeId?: any;
  setEmployeeId?: any;
  setEmployeeName?: any;
  id?: string | Number | number;
};

export const EmployeeHierarchyPopup: FC<PopupProps> = ({
  show,
  handleClose,
  employeeId,
  setEmployeeId,
  setEmployeeName,
  id,
}) => {
  const intl = useIntl();
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();

  const expertsUsersIds = useAppSelector((state) =>
    state?.expertsWithoutPagination?.data?.map((expert) => expert?.userId)
  );

  const managements = useAppSelector((state: RootState) => {
    return state?.orgHierarchy?.data || [];
  });

  const [collapsedItems, setCollapsedItems] = useState<{
    [key: string]: boolean;
  }>({});
  const [searchedManagements, setSearchedManagements] = useState<any>([]);

  useEffect(() => {
    let params: any = { search: searchTerm };
    dispatch(getExpertsWithoutPagination({}) as any).then(() => {
      dispatch(fetchOrgs(params) as any);
    });
  }, [dispatch, searchTerm]);

  useEffect(() => {
    const initialCollapsed: { [key: string]: boolean } = {};
    managements?.forEach((m: any) => {
      initialCollapsed[m.id] = true; // start collapsed
    });
    setCollapsedItems(initialCollapsed);
    setSearchedManagements(managements);
  }, [managements]);

  const toggleCollapse = (id: string) => {
    setCollapsedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  let selectedLang = localStorage.getItem("i18nConfig");
  try {
    selectedLang = JSON.parse(selectedLang as string).selectedLang;
  } catch (err) {}

  const handleRadioChange = (item: any) => {
    setEmployeeName(item?.userNmae);
    setEmployeeId(item?.userId);
  };

  useEffect(() => {
    let filteredManagements;
    if (searchTerm) {
      filteredManagements = managements
        ?.map((management: any) => {
          const filteredMembers = management?.mebmers?.filter((member: any) => {
            return (
              !expertsUsersIds?.includes(member?.userId) &&
              member?.userNmae
                ?.toLowerCase()
                .includes(searchTerm?.toLowerCase())
            );
          });
          if (filteredMembers?.length > 0) {
            return { ...management, mebmers: filteredMembers };
          }
          return null;
        })
        ?.filter(Boolean);
    } else {
      filteredManagements = managements;
    }
    setSearchedManagements(filteredManagements);
  }, [searchTerm, managements, expertsUsersIds]);

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <div className="card">
        <Modal.Header closeButton>
          <div className="card-header mt-10 d-flex justify-content-center w-100 px-4 border-bottom-0">
            <Modal.Title id="contained-modal-title-vcenter">
              <h3 className="card-title flex-column align-items-center">
                <span className="card-label fw-bolder fs-3 mb-2">
                  {intl.formatMessage({ id: "OrganizationalChart" })}
                </span>
                <span className="mt-1 fw-semibold fs-5 text-muted">
                  {intl.formatMessage({
                    id: "YouCanSeeTheEmployeesAndManagersInTheOrganization",
                  })}
                </span>
              </h3>
            </Modal.Title>
          </div>
        </Modal.Header>

        <Modal.Body>
          <div className="d-flex justify-content-center align-items-center">
            <form className="w-400px position-relative mb-5" autoComplete="off">
              <span className="svg-icon svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute top-50 ms-3 translate-middle-y">
                <KTSVG
                  path="/media/icons/duotune/general/gen114_search.svg"
                  className="pe-5"
                />
              </span>
              <input
                type="text"
                className="form-control form-control-solid px-15"
                name="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={intl.formatMessage({
                  id: "SearchWithEmployeeName",
                })}
              />
            </form>
          </div>

          <div className="row my-4">
            <div className="col-12">
              <div className="mb-2 pt-2 pb-3 custom_tree">
                {searchedManagements
                  ?.filter((org: any) => org?.mebmers?.length > 0)
                  ?.map((ele: any) => (
                    <div className="tree_main mb-5" key={ele.id}>
                      <ul className="tree list-unstyled">
                        <div className="fs-5 py-4 mb-7 d-flex align-items-center">
                          {ele?.mebmers?.length > 0 && (
                            <i
                              className={`fas fa-chevron-${
                                collapsedItems[ele.id]
                                  ? selectedLang === EN_LANG
                                    ? "right"
                                    : "left"
                                  : "down"
                              } fa-xl text-primary`}
                              onClick={() => toggleCollapse(ele.id)}
                              style={{ cursor: "pointer" }}
                            ></i>
                          )}

                          <div className="d-inline-block mx-3">
                            <i className="bi bi-diagram-3 mx-3 fs-1"></i>
                            <button
                              type="button"
                              className="basic-item bg-transparent border-0 title-text"
                              onClick={() => toggleCollapse(ele.id)}
                            >
                              {localStorage.getItem("i18nextLng") === "en"
                                ? ele?.nameEn
                                : ele?.nameAr}
                            </button>
                          </div>
                        </div>

                        {!collapsedItems[ele.id] && (
                          <ul className="list-unstyled px-8 mx-4">
                            {ele?.mebmers
                              ?.filter(
                                (employee: any) =>
                                  !expertsUsersIds?.includes(employee?.userId)
                              )
                              ?.map((child: any) => (
                                <li
                                  className="branch mb-3 d-flex gap-2 align-items-center"
                                  key={child?.userId}
                                >
                                  <div className="form-check form-check-success form-check-sm form-check-custom form-check-solid form-check-md">
                                    <input
                                      className="form-check-input widget-9-check xCheckBg mt-0"
                                      type="radio"
                                      name="employee"
                                      onChange={() => handleRadioChange(child)}
                                      id={child?.userId}
                                      checked={child?.userId == employeeId}
                                    />
                                  </div>
                                  <label htmlFor={child?.userId}>
                                    {child?.userNmae}
                                  </label>
                                </li>
                              ))}
                          </ul>
                        )}
                      </ul>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="justify-content-center pb-5 pt-3 border-top-0">
          <div className="mt-5 mb-5 col-12 col-lg-7 mx-auto">
            <div className="outputCard card-diff-toolbar w-100 mt-3 d-flex justify-content-center">
              <div className="d-flex justify-content-center align-items-center w-50">
                <div
                  onClick={handleClose}
                  className="btn btn-secondary mx-1 text-center w-100"
                >
                  {intl.formatMessage({ id: "Cancel" })}
                </div>
                <button
                  className="btn btn-success mx-1 text-center w-100"
                  style={{ border: "none" }}
                  type="button"
                  onClick={() => {
                    if (employeeId) {
                      handleClose();
                      showSuccessAlert(true, "AddedSuccessfully", intl);
                    } else {
                      showSuccessAlert(false, "EmployeeNotSelected", intl);
                    }
                  }}
                >
                  {intl.formatMessage({ id: "Add" })}
                </button>
              </div>
            </div>
          </div>
        </Modal.Footer>
      </div>
    </Modal>
  );
};
