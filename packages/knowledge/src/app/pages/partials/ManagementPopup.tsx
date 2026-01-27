import { FC, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useIntl } from "react-intl";
import { RootState, useAppDispatch, useAppSelector } from "../../store/store";
import { fetchOrgs } from "../../features/users&departments/orgHierarchySlice";
import { KTSVG } from "@4eplatform/gateway/src/app/helpers";

const EN_LANG = "en";
type PopupProps = {
  show: boolean;
  handleClose: any;
  employeeIds?: any;
  setEmployeeIds?: any;
  setEmployeeNames?: any;
  id?: string | Number | number;
};
export const ManagementPopup: FC<PopupProps> = ({
  show,
  handleClose,
  employeeIds,
  setEmployeeIds,
  setEmployeeNames,
  id,
}) => {
  const intl = useIntl();
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();
  const managements = useAppSelector((state: RootState) => {
    const items = state?.orgHierarchy?.data;
    if (items) {
      const modifiedManagements = items.map((item: any) => ({
        ...item,
        collapsed: true,
        checked: false,
        mebmers:item?.mebmers?.map((ele)=>{return {...ele,checked:false}})
      }));
      return modifiedManagements;
    }
    return items;
  });
  let [data,setData]=useState<any>([])
  useEffect(()=>{
     setData(managements)
  },[])
  useEffect(() => {
    let params: any = {
      search: searchTerm,
    };
    dispatch(fetchOrgs(params) as any);
  }, [dispatch]);

  const handleCollapse = (item: any, id: string): {} => ({
    "data-bs-toggle": "collapse",
    "data-bs-target": `#flush-main-tree${id}`,
    "aria-expanded": "true",
    "aria-controls": `flush-main-tree${id}`,
    onClick: () => {
      item.collapsed = !item.collapsed;
    },
  });
  let selectedLang = localStorage.getItem("i18nConfig");
  try {
    selectedLang = JSON.parse(selectedLang as string).selectedLang;
  } catch (err) {
    //console.log("Can't get selectedLang from localStorage");
  }

let handleParentChecked=(item: any, isChecked: boolean)=>{  
if(isChecked){
  setData(data?.map((ele)=>{
    if(ele?.id==item?.id){
      return {...ele,checked:true,mebmers:ele?.mebmers?.map((member)=>{return {...member,checked:true}})}
    }
    else {
      return ele
    }
  }))
}
else if (isChecked==false){
  setData(data?.map((ele)=>{
    if(ele?.id==item?.id){
      return {...ele,checked:false,mebmers:ele?.mebmers?.map((member)=>{return {...member,checked:false}})}
    }
    else {
      return ele
    }
  }))
}
}
  const handleChildrenChecked = (item: any, isChecked: boolean,parentId:string) => {
    if (isChecked) {
      setData(data?.map((ele)=>{
        if(ele?.id==parentId){
          return {...ele,checked:ele?.mebmers?.filter((member)=>{return member?.checked})?.length==ele?.mebmers?.length-1?true:false,mebmers:ele?.mebmers?.map((member)=>{
            if(member?.userId==item?.userId){
              return {...member,checked:true}
            }
            else {return member}
          })}
        }
        else {
          return ele
        }
      }))
    } else {
      setData(data?.map((ele)=>{
        if(ele?.id==parentId){
          return {...ele,checked:false,mebmers:ele?.mebmers?.map((member)=>{
            if(member?.userId==item?.userId){
              return {...member,checked:false}
            }
            else {
              return member
            }
          })}
        }
        else {
          return ele
        }
      }))
    }
  };
  useEffect(()=>{
  //  setEmployeeIds(data?.map((ele)=>{return ele?.mebmers})?.flat()?.filter((member)=>{return member?.checked})?.map((element)=>{return element?.userId}))
   setEmployeeNames(data?.filter((parent) => {
    return parent?.mebmers?.map((member)=>{return member?.checked})?.includes(true)
   } 
  )?.map((item)=>{return intl.locale=="ar"?item?.nameAr:item?.nameEn}))
   
  },[data])
  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg" centered>
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
                  value=""
                  placeholder={intl.formatMessage({
                    id: "SearchWithEmployeeName",
                  })}
                />
              </form>
            </div>
            <div className="row my-4">
              <div className="col-12">
                <div className="mb-2 pt-2 pb-3 custom_tree">
                  {data?.filter((org: any)=>{return org?.mebmers?.length>0})?.map((ele:any) => (
                    <div className="tree_main mb-5" key={ele.id}>
                      <ul id="tree1" className="tree list-unstyled">
                        <div className="fs-5 py-4 mb-7 d-flex align-items-center">
                          {ele?.mebmers?.length > 0 &&
                            (ele?.collapsed ? (
                              <i
                                className={`fas fa-chevron-${
                                  selectedLang === EN_LANG ? "right" : "left"
                                } fa-xl text-primary`}
                                {...handleCollapse(ele, ele.id)}
                              ></i>
                            ) : (
                              <i
                                className="fas fa-chevron-down fa-xl text-danger"
                                {...handleCollapse(ele, ele.id)}
                              ></i>
                            ))}

                          <div className=" d-inline mx-2 form-check form-check-success form-check-sm form-check-custom form-check-solid form-check-md"></div>
                          <div
                            className="d-inline-block"
                            {...handleCollapse(ele, ele.id)}
                          >
                            <i className="bi bi-diagram-3 mx-3 fs-1"></i>
                            <div className=" d-inline ms-2 form-check form-check-success form-check-sm form-check-custom form-check-solid form-check-md">
                              <input
                                className="form-check-input widget-9-check xCheckBg mt-0"
                                type="checkbox"
                                checked={ele?.checked}
                                onChange={(e) => {
                                  const isChecked = e.target.checked;
                                  // handleChildrenChecked(ele, isChecked);
                                  handleParentChecked(ele,isChecked)
                                }}
                              />
                            </div>
                            <button className="basic-item bg-transparent border-0 title-text">
                              {localStorage.getItem("i18nextLng") === "en"
                                ? ele?.nameEn
                                : ele?.nameAr}
                            </button>
                          </div>
                        </div>
                        {/* <div className="px-8 mx-4">
                          <li
                            className="basic-branch branch accordion-collapse show"
                            id={`flush-main-tree${ele?.id}`}
                            aria-labelledby={`flush-main-tree${ele?.id}`}
                            data-bs-parent={`#accordionFlushMainTree${ele?.id}`}
                          >
                            <ul className="list-unstyled">
                              {ele?.mebmers?.map((child:any) => (
                                <li className="branch mb-3" key={child?.userId}>
                                  <div className=" d-inline ms-2 form-check form-check-success form-check-sm form-check-custom form-check-solid form-check-md">
                                    <input
                                      className="form-check-input widget-9-check xCheckBg mt-0"
                                      type="checkbox"
                                      onChange={(e) => {
                                        const isChecked = e.target.checked;
                                        handleChildrenChecked(child, isChecked,ele?.id);
                                      }}
                                      id={child?.userId}
                                      // checked={
                                      //   employeeIds?.filter((id: string) => {
                                      //     return id == child?.userId;
                                      //   })?.length > 0
                                      // }
                                      checked={child?.checked}
                                    />
                                  </div>
                                  <label className="collapsed" htmlFor="2">
                                    {child?.userNmae}
                                  </label>
                                  <div className="my-8 px-8 mx-4">
                                    <ul
                                      className="list-unstyled accordion-collapse collapse"
                                      id={`flush-main-tree${ele?.id}${child?.userId}`}
                                      aria-labelledby={`flush-headingOne${ele?.id}${child?.userId}`}
                                      data-bs-parent={`#accordionFlushMainTree${ele?.id}${child?.userId}`}
                                    ></ul>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </li>
                        </div> */}
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
                    onClick={()=>{
                      setEmployeeIds(employeeIds);
                      handleClose()
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
    </>
  );
};
