import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import AddPostBlogPopup from "../popup/add-post-blog-popup";
import { toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";

const KnowledgeBloggingTextArea: FC = () => {
  const intl = useIntl();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const checkUndefinedName = (name: any) => {
    if (
      name == "undefined" ||
      name == "null" ||
      name == undefined ||
      name == null
    ) {
      return "";
    } else {
      return name;
    }
  };

  const [userData, setUserData] = useState({
    firstName: "",
    secondName: "",
    thirdName: "",
    fourthName: "",
  });

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("userInfo") as string);
    setUserData({
      firstName: checkUndefinedName(user?.firstName),
      secondName: checkUndefinedName(user?.secondName),
      thirdName: checkUndefinedName(user?.thirdName),
      fourthName: checkUndefinedName(user?.fourthName),
    });
  }, []);
  return (
    <div className="d-flex flex-column w-100">
      <div className="d-flex justify-content-start align-items-center mb-3">
        <div className="w-50px h-50px">
          <img
            src={
              JSON.parse(localStorage.getItem("userInfo") as string)?.imageUrl
                ? (window as any)._env_?.REACT_APP_API_User_Url +
                  "/" +
                  JSON.parse(localStorage.getItem("userInfo") as string)
                    .imageUrl
                : toAbsoluteUrl("/media/avatars/300-3.jpg")
            }
            onError={(e: any) =>
              (e.target.src = toAbsoluteUrl("/media/avatars/300-3.jpg"))
            }
            className="w-100"
            alt=""
          />
        </div>
        <div className="mx-2 px-1">
          {`${userData.firstName} ${userData.secondName} ${checkUndefinedName(
            userData.thirdName
          )} ${userData.fourthName}`.trim()}{" "}
        </div>
      </div>
      <div className="cursor-pointer">
        <div className="pb-3 mb-2 border-bottom ">
          <div
            className="w-100 myform-control form-control-solid h-50px d-flex justify-content-start align-items-center"
            onClick={handleShow}
          >
            <p className="text-gray-700 mb-0 fs-6 ">
              {intl.formatMessage({ id: "WhatOnYourMind" })}
            </p>
          </div>
        </div>
      </div>
      <div className="modal fade" id="rega_modal_blog_post" aria-hidden="true">
        <AddPostBlogPopup handleClose={handleClose} show={show} />
      </div>
    </div>
  );
};

export { KnowledgeBloggingTextArea };
