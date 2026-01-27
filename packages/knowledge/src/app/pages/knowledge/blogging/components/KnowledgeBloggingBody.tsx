import { FC, useEffect, useState } from "react";
import { KnowledgeBloggingTextArea } from "./KnowledgeBloggingTextArea";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import { fetchBlogs } from "../../../../features/blog/blogSlice";
import { KnowledgeBloggingCard } from "./KnowledgeBloggingCard";
import { Spinner } from "react-bootstrap";

const KnowledgeBloggingBody: FC = () => {
  const intl = useIntl();

  const [page, setPage] = useState(3);
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);

  const getBlogs = async () => {
    let pageSize = page;

    setLoading(true);
    await dispatch(fetchBlogs({ pageSize }) as any);
    setLoading(false);
  };

  useEffect(() => {
    getBlogs();
  }, [page]);

  const blogs = useSelector((state: RootState) => {
    return state?.blogs?.data?.blogs;
  });
  const TotalItems = useSelector((state: RootState) => {
    return state?.blogs?.data?.totalItems;
  });

  const showMoreHandler = () => {
    if (TotalItems - page < 4) {
      setPage(page + (TotalItems - page));
    } else setPage(page + 4);
  };

  return (
    <div>
      <div className="card card-custom card-stretch gutter-b">
        <div className="card-body">
          <KnowledgeBloggingTextArea />
        </div>
      </div>
      <div className="card card-custom card-stretch gutter-b mt-5">
        <div className="card-body">
          {!isLoading ? (
            blogs?.length ? (
              blogs?.map((blog) => (
                <KnowledgeBloggingCard key={blog.id} blog={blog} page={page} />
              ))
            ) : (
              <p className="text-center py-10">
                {intl.formatMessage({ id: "NoBlogs" })}
              </p>
            )
          ) : (
            <div className="d-flex gap-4 justify-content-center align-items-center py-4">
              {intl.formatMessage({ id: "LoadingData" })}
              <Spinner animation="border" variant="primary" />
            </div>
          )}
        </div>
      </div>
      {page < TotalItems ? (
        <div className="d-flex justify-content-center my-4 py-1">
          <div
            className="btn btn-outline-primary border border-primary text-hover-white"
            onClick={showMoreHandler}
          >
            {intl.formatMessage({ id: "MorePosts" })}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export { KnowledgeBloggingBody };
