import { FC, useEffect, useState, useMemo, useCallback } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { KTSVG } from "@4eplatform/gateway/src/app/helpers";
import { Modal } from "react-bootstrap";
import { OrgHierarchyModel } from "../../models/OrgHierarchyModel";
import { RootState } from "../../store/store";
import { fetchOrgs } from "../../features/users&departments/orgHierarchySlice";
import { showSuccessAlert } from "@4eplatform/shared/services/helper";

type PopupProps = {
  setOrgId?: any;
  show: boolean;
  orgId: string;
  handleClose: any;
  sendDataToParent?: any;
  orgName?: string;
  setOrgName?: any;
};

const EN_LANG = "en";

export const ManagementHierarchyPopup: FC<PopupProps> = ({
  show,
  handleClose,
  orgId,
  setOrgId,
  orgName,
  setOrgName,
}) => {
  const intl = useIntl();
  const [modifiedOrgs, setmodifiedOrgs] = useState<OrgHierarchyModel[] | any>();
  const [searchTerm, setSearchTerm] = useState("");
  let dispatch = useDispatch();
  let allOrgs = useSelector((state: RootState) => state?.orgHierarchy?.data);

  const selectedLang = useMemo(() => {
    let lang = localStorage.getItem("i18nConfig");
    try {
      return JSON.parse(lang as string).selectedLang;
    } catch (err) {
      return "en";
    }
  }, []);

  useEffect(() => {
    if (show) {
      dispatch(fetchOrgs({}) as any);
    }
  }, [dispatch, show]);

  useEffect(() => {
    const modifyOrgs = (orgs: OrgHierarchyModel[]): OrgHierarchyModel[] => {
      return orgs?.map((element) => ({
        ...element,
        collapsed: true,
        checked: false,
        children: modifyOrgs(element.children),
      }));
    };
    const modifiedOrgs = modifyOrgs(allOrgs);
    setmodifiedOrgs(modifiedOrgs);
  }, [allOrgs]);

  const handleChange = () => {
    setmodifiedOrgs([...modifiedOrgs]);
  };

  const handleChildrenChecked = (item: any, isChecked: boolean) => {
    item.checked = isChecked;
    item?.children?.forEach((child: any) => {
      child.checked = isChecked;
      if (child?.children?.length) {
        handleChildrenChecked(child, isChecked);
      }
    });
    handleChange();
  };

  const handleCollapse = (item: any, id: any): {} => ({
    "data-bs-toggle": "collapse",
    "data-bs-target": `#flush-main-tree${id}`,
    "aria-expanded": "true",
    "aria-controls": `flush-main-tree${id}`,
    onClick: () => {
      item.collapsed = !item.collapsed;
      handleChange();
    },
  });

  const handleRadioChange = (item: any) => {
    setOrgId(item?.id);
    setOrgName(item?.nameAr);
  };

  const filterOrgsBySearch = useCallback(
    (orgs: any[], term: string): any[] => {
      if (!term) return orgs;

      return orgs
        ?.map((org) => {
          const nameAr = org?.nameAr?.toLowerCase() || "";
          const nameEn = org?.nameEn?.toLowerCase() || "";
          const searchLower = term.toLowerCase();

          const matchesSearch =
            nameAr.includes(searchLower) || nameEn.includes(searchLower);

          const filteredChildren = org?.children
            ? filterOrgsBySearch(org.children, term)
            : [];

          if (matchesSearch || filteredChildren.length > 0) {
            return {
              ...org,
              collapsed: false,
              children: filteredChildren,
            };
          }

          return null;
        })
        .filter(Boolean);
    },
    []
  );

  const searchedOrgs = useMemo(() => {
    if (searchTerm === "") {
      return modifiedOrgs;
    }
    return filterOrgsBySearch(modifiedOrgs, searchTerm);
  }, [searchTerm, modifiedOrgs, filterOrgsBySearch]);

  const handleModalClose = useCallback(() => {
    setSearchTerm("");
    handleClose();
  }, [handleClose]);

  const renderNestedChildren = (children: any) => {
    return (
      <ul className="list-unstyled">
        {children?.map((child: any) => (
          <li className="branch mb-3" key={child?.id}>
            {searchTerm === "" && child?.children?.length > 0 && (
              child?.collapsed ? (
                <i
                  className={`fas fa-chevron-${
                    selectedLang === EN_LANG ? "right" : "left"
                  } fa-xl text-primary`}
                  {...(child?.children
                    ? handleCollapse(child, `${children?.id}${child?.id}`)
                    : {})}
                ></i>
              ) : (
                <i
                  className="fas fa-chevron-down fa-xl text-danger"
                  {...(child?.children
                    ? handleCollapse(child, `${children?.id}${child?.id}`)
                    : {})}
                ></i>
              )
            )}

            <div className=" d-inline ms-2 form-check form-check-success form-check-sm form-check-custom form-check-solid form-check-md">
              <input
                className="form-check-input widget-9-check xCheckBg"
                type="radio"
                name="item"
                id={child?.id}
                checked={child?.id === orgId}
                onChange={() => {
                  handleChildrenChecked(child, !child?.checked);
                  handleRadioChange(child);
                }}
              />
            </div>
            <label
              htmlFor={`${child?.id}`}
              className="collapsed"
              {...(searchTerm === "" && child?.children
                ? handleCollapse(child, `${children?.id}${child?.id}`)
                : {})}
            >
              {intl.locale === "ar" ? child?.nameAr : child?.nameEn}
            </label>
            {/* nested children - show if searching or not collapsed */}
            {(searchTerm !== "" || !child?.collapsed) &&
              child?.children?.length > 0 &&
              renderNestedChildren(child?.children)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <Modal centered show={show} onHide={handleModalClose} size="lg">
        <Modal.Header
          closeButton
          style={{
            alignItems: intl.locale == "ar" ? "flex-start" : "center",
            flexDirection: intl.locale == "en" ? "column-reverse" : "row",
          }}
        ></Modal.Header>

        <Modal.Body style={{ maxHeight: "500px", overflowY: "auto" }}>
          <div className="card">
            <div className="card-body">
              <div className="card-header px-1 d-flex justify-content-start  pb-2 mb-5">
                <h3 className="card-title flex-column">
                  <span className="card-label fw-bolder fs-3 mb-2 ">
                    {intl.formatMessage({
                      id: "OrganizationalStructure",
                    })}
                  </span>
                  <span className="mt-1 fw-semibold fs-5 text-muted">
                    {intl.formatMessage({
                      id: "PleaseEnterTheData",
                    })}
                  </span>
                </h3>
              </div>
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
                      id: "SearchWithManagementName",
                    })}
                  />
                </form>
              </div>
              <div className="row my-4">
                <div className="col-12">
                  <div className="mb-2 pt-2 pb-3 custom_tree">
                    {searchedOrgs?.map((item: any) => (
                      <div className="tree_main mb-5" key={item?.id}>
                        <ul id="tree1" className="tree list-unstyled">
                          <div className="fs-5 py-4 mb-7 d-flex align-items-center">
                            {searchTerm === "" && item?.children?.length > 0 &&
                              (item?.collapsed ? (
                                <i
                                  className={`fas fa-chevron-${
                                    selectedLang === EN_LANG ? "right" : "left"
                                  } fa-xl text-primary`}
                                  {...handleCollapse(item, item?.id)}
                                ></i>
                              ) : (
                                <i
                                  className="fas fa-chevron-down fa-xl text-danger"
                                  {...handleCollapse(item, item?.id)}
                                ></i>
                              ))}

                            <div className=" d-inline mx-2 form-check form-check-success form-check-sm form-check-custom form-check-solid form-check-md">
                              <input
                                className="form-check-input widget-9-check xCheckBg mt-0"
                                type="radio"
                                name="item"
                                onChange={() => {
                                  handleChildrenChecked(item, !item?.checked);
                                  handleRadioChange(item);
                                }}
                                id={item?.id}
                                checked={item?.id === orgId}
                              />
                            </div>
                            <div
                              className="d-inline-block"
                              {...(searchTerm === "" ? handleCollapse(item, item?.id) : {})}
                            >
                              <i className="bi bi-diagram-3 mx-3 fs-1"></i>
                              <button className="basic-item bg-transparent border-0">
                                {intl.locale === "ar"
                                  ? item?.nameAr
                                  : item?.nameEn}
                              </button>
                            </div>
                          </div>
                          {(searchTerm !== "" || !item?.collapsed) && (
                            <div className="px-8 mx-4">
                              <li
                                className="basic-branch branch accordion-collapse show"
                                id={`flush-main-tree${item?.id}`}
                                aria-labelledby={`flush-main-tree${item?.id}`}
                                data-bs-parent={`#accordionFlushMainTree${item?.id}`}
                              >
                                <ul className="list-unstyled">
                                  {item?.children?.map((child: any) => (
                                    <li className="branch mb-3" key={child?.id}>
                                      {searchTerm === "" && child?.children?.length > 0 &&
                                        (child?.collapsed ? (
                                          <i
                                            className={`fas fa-chevron-${
                                              selectedLang === EN_LANG
                                                ? "right"
                                                : "left"
                                            } fa-xl text-primary`}
                                            {...(child?.children
                                              ? handleCollapse(
                                                  child,
                                                  `${item?.id}${child?.id}`
                                                )
                                              : {})}
                                          ></i>
                                        ) : (
                                          <i
                                            className="fas fa-chevron-down fa-xl text-danger"
                                            {...(child?.children
                                              ? handleCollapse(
                                                  child,
                                                  `${item?.id}${child?.id}`
                                                )
                                              : {})}
                                          ></i>
                                        ))}
                                      <div className=" d-inline ms-2 form-check form-check-success form-check-sm form-check-custom form-check-solid form-check-md">
                                        <input
                                          className="form-check-input widget-9-check xCheckBg"
                                          type="radio"
                                          name="item"
                                          id={child?.id}
                                          checked={child?.id === orgId}
                                          onChange={() => {
                                            handleChildrenChecked(
                                              child,
                                              !child?.checked
                                            );
                                            handleRadioChange(child);
                                          }}
                                        />
                                      </div>
                                      <label
                                        htmlFor={`${child?.id}`}
                                        className="collapsed"
                                        {...(searchTerm === "" && child?.children
                                          ? handleCollapse(
                                              child,
                                              `${item?.id}${child?.id}`
                                            )
                                          : {})}
                                      >
                                        {intl.locale === "ar"
                                          ? child?.nameAr
                                          : child?.nameEn}
                                      </label>
                                      {(searchTerm !== "" || !child?.collapsed) &&
                                        child?.children?.length > 0 &&
                                        renderNestedChildren(child?.children)}
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
                        data-bs-dismiss="modal"
                        className="btn btn-success mx-1 text-center w-100"
                        style={{ border: "none" }}
                        type="submit"
                        onClick={(event) => {
                          event.preventDefault();
                          handleClose();
                          showSuccessAlert(
                            true,
                            "AddedSuccessfully",
                            intl,
                            () => {}
                          );
                        }}
                      >
                        {intl.formatMessage({ id: "Add" })}
                      </button>
                    </div>
                  </div>
                </div>
              </Modal.Footer>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};