import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseModel } from "../../models/responseModel";

import {AskExpertConsume} from "@4eplatform/shared/apis/ask_expert";

import { CommentResponse, Comment } from "../../models/Comment";
import { RequestStatus } from "../../enums/enums";
import { KnowledgeAggConsume } from "@4eplatform/shared/apis/knowledge_agg";
import { IdeaBankConsume } from "@4eplatform/shared/apis/idea_bank";
import { BlogConsume } from "@4eplatform/shared/apis/blog";
import { ChallengeConsume } from "@4eplatform/shared/apis/challenge";

interface CommentState {
  data: CommentResponse;
  status: RequestStatus;
  error: string | null;
  message: string;
}

const initialState: CommentState = {
  data: new CommentResponse(),
  status: RequestStatus.idle,
  error: "",
  message: "",
};

//idea
export const fetchIdeaComments = createAsyncThunk<ResponseModel, any>(
  "comments/fetchIdeaComments",
  async (params, thunkApi) => {
    try {
      const response = await KnowledgeAggConsume.ideaGetComments(params);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const addIdeaComment = createAsyncThunk<ResponseModel, any>(
  "comments/addIdeaComment",
  async (newComment, thunkApi) => {
    try {
      const response = await IdeaBankConsume.addComment(newComment);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const removeIdeaComment = createAsyncThunk<any, any>(
  "comments/removeIdeaComment",
  async (commentId, thunkApi) => {
    try {
      await IdeaBankConsume.ideaDeleteComment(commentId);
      return commentId;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

//idea actions
export const likeDislikeIdeaComment = createAsyncThunk<ResponseModel, any>(
  "comments/likeDislikeIdea",
  async (likeState, thunkApi) => {
    try {
      const response = await IdeaBankConsume.ideaCommentAddReaction(likeState);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

//blog
export const fetchBlogComments = createAsyncThunk<ResponseModel, any>(
  "comments/fetchBlogComments",
  async (params, thunkApi) => {
    try {
      const response = await KnowledgeAggConsume.getBlogComments(params);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const addBlogComment = createAsyncThunk<ResponseModel, any>(
  "comments/addBlogComment",
  async (newComment, thunkApi) => {
    try {
      const response = await BlogConsume.addComment(newComment);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const removeBlogComment = createAsyncThunk<any, any>(
  "comments/removeBlogComment",
  async (blogId, thunkApi) => {
    try {
      await BlogConsume.deleteComment(blogId);
      return blogId;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const likeDislikeBlogComment = createAsyncThunk<ResponseModel, any>(
  "comments/likeDislikeBlog",
  async (likeState, thunkApi) => {
    try {
      const response = await BlogConsume.likeBlogComment(likeState);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

//challenge
export const fetchChallengeComments = createAsyncThunk<ResponseModel, any>(
  "comments/fetchChallengeComments",
  async (params, thunkApi) => {
    try {
      const response = await KnowledgeAggConsume.getChallengeComments(params);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const addChallengeComment = createAsyncThunk<ResponseModel, any>(
  "comments/addChallengeComment",
  async (newComment, thunkApi) => {
    try {
      const response = await ChallengeConsume.addComment(newComment);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const removeChallengeComment = createAsyncThunk<any, any>(
  "comments/removeChallengeComment",
  async (challengeId, thunkApi) => {
    try {
      const res = await ChallengeConsume.deleteComment(challengeId);
      return res;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

//experts questions
export const fetchQuestionsComments = createAsyncThunk<ResponseModel, any>(
  "comments/fetchQuestionComments",
  async (params, thunkApi) => {
    try {
      const response = await KnowledgeAggConsume.questionGetComments(params);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const addQuestionsComment = createAsyncThunk<ResponseModel, any>(
  "comments/addQuestionComment",
  async (newComment, thunkApi) => {
    try {
      const response = await AskExpertConsume.questionAddComment(newComment);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const removeQuestionsComment = createAsyncThunk<any, any>(
  "comments/removeQuestionComment",
  async (challengeId, thunkApi) => {
    try {
      await AskExpertConsume.questionRemoveComment(challengeId);
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

      //idea
      .addCase(fetchIdeaComments.fulfilled, (state, action) => {
        state.status = RequestStatus.succeeded;
        state.data.comments = action.payload?.result as Comment[];
        state.data.pageIndex = action.payload?.pageIndex;
        state.data.pageSize = action.payload?.pageSize;
        state.data.totalItems = action.payload?.totalItems;
        state.data.pageIndex = action.payload?.pageIndex;
      })
      .addCase(addIdeaComment.fulfilled, (state, action) => {
        state.status = RequestStatus.succeeded;
        state.data.comment = action.payload.result as Comment;
      })
      .addCase(removeIdeaComment.fulfilled, (state, action) => {
        state.status = RequestStatus.succeeded;
        state.message = action.payload?.message;
        state.data.comments = state.data.comments?.filter(
          (comment) => comment.id !== action.payload
        );
      })
      .addCase(addIdeaComment.pending, handlePending)
      .addCase(addIdeaComment.rejected, handleRejected)
      .addCase(removeIdeaComment.pending, handlePending)
      .addCase(removeIdeaComment.rejected, handleRejected)
      .addCase(fetchIdeaComments.pending, handlePending)
      .addCase(fetchIdeaComments.rejected, handleRejected)
      .addCase(likeDislikeIdeaComment.rejected, handleRejected)
      .addCase(likeDislikeIdeaComment.pending, handlePending)
      .addCase(likeDislikeIdeaComment.fulfilled, handleFulfilled)

      //blog
      .addCase(fetchBlogComments.fulfilled, (state, action) => {
        state.status = RequestStatus.succeeded;
        state.data.comments = action.payload?.result as Comment[];
        state.data.pageIndex = action.payload?.pageIndex;
        state.data.pageSize = action.payload?.pageSize;
        state.data.totalItems = action.payload?.totalItems;
        state.data.pageIndex = action.payload?.pageIndex;
      })
      .addCase(addBlogComment.fulfilled, (state, action) => {
        state.status = RequestStatus.succeeded;
        state.data.comment = action.payload.result as Comment;
      })
      .addCase(removeBlogComment.fulfilled, (state, action) => {
        state.status = RequestStatus.succeeded;
        state.message = action.payload?.message;
        state.data.comments = state.data.comments?.filter(
          (comment) => comment.id !== action.payload
        );
      })
      .addCase(addBlogComment.pending, handlePending)
      .addCase(addBlogComment.rejected, handleRejected)
      .addCase(removeBlogComment.pending, handlePending)
      .addCase(removeBlogComment.rejected, handleRejected)
      .addCase(fetchBlogComments.pending, handlePending)
      .addCase(fetchBlogComments.rejected, handleRejected)
      .addCase(likeDislikeBlogComment.rejected, handleRejected)
      .addCase(likeDislikeBlogComment.pending, handlePending)
      .addCase(likeDislikeBlogComment.fulfilled, handleFulfilled)

      //challenge
      .addCase(fetchChallengeComments.fulfilled, (state, action) => {
        state.status = RequestStatus.succeeded;
        state.data.comments = action.payload?.result as Comment[];
        state.data.pageIndex = action.payload?.pageIndex;
        state.data.pageSize = action.payload?.pageSize;
        state.data.totalItems = action.payload?.totalItems;
        state.data.pageIndex = action.payload?.pageIndex;
      })
      .addCase(addChallengeComment.fulfilled, (state, action) => {
        state.status = RequestStatus.succeeded;
        state.data.comment = action.payload.result as Comment;
      })
      .addCase(removeChallengeComment.fulfilled, (state, action) => {
        state.status = RequestStatus.succeeded;
        state.message = action.payload?.message;
        state.data.comments = state.data.comments?.filter(
          (comment) => comment.id !== action.payload
        );
      })
      .addCase(addChallengeComment.pending, handlePending)
      .addCase(addChallengeComment.rejected, handleRejected)
      .addCase(removeChallengeComment.pending, handlePending)
      .addCase(removeChallengeComment.rejected, handleRejected)
      .addCase(fetchChallengeComments.pending, handlePending)
      .addCase(fetchChallengeComments.rejected, handleRejected)

      //experts questions
      .addCase(fetchQuestionsComments.fulfilled, (state, action) => {
        state.status = RequestStatus.succeeded;
        state.data.comments = action.payload?.result as Comment[];
        state.data.pageIndex = action.payload?.pageIndex;
        state.data.pageSize = action.payload?.pageSize;
        state.data.totalItems = action.payload?.totalItems;
        state.data.pageIndex = action.payload?.pageIndex;
      })
      .addCase(addQuestionsComment.fulfilled, (state, action) => {
        state.status = RequestStatus.succeeded;
        state.data.comment = action.payload.result as Comment;
      })
      .addCase(removeQuestionsComment.fulfilled, (state, action) => {
        state.status = RequestStatus.succeeded;
        state.message = action.payload?.message;
        state.data.comments = state.data.comments?.filter(
          (comment) => comment.id !== action.payload
        );
      })
      .addCase(addQuestionsComment.pending, handlePending)
      .addCase(addQuestionsComment.rejected, handleRejected)
      .addCase(removeQuestionsComment.pending, handlePending)
      .addCase(removeQuestionsComment.rejected, handleRejected)
      .addCase(fetchQuestionsComments.pending, handlePending)
      .addCase(fetchQuestionsComments.rejected, handleRejected);
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
