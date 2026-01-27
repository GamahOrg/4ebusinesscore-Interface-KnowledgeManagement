import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseModel } from "../../models/responseModel";
import { RequestStatus } from "../../enums/enums";
import { BlogComment, CommentResponse } from "../../models/BlogComment";
import { KnowledgeAggConsume } from "@4eplatform/shared/apis/knowledge_agg";
import { BlogConsume } from "@4eplatform/shared/apis/blog";
interface CommentState {
  data: CommentResponse;
  status: RequestStatus;
  error: string | null;
}

const initialState: CommentState = {
  data: new CommentResponse(),
  status: RequestStatus.idle,
  error: "",
};

export const fetchComments = createAsyncThunk<ResponseModel, any>(
  "comments/fetchComments",
  async (params, thunkApi) => {
    try {
      const response = await KnowledgeAggConsume.getBlogComments(params);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const addComment = createAsyncThunk<ResponseModel, any>(
  "comments/addComment",
  async (newComment, thunkApi) => {
    try {
      const response = await BlogConsume.addComment(newComment);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const removeComment = createAsyncThunk<any, any>(
  "comments/removeComment",
  async (blogId, thunkApi) => {
    try {
      await BlogConsume.deleteComment(blogId);
      return blogId;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const likeDislike = createAsyncThunk<ResponseModel, any>(
  "comments/likeDislike",
  async (likeState, thunkApi) => {
    try {
      const response = await BlogConsume.likeBlogComment(likeState);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = RequestStatus.succeeded;
        state.data.comments = action.payload?.result as BlogComment[];
        state.data.pageIndex = action.payload?.pageIndex;
        state.data.pageSize = action.payload?.pageSize;
        state.data.totalItems = action.payload?.totalItems;
        state.data.pageIndex = action.payload?.pageIndex;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.status = RequestStatus.succeeded;
        state.data.comment = action.payload.result as BlogComment;
      })
      .addCase(removeComment.fulfilled, (state, action) => {
        state.status = RequestStatus.succeeded;
        state.data.comments = state.data.comments?.filter(
          (comment: any) => comment.id !== action.payload
        );
      })
      .addCase(addComment.pending, handlePending)
      .addCase(addComment.rejected, handleRejected)
      .addCase(removeComment.pending, handlePending)
      .addCase(removeComment.rejected, handleRejected)
      .addCase(fetchComments.pending, handlePending)
      .addCase(fetchComments.rejected, handleRejected)
      .addCase(likeDislike.rejected, handleRejected)
      .addCase(likeDislike.pending, handlePending)
      .addCase(likeDislike.fulfilled, handleFulfilled);
  },
});

const handlePending = (state: CommentState) => {
  state.status = RequestStatus.loading;
};
const handleFulfilled = (state: CommentState) => {
  state.status = RequestStatus.succeeded;
};

const handleRejected = (state: CommentState, action: any) => {
  state.status = RequestStatus.failed;
  state.error = action.error.message ?? "An error occurred";
};

export default commentsSlice.reducer;
