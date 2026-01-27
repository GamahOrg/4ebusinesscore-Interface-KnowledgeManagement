import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import AddComment from "../popup/add-comment";
import { RootState, useAppDispatch } from "../../../../store/store";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { KnowledgeBlogComment } from "./KnowledgeBlogComment";
import { fetchBlogComments } from "../../../../features/comments/commentSlice";
import { Spinner } from "react-bootstrap";

const BlogComments: FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const [pageSize, setPageSize] = useState(10);

  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { id: blog_id } = useParams();

  const getBlogComments = async (id: string) => {
    setIsLoading(true);

    let params = `${id}?pageSize=${pageSize}`;
    await dispatch(fetchBlogComments(params) as any);

    setIsLoading(false);
  };
  useEffect(() => {
    if (blog_id) {
      getBlogComments(blog_id);
    }
  }, [blog_id, pageSize]);

  const comments = useSelector((state: RootState) => {
    return state?.comments?.data?.comments;
  });
  const TotalItems = useSelector((state: RootState) => {
    return state?.comments?.data?.totalItems;
  });

  const showMoreHandler = () => {
    if (TotalItems - pageSize < 4) {
      setPageSize(pageSize + (TotalItems - pageSize));
    } else setPageSize(pageSize + 4);
  };

  return (
    <>
      {!isLoading ? (
        comments?.map((comment) => {
          return (
            <KnowledgeBlogComment
              key={comment?.id}
              comment={comment}
              page={pageSize}
            />
          );
        })
      ) : (
        <div className="d-flex gap-4 justify-content-center align-items-center py-4">
          {intl.formatMessage({ id: "LoadingData" })}
          <Spinner animation="border" variant="primary" />
        </div>
      )}
      <div className="d-flex">
        <div className="d-flex flex-column">
          {pageSize < TotalItems ? (
            <div
              className="btn btn-outline-danger mb-2 text-hover-white"
              onClick={showMoreHandler}
            >
              {intl.formatMessage({ id: "MoreComments" })}
            </div>
          ) : (
            ""
          )}
          <div
            className="btn btn-outline-primary text-hover-white"
            onClick={handleShow}
          >
            {intl.formatMessage({ id: "AddComment" })}...
          </div>
        </div>
      </div>
      <div className="modal fade" id="Rega_modal_Delete" aria-hidden="true">
        <AddComment
          handleClose={handleClose}
          show={show}
          id={blog_id}
          page={pageSize}
        />
      </div>
    </>
  );
};
export { BlogComments };
