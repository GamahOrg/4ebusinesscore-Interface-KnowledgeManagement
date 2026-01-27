import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { KTSVG, toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";
import { DeletePopup } from "../../../partials/DeletePopup";

const KnowledgeBlogDetailsAdmin: FC = () => {
  const intl = useIntl();
  const [showDelete, setShowDelete] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);

  return (
    <div className="card card-custom card-stretch gutter-b">
      <div className="card-body">
        <div className="d-flex justify-content-start">
          <div className="card-header p-4 d-flex flex-column w-100 border-0 mb-4 mb-md-5">
            <div className="d-flex justify-content-between ">
              <div className="d-flex justify-content-start align-items-center w-200px mb-3">
                <div className="w-50px h-50px">
                  <img
                    src={toAbsoluteUrl("/media/avatars/300-3.jpg")}
                    className="w-100 rounded-3"
                    alt="profile"
                  />
                </div>
                <div className="mx-2 px-1 d-flex flex-column">
                  <div className="mb-1">سعودي الشهري</div>
                  <div className="text-gray-700">امس في 5:06 PM</div>
                </div>
              </div>
            </div>
            <div className="mt-2 w-100 border-bottom border-1 pb-2 mb-3">
              <div className="py-1">
                <div>
                  <h5 className="text-primary">
                    الرياض تقوم بتطوير منظومة العمل عن بعد للموظفين الحكوميين
                  </h5>
                </div>
                <div className="pt-2">
                  <p className="text-gray-700 mb-2">
                    لوريم إيبسوم(Lorem Ipsum) هو ببساطة نص شكلي (بمعنى أن الغاية
                    هي الشكل وليس المحتوى) ويُستخدم في صناعات المطابع ودور
                    النشر. كان لوريم إيبسوم ولايزال المعيار للنص الشكلي منذ
                    القرن الخامس عشر عندما قامت مطبعة مجهولة برص مجموعة من
                    الأحرف بشكل عشوائي أخذتها من نص، لتكوّن كتيّب بمثابة دليل أو
                    مرجع شكلي لهذه الأحرف. خمسة قرون من الزمن لم تقضي على هذا
                    النص، بل انه حتى صار مستخدماً وبشكله الأصلي في الطباعة
                    والتنضيد الإلكتروني.
                  </p>
                </div>
                <div className="py-2">
                  <img
                    src={`/media/news/topic.jpg`}
                    style={{ width: "100%", maxHeight: "500px" }}
                    alt="Attachment"
                  />
                </div>
              </div>
            </div>
            <div>
              <div
                id="blog-comment"
                className="d-flex justify-content-start flex-grow-1 align-items-top mb-2 py-3 py-md-1 border-bottom"
              >
                <div className="w-50px h-50px flex-shrink-0">
                  <img
                    src={toAbsoluteUrl("/media/avatars/300-3.jpg")}
                    className="w-100 rounded-3"
                    alt="profile"
                  />
                </div>
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                  <div className="mb-2 mx-2 px-2 w-100">
                    <div className="d-flex flex-column w-100">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center flex-column flex-sm-row">
                          <div>سعودي الشهري</div>
                          <span className="text-gray-700 mx-3">
                            امس في 5:06 PM
                          </span>
                        </div>
                      </div>
                      <div className="text-gray-700 py-1 py-md-0 my-1">
                        لوريم إيبسوم(Lorem Ipsum) هو ببساطة نص شكلي (بمعنى أن
                        الغاية هي الشكل وليس المحتوى) ويُستخدم في صناعات المطابع
                        ودور النشر. كان لوريم إيبسوم ولايزال المعيار للنص الشكلي
                        منذ القرن الخامس عشر عندما قامت مطبعة مجهولة برص مجموعة
                        من الأحرف بشكل عشوائي أخذتها من نص، لتكوّن كتيّب بمثابة
                        دليل أو مرجع شكلي لهذه الأحرف. خمسة قرون من الزمن لم
                        تقضي على هذا النص، بل انه حتى صار مستخدماً وبشكله الأصلي
                        في الطباعة والتنضيد الإلكتروني.
                      </div>
                      <div className="d-flex mt-2">
                        z
                        <div className="btn mx-1 bg-light">
                          <i className="fa-regular fa-thumbs-up mx-1 fs-3 fa-fw"></i>{" "}
                          20
                        </div>
                        <div className="btn mx-1 bg-light">
                          <i className="fa-regular fa-thumbs-down mx-1 fs-3 fa-fw"></i>{" "}
                          5
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex flex-column justify-content-between align-items-start align-items-md-end flex-grow-1 flex-shrink-0">
                    <div className="btn btn-outline-secondary text-gray-700 mb-md-1 flex-shrink-0">
                      {intl.formatMessage({ id: "AddReply" })}
                    </div>
                    <div
                      onClick={handleShowDelete}
                      className="btn btn-outline-danger border border-1 border-danger mt-md-2 mx-2 mx-md-0 flex-shrink-0 d-flex align-items-center"
                    >
                      {intl.formatMessage({ id: "DeleteComment" })}
                      <span className="svg-icon svg-icon-3 mx-0">
                        <KTSVG path="/media/icons/duotune/general/gen088.svg" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 mt-3 pt-2">
                <div
                  id="blog-reply"
                  className="py-3 py-md-1 mb-3 border-bottom"
                >
                  <div className="d-flex justify-content-start flex-grow-1 align-items-top mb-3">
                    <div className="w-50px h-50px flex-shrink-0">
                      <img
                        src={toAbsoluteUrl("/media/avatars/300-3.jpg")}
                        className="w-100 rounded-3"
                        alt="profile"
                      />
                    </div>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                      <div className="mb-2 mx-2 px-2 w-100">
                        <div className="d-flex flex-column w-100">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="d-flex align-items-center flex-column flex-sm-row">
                              <div>سعودي الشهري</div>
                              <span className="text-gray-700 mx-3">
                                امس في 5:06 PM
                              </span>
                            </div>
                          </div>
                          <div className="text-gray-700 py-1 py-md-0 my-1">
                            لوريم إيبسوم(Lorem Ipsum) هو ببساطة نص شكلي (بمعنى
                            أن الغاية هي الشكل وليس المحتوى) ويُستخدم في صناعات
                            المطابع ودور النشر. كان لوريم إيبسوم ولايزال المعيار
                            للنص الشكلي منذ القرن الخامس عشر عندما قامت مطبعة
                            مجهولة برص مجموعة من الأحرف بشكل عشوائي أخذتها من
                            نص، لتكوّن كتيّب بمثابة دليل أو مرجع شكلي لهذه
                            الأحرف. خمسة قرون من الزمن لم تقضي على هذا النص، بل
                            انه حتى صار مستخدماً وبشكله الأصلي في الطباعة
                            والتنضيد الإلكتروني.
                          </div>
                          <div className="d-flex mt-2">
                            <div className="btn mx-1 bg-light">
                              <i className="fa-regular fa-thumbs-up mx-1 fs-3 fa-fw"></i>{" "}
                              20
                            </div>
                            <div className="btn mx-1 bg-light">
                              <i className="fa-regular fa-thumbs-down mx-1 fs-3 fa-fw"></i>{" "}
                              5
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex flex-column justify-content-between align-items-start align-items-md-end flex-grow-1 flex-shrink-0">
                        <div className="btn btn-outline-secondary text-gray-700 mb-md-1 flex-shrink-0">
                          {intl.formatMessage({ id: "AddReply" })}
                        </div>
                        <div
                          onClick={handleShowDelete}
                          className="btn btn-outline-danger border border-1 border-danger mt-md-2 mx-2 mx-md-0 flex-shrink-0 d-flex align-items-center"
                        >
                          {intl.formatMessage({ id: "DeleteComment" })}
                          <span className="svg-icon svg-icon-3 mx-0">
                            <KTSVG path="/media/icons/duotune/general/gen088.svg" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  id="blog-reply"
                  className="py-3 py-md-1 mb-3 border-bottom"
                >
                  <div className="d-flex justify-content-start flex-grow-1 align-items-top mb-3">
                    <div className="w-50px h-50px flex-shrink-0">
                      <img
                        src={toAbsoluteUrl("/media/avatars/300-3.jpg")}
                        className="w-100 rounded-3"
                        alt="profile"
                      />
                    </div>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                      <div className="mb-2 mx-2 px-2 w-100">
                        <div className="d-flex flex-column w-100">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="d-flex align-items-center flex-column flex-sm-row">
                              <div>سعودي الشهري</div>
                              <span className="text-gray-700 mx-3">
                                امس في 5:06 PM
                              </span>
                            </div>
                          </div>
                          <div className="text-gray-700 py-1 py-md-0 my-1">
                            لوريم إيبسوم(Lorem Ipsum) هو ببساطة نص شكلي (بمعنى
                            أن الغاية هي الشكل وليس المحتوى) ويُستخدم في صناعات
                            المطابع ودور النشر. كان لوريم إيبسوم ولايزال المعيار
                            للنص الشكلي منذ القرن الخامس عشر عندما قامت مطبعة
                            مجهولة برص مجموعة من الأحرف بشكل عشوائي أخذتها من
                            نص، لتكوّن كتيّب بمثابة دليل أو مرجع شكلي لهذه
                            الأحرف. خمسة قرون من الزمن لم تقضي على هذا النص، بل
                            انه حتى صار مستخدماً وبشكله الأصلي في الطباعة
                            والتنضيد الإلكتروني.
                          </div>
                          <div className="d-flex mt-2">
                            <div className="btn mx-1 bg-light">
                              <i className="fa-regular fa-thumbs-up mx-1 fs-3 fa-fw"></i>{" "}
                              20
                            </div>
                            <div className="btn mx-1 bg-light">
                              <i className="fa-regular fa-thumbs-down mx-1 fs-3 fa-fw"></i>{" "}
                              5
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex flex-column justify-content-between align-items-start align-items-md-end flex-grow-1 flex-shrink-0">
                        <div className="btn btn-outline-secondary text-gray-700 mb-md-1 flex-shrink-0">
                          {intl.formatMessage({ id: "AddReply" })}
                        </div>
                        <div
                          onClick={handleShowDelete}
                          className="btn btn-outline-danger border border-1 border-danger mt-md-2 mx-2 mx-md-0 flex-shrink-0 d-flex align-items-center"
                        >
                          {intl.formatMessage({ id: "DeleteComment" })}
                          <span className="svg-icon svg-icon-3 mx-0">
                            <KTSVG path="/media/icons/duotune/general/gen088.svg" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex">
              <div className="d-flex flex-column">
                <div className="btn btn-outline-danger mb-2">
                  {intl.formatMessage({ id: "MoreComments" })}
                </div>
                <div className="btn btn-outline-primary">
                  {intl.formatMessage({ id: "AddReply" })}...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" aria-hidden="true">
        <DeletePopup
          handleCloseDelete={handleCloseDelete}
          showDelete={showDelete}
        />
      </div>
    </div>
  );
};
export { KnowledgeBlogDetailsAdmin };
