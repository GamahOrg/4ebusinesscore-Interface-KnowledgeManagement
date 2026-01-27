import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseModel } from "../../models/responseModel";

import { ChallengeConsume } from "@4eplatform/shared/apis/challenge";
import { KnowledgeAggConsume } from "@4eplatform/shared/apis/knowledge_agg";
import { RequestStatus } from "../../enums/enums";

import {
  ChallengeComment,
  CommentResponse,
} from "../../models/ChallengeComment";

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
      const response = await KnowledgeAggConsume.getChallengeComments(params);
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
      const response = await ChallengeConsume.addComment(newComment);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const removeComment = createAsyncThunk<any, any>(
  "comments/removeComment",
  async (challengeId, thunkApi) => {
    try {
      await ChallengeConsume.deleteComment(challengeId);
      return challengeId;
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
        state.data.comments = action.payload?.result as ChallengeComment[];
        state.data.pageIndex = action.payload?.pageIndex;
        state.data.pageSize = action.payload?.pageSize;
        state.data.totalItems = action.payload?.totalItems;
        state.data.pageIndex = action.payload?.pageIndex;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.status = RequestStatus.succeeded;
        state.data.comment = action.payload.result as ChallengeComment;
      })
      .addCase(removeComment.fulfilled, (state, action) => {
        state.status = RequestStatus.succeeded;
        state.data.comments = state.data.comments?.filter(
          (comment) => comment.id !== action.payload
        );
      })
      .addCase(addComment.pending, handlePending)
      .addCase(addComment.rejected, handleRejected)
      .addCase(removeComment.pending, handlePending)
      .addCase(removeComment.rejected, handleRejected)
      .addCase(fetchComments.pending, handlePending)
      .addCase(fetchComments.rejected, handleRejected);
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
