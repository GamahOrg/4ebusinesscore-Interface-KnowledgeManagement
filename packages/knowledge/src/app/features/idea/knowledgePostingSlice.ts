import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {KnowledgePostingResponse } from '../../models/knowledgePosting';
import { ResponseModel } from '../../models/responseModel';
import { KnowledgeAggConsume } from "@4eplatform/shared/apis/knowledge_agg";
import { BlogConsume } from "@4eplatform/shared/apis/blog";
import { IdeaBankConsume } from "@4eplatform/shared/apis/idea_bank";
import { ChallengeConsume } from "@4eplatform/shared/apis/challenge";
import { AskExpertConsume } from "@4eplatform/shared/apis/ask_expert";

//ideas
export const fetchIdeasByRequestStage = createAsyncThunk<ResponseModel, any>(
  'knowledgePosting/fetchIdeasByRequestStage',
  async (params,thunkApi) => {
    try {
      const response = await KnowledgeAggConsume.getIdeasByRequestStage({requestedStage:params.requestedStage,pageSize:params.pageSize});
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
export const fetchIdeaDetailsByRequestStage = createAsyncThunk<ResponseModel, any>(
  'knowledgePosting/fetchIdeaDetailsByRequestStage',
  async (ideaId: string,thunkApi) => {
    try {
      const response = await KnowledgeAggConsume.getIdeaDetailsByRequestStage(ideaId);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
export const editIdeaRequestStage = createAsyncThunk('ideas/editIdeaRequestStage', async (data:object,thunkApi) => {
  try {
    const response = await IdeaBankConsume.editIdeaRequestStage(data);
    return response;
  } catch (error) {
      return thunkApi.rejectWithValue(error)
  }
});

//blogs
export const fetchBlogsByRequestStage = createAsyncThunk<ResponseModel, any>(
  'blogPosting/fetchblogsByRequestStage',
  async (params,thunkApi) => {
    try {
      const response = await KnowledgeAggConsume.getAllRequestedBlogs({requestedStage:params.requestedStage,pageSize:params.pageSize});
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
export const fetchBlogDetailsByRequestStage = createAsyncThunk<ResponseModel, any>(
  'blogPosting/fetchBlogDetailsByRequestStage',
  async (ideaId: string,thunkApi) => {
    try {
      const response = await KnowledgeAggConsume.getRequestedBlogById(ideaId);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
export const editBlogRequestStage = createAsyncThunk('blogs/editBlogRequestStage', async (data:object,thunkApi) => {
  try {
    const response = await BlogConsume.editRequestedBlog(data);
    return response;
  } catch (error) {
      return thunkApi.rejectWithValue(error)
  }
});
//challenges
export const fetchChallengesByRequestStage = createAsyncThunk<ResponseModel, any>(
  'challengePosting/fetchchallengesByRequestStage',
  async (params,thunkApi) => {
    try {
      const response = await KnowledgeAggConsume.getAllRequestedChallenges({requestedStage:params.requestedStage,pageSize:params.pageSize});
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
export const fetchChallengeDetailsByRequestStage = createAsyncThunk<ResponseModel, any>(
  'challengePosting/fetchChallengeDetailsByRequestStage',
  async (challengeId: string,thunkApi) => {
    try {
      const response = await KnowledgeAggConsume.getRequestedChallengesById(challengeId);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
export const editChallengeRequestStage = createAsyncThunk('challenges/editChallengeRequestStage', async (data:object,thunkApi) => {
  try {
    const response = await ChallengeConsume.updateRequestStage(data);
    return response;
  } catch (error) {
      return thunkApi.rejectWithValue(error)
  }
});

//questions
export const fetchQuestionsByRequestStage = createAsyncThunk<ResponseModel, any>(
  'questionsPosting/fetchquestionsByRequestStage',
  async (params,thunkApi) => {
    try {
      const response = await KnowledgeAggConsume.getAllRequestedQuestions({requestedStage:params.requestedStage,pageSize:params.pageSize});
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
export const fetchQuestionDetailsByRequestStage = createAsyncThunk<ResponseModel, any>(
  'questionPosting/fetchQuestionDetailsByRequestStage',
  async (questionId: string,thunkApi) => {
    try {
      const response = await KnowledgeAggConsume.getRequestedQuestionsById(questionId);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
export const editQuestionRequestStage = createAsyncThunk('questions/editQuestionRequestStage', async (data:object,thunkApi) => {
  try {
    const response = await AskExpertConsume.putRequestedQuestions(data);
    return response;
  } catch (error) {
      return thunkApi.rejectWithValue(error)
  }
});

interface KnowledgePostingState {
  requestedIdeas: KnowledgePostingResponse;
  requestedIdea:KnowledgePostingResponse;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: KnowledgePostingState = {
  requestedIdeas: new KnowledgePostingResponse(),
  requestedIdea: new KnowledgePostingResponse(),
  status: 'idle',
  error: null,
};

const knowledgePostingSlice = createSlice({
  name: 'knowledgePosting',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    //fetchIdeasByRequestStage
      .addCase(fetchIdeasByRequestStage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchIdeasByRequestStage.fulfilled, (state, action: PayloadAction<KnowledgePostingResponse>) => {
        state.status = 'succeeded';
        state.requestedIdeas = action.payload as KnowledgePostingResponse;
      })
      .addCase(fetchIdeasByRequestStage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      //fetchIdeaDetailsByRequestStage
      .addCase(fetchIdeaDetailsByRequestStage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchIdeaDetailsByRequestStage.fulfilled, (state, action: PayloadAction<KnowledgePostingResponse>) => {
        state.status = 'succeeded';
        state.requestedIdea = action.payload as KnowledgePostingResponse;
      })
      .addCase(fetchIdeaDetailsByRequestStage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      //editIdeaRequestStage
      .addCase(editIdeaRequestStage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(editIdeaRequestStage.fulfilled, (state) => {
        state.status = 'succeeded';
        })
      .addCase(editIdeaRequestStage.rejected, (state) => {
        state.status = 'failed';
        })


          //fetchBlogsByRequestStage
      .addCase(fetchBlogsByRequestStage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBlogsByRequestStage.fulfilled, (state, action: PayloadAction<KnowledgePostingResponse>) => {
        state.status = 'succeeded';
        state.requestedIdeas = action.payload as KnowledgePostingResponse;
      })
      .addCase(fetchBlogsByRequestStage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      //fetchBlogDetailsByRequestStage
      .addCase(fetchBlogDetailsByRequestStage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBlogDetailsByRequestStage.fulfilled, (state, action: PayloadAction<KnowledgePostingResponse>) => {
        state.status = 'succeeded';
        state.requestedIdea = action.payload as KnowledgePostingResponse;
      })
      .addCase(fetchBlogDetailsByRequestStage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      //editBlogRequestStage
      .addCase(editBlogRequestStage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(editBlogRequestStage.fulfilled, (state) => {
        state.status = 'succeeded';
        })
      .addCase(editBlogRequestStage.rejected, (state) => {
        state.status = 'failed';
        })

             //fetchChallengesByRequestStage
      .addCase(fetchChallengesByRequestStage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChallengesByRequestStage.fulfilled, (state, action: PayloadAction<KnowledgePostingResponse>) => {
        state.status = 'succeeded';
        state.requestedIdeas = action.payload as KnowledgePostingResponse;
      })
      .addCase(fetchChallengesByRequestStage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      //fetchChallengeDetailsByRequestStage
      .addCase(fetchChallengeDetailsByRequestStage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChallengeDetailsByRequestStage.fulfilled, (state, action: PayloadAction<KnowledgePostingResponse>) => {
        state.status = 'succeeded';
        state.requestedIdea = action.payload as KnowledgePostingResponse;
      })
      .addCase(fetchChallengeDetailsByRequestStage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      //editChallengeRequestStage
      .addCase(editChallengeRequestStage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(editChallengeRequestStage.fulfilled, (state) => {
        state.status = 'succeeded';
        })
      .addCase(editChallengeRequestStage.rejected, (state) => {
        state.status = 'failed';
        })


         //fetchQuestionsByRequestStage
      .addCase(fetchQuestionsByRequestStage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuestionsByRequestStage.fulfilled, (state, action: PayloadAction<KnowledgePostingResponse>) => {
        state.status = 'succeeded';
        state.requestedIdeas = action.payload as KnowledgePostingResponse;
      })
      .addCase(fetchQuestionsByRequestStage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      //fetchQuestionDetailsByRequestStage
      .addCase(fetchQuestionDetailsByRequestStage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuestionDetailsByRequestStage.fulfilled, (state, action: PayloadAction<KnowledgePostingResponse>) => {
        state.status = 'succeeded';
        state.requestedIdea = action.payload as KnowledgePostingResponse;
      })
      .addCase(fetchQuestionDetailsByRequestStage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      //editQuestionRequestStage
      .addCase(editQuestionRequestStage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(editQuestionRequestStage.fulfilled, (state) => {
        state.status = 'succeeded';
        })
      .addCase(editQuestionRequestStage.rejected, (state) => {
        state.status = 'failed';
        })
  
  },
});

export default knowledgePostingSlice.reducer;