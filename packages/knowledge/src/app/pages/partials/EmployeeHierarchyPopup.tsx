import { FC, useEffect, useState, useMemo, useCallback } from "react";
import { Modal } from "react-bootstrap";
import { useIntl } from "react-intl";
import { RootState, useAppDispatch, useAppSelector } from "../../store/store";
import { KTSVG } from "@4eplatform/gateway/src/app/helpers";
import { fetchOrgs } from "../../features/users&departments/orgHierarchySlice";

const EN_LANG = "en";

type PopupProps = {
  show: boolean;
  handleClose: any;
  employeeIds?: any;
  setEmployeeIds?: any;
  setEmployeeNames?: any;
  setOrgNames?: any;
  id?: string | Number | number;
  setOrgIds?: any;
  orgIds?: any;
};

export const EmployeeHierarchyPopup: FC<PopupProps> = ({
  show,
  handleClose,
  employeeIds,
  setEmployeeIds,
  setEmployeeNames,
  id,
  setOrgIds,
  setOrgNames,
  orgIds,
}) => {
  const intl = useIntl();
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();
  const [data, setData] = useState<any>([]);

  const managementsItems = useAppSelector((state: RootState) => {
    return state?.orgHierarchy?.data;
  });

  // Memoize selectedLang to prevent unnecessary re-renders
  const selectedLang = useMemo(() => {
    let lang = localStorage.getItem("i18nConfig");
    try {
      return JSON.parse(lang as string).selectedLang;
    } catch (err) {
      return "en"; // default fallback
    }
  }, []);

  // Fetch data only once when component mounts
  useEffect(() => {
    if (show) {
      const params = { search: searchTerm };
      dispatch(fetchOrgs(params) as any);
    }
  }, [dispatch, show]); // Remove searchTerm from dependencies to prevent refetching on every search

  // Initialize data when managementsItems changes
  useEffect(() => {
    if (managementsItems) {
      const modifiedManagements = managementsItems.map((item: any) => ({
        ...item,
        collapsed: true,
        checked: orgIds ? orgIds.includes(item?.id) : false,
        mebmers: item?.mebmers?.map((ele: any) => ({
          ...ele,
          checked: employeeIds ? employeeIds.includes(ele?.userId) : false,
        })),
      }));

      setData(modifiedManagements);
    }
  }, [managementsItems]); // Remove orgIds and employeeIds from dependencies

  // Memoize handlers to prevent unnecessary re-renders
  const handleCollapse = useCallback((item: any, id: any) => {
    setData((prevData: any) =>
      prevData?.map((ele: any) => {
        if (ele?.id === id) {
          return { ...ele, collapsed: !ele?.collapsed };
        }
        return ele;
      })
    );
  }, []);

  const handleParentChecked = useCallback((item: any, isChecked: boolean) => {
    setData((prevData: any) =>
      prevData?.map((ele: any) => {
        if (ele?.id === item?.id) {
          return {
            ...ele,
            checked: isChecked,
            mebmers: ele?.mebmers?.map((member: any) => ({
              ...member,
              checked: isChecked,
            })),
          };
        }
        return ele;
      })
    );
  }, []);

  const handleChildrenChecked = useCallback(
    (item: any, isChecked: boolean, parentId: string) => {
      setData((prevData: any) =>
        prevData?.map((ele: any) => {
          if (ele?.id === parentId) {
            const updatedMembers = ele?.mebmers?.map((member: any) => {
              if (member?.userId === item?.userId) {
                return { ...member, checked: isChecked };
              }
              return member;
            });

            const checkedMembersCount = updatedMembers?.filter(
              (member: any) => member?.checked
            ).length;

            return {
              ...ele,
              checked: checkedMembersCount === updatedMembers?.length,
              mebmers: updatedMembers,
            };
          }
          return ele;
        })
      );
    },
    []
  );

  // Memoize filtered search results to prevent unnecessary calculations
  const searchedMangments = useMemo(() => {
    if (searchTerm === "") {
      return data;
    }
    return data?.map((ele: any) => ({
      ...ele,
      collapsed: true,
      mebmers: ele?.mebmers?.filter((member: any) =>
        member?.userNmae?.toLowerCase().includes(searchTerm?.toLowerCase())
      ),
    }));
  }, [searchTerm, data]);

  // Memoize derived values to prevent infinite loops
  const selectedOrgIds = useMemo(() => {
    return data
      ?.filter((item: any) => {
        return (
          item?.checked || item?.mebmers?.some((member: any) => member?.checked)
        );
      })
      ?.map((element: any) => element?.id);
  }, [data]);

  const selectedEmployeeIds = useMemo(() => {
    return data
      ?.flatMap((ele: any) => ele?.mebmers || [])
      ?.filter((member: any) => member?.checked)
      ?.map((element: any) => element?.userId);
  }, [data]);

  const selectedOrgNames = useMemo(() => {
    if (!orgIds) return [];
    return data
      .filter((ele: any) => orgIds?.includes(ele.id))
      ?.map((ele: any) => ({
        nameAr: ele.nameAr,
        nameEn: ele.nameEn,
      }));
  }, [data, orgIds]);

  const selectedEmployeeNames = useMemo(() => {
    return data
      ?.flatMap((ele: any) => ele?.mebmers || [])
      ?.filter((member: any) => member?.checked)
      ?.map((element: any) => element?.userNmae);
  }, [data]);

  // Update parent component state only when values actually change
  useEffect(() => {
    if (
      setOrgIds &&
      JSON.stringify(selectedOrgIds) !== JSON.stringify(orgIds)
    ) {
      setOrgIds(selectedOrgIds);
    }
  }, [selectedOrgIds, setOrgIds]); // Remove orgIds from dependencies

  useEffect(() => {
    if (
      setEmployeeIds &&
      JSON.stringify(selectedEmployeeIds) !== JSON.stringify(employeeIds)
    ) {
      setEmployeeIds(selectedEmployeeIds);
    }
  }, [selectedEmployeeIds, setEmployeeIds]); // Remove employeeIds from dependencies

  useEffect(() => {
    if (setOrgNames && selectedOrgNames.length > 0) {
      setOrgNames(selectedOrgNames);
    }
  }, [selectedOrgNames, setOrgNames]);

  useEffect(() => {
    if (setEmployeeNames && selectedEmployeeNames.length > 0) {
      setEmployeeNames(selectedEmployeeNames);
    }
  }, [selectedEmployeeNames, setEmployeeNames]);

  const handleModalClose = useCallback(() => {
    setSearchTerm("");
    handleClose();
  }, [handleClose]);

  const handleSubmit = useCallback(() => {
    // No need to call setEmployeeIds here as it's already updated via useEffect
    handleClose();
  }, [handleClose]);

  return (
    <>
      <Modal show={show} onHide={handleModalClose} size="lg" centered>
        <div className="card">
          <Modal.Header
            closeButton
            style={{
              alignItems: intl.locale == "ar" ? "flex-start" : "center",
              flexDirection: intl.locale == "en" ? "column-reverse" : "row",
            }}
            className="pb-0 border-bottom-0"
          >
            <div className="card-header mt-10 d-flex justify-content-center w-100 px-4 border-bottom-0">
              <Modal.Title id="contained-modal-title-vcenter">
                <h3 className="card-title flex-column align-items-center">
                  <span className="card-label fw-bolder fs-3 mb-2 d-flex justify-content-center w-100">
                    {intl.formatMessage({
                      id: "OrganizationalChart",
                    })}
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

          <Modal.Body className="pb-0 mx-4">
            <div className="d-flex justify-content-center align-items-center">
              <form
                className="w-400px position-relative mb-5"
                autoComplete="off"
              >
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
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                  placeholder={intl.formatMessage({
                    id: "SearchWithEmployeeName",
                  })}
                />
              </form>
            </div>
            <div className="row my-4">
              <div className="col-12">
                <div className="mb-2 pt-2 pb-3 custom_tree">
                  {searchedMangments
                    ?.filter((org: any) => org?.mebmers?.length > 0)
                    ?.map((ele: any) => (
                      <div className="tree_main mb-5" key={ele.id}>
                        <ul id="tree1" className="tree list-unstyled">
                          <div className="fs-5 py-4 mb-7 d-flex align-items-center">
                            {/* Conditional rendering for search vs normal view */}
                            {searchTerm === "" && ele?.mebmers?.length > 0 && (
                              <i
                                className={`fas fa-chevron-${
                                  ele?.collapsed
                                    ? selectedLang === EN_LANG
                                      ? "right"
                                      : "left"
                                    : "down"
                                } fa-xl ${
                                  ele?.collapsed
                                    ? "text-primary"
                                    : "text-danger"
                                }`}
                                onClick={() => handleCollapse(ele, ele.id)}
                              />
                            )}

                            <div className="d-inline mx-2 form-check form-check-success form-check-sm form-check-custom form-check-solid form-check-md"></div>
                            <div
                              className="d-inline-block"
                              onClick={() =>
                                searchTerm === "" && handleCollapse(ele, ele.id)
                              }
                            >
                              <i className="bi bi-diagram-3 mx-3 fs-1"></i>
                              {searchTerm === "" && (
                                <div className="d-inline ms-2 form-check form-check-success form-check-sm form-check-custom form-check-solid form-check-md">
                                  <input
                                    className="form-check-input widget-9-check xCheckBg mt-0"
                                    type="checkbox"
                                    checked={ele?.checked}
                                    onChange={(e) =>
                                      handleParentChecked(ele, e.target.checked)
                                    }
                                  />
                                </div>
                              )}
                              <button className="basic-item bg-transparent border-0 title-text">
                                {intl.locale === "en"
                                  ? ele?.nameEn
                                  : ele?.nameAr}
                              </button>
                            </div>
                          </div>

                          {/* Show members if not collapsed or if searching */}
                          {(searchTerm !== "" || !ele?.collapsed) && (
                            <div className="px-8 mx-4">
                              <li className="basic-branch branch accordion-collapse show">
                                <ul className="list-unstyled">
                                  {ele?.mebmers?.map((child: any) => (
                                    <li
                                      className="branch mb-3"
                                      key={child?.userId}
                                    >
                                      <div className="d-inline ms-2 form-check form-check-success form-check-sm form-check-custom form-check-solid form-check-md">
                                        <input
                                          className="form-check-input widget-9-check xCheckBg mt-0"
                                          type="checkbox"
                                          onChange={(e) =>
                                            handleChildrenChecked(
                                              child,
                                              e.target.checked,
                                              ele?.id
                                            )
                                          }
                                          id={child?.userId}
                                          checked={child?.checked}
                                        />
                                      </div>
                                      <label
                                        className="collapsed"
                                        htmlFor={child?.userId}
                                      >
                                        {child?.userNmae}
                                      </label>
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            </div>
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
                    onClick={handleModalClose}
                    className="btn btn-secondary mx-1 text-center w-100"
                  >
                    {intl.formatMessage({ id: "Cancel" })}
                  </div>
                  <button
                    className="btn btn-success mx-1 text-center w-100"
                    style={{ border: "none" }}
                    onClick={handleSubmit}
                  >
                    {intl.formatMessage({ id: "Add" })}
                  </button>
                </div>
              </div>
            </div>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};
