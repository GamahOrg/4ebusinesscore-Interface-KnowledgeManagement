import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Idea, { IdeaResponse } from "../../models/Idea";
import { ResponseModel } from "../../models/responseModel";
import { RequestStatus } from "../../enums/enums";
import { IdeaBankConsume } from "@4eplatform/shared/apis/idea_bank";
import { KnowledgeAggConsume } from "@4eplatform/shared/apis/knowledge_agg";
import LkInputType, { LkInputTypesResponse } from "../../models/LkInputTypes";
import { LookupIdeaConsume } from "@4eplatform/shared/apis/lookup";
interface IdeasState {
  data: IdeaResponse;
  inputTypesLookup: LkInputTypesResponse;
  status: RequestStatus;
  error: string | null;
}

const initialState: IdeasState = {
  data: new IdeaResponse(),
  inputTypesLookup: new LkInputTypesResponse(),
  status: RequestStatus.idle,
  error: "",
};

export const fetchIdeas = createAsyncThunk<ResponseModel, any>(
  "ideas/fetchIdeas",
  async (params = {}, thunkApi) => {
    try {
      const response = await KnowledgeAggConsume.getAllIdeasPaginated(params);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchIdea = createAsyncThunk<ResponseModel, string | any>(
  "ideas/fetchIdea",
  async (ideaId: string | any, thunkApi) => {
    try {
      const response = await KnowledgeAggConsume.getRequestedIdeaById(ideaId);
      return response;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const addIdea = createAsyncThunk<ResponseModel, any>(
  "ideas/addIdea",
  async (newIdea, thunkApi) => {
    try {
      const response = await IdeaBankConsume.addIdea(newIdea);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const editIdea = createAsyncThunk(
  "ideas/editIdea",
  async ({ idea, id }: { idea: object; id: string }, thunkApi) => {
    try {
      const response = await IdeaBankConsume.editIdea({
        body: idea,
        id: id,
      });
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const removeIdea = createAsyncThunk<ResponseModel, any>(
  "ideas/removeIdea",
  async (ideaId, thunkApi) => {
    try {
      await IdeaBankConsume.deleteIdea(ideaId);
      return ideaId;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

//idea actions
export const likeDislike = createAsyncThunk<ResponseModel, any>(
  "ideas/likeDislike",
  async (likeState, thunkApi) => {
    try {
      const response = await IdeaBankConsume.ideaAddReaction(likeState);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const rateIdea = createAsyncThunk<ResponseModel, any>(
  "ideas/rateIdea",
  async (rating, thunkApi) => {
    try {
      const response = await IdeaBankConsume.ideaAddRating(rating);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchLKInputTypes = createAsyncThunk<ResponseModel, any>(
  "ideas/fetchLKInputTypes",
  async (_, thunkApi) => {
    try {
      const response = await LookupIdeaConsume.getAllLkInputTypes();
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

const ideaSlice = createSlice({
  name: "ideas",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIdeas.fulfilled, (state, action) => {
        state.status = RequestStatus.succeeded;
        state.data.ideas = action.payload?.result as Idea[];
        state.data.pageIndex = action.payload?.pageIndex;
        state.data.pageSize = action.payload?.pageSize;
        state.data.totalItems = action.payload?.totalItems;
        state.data.totalPages = action.payload?.totalPages;
      })
      .addCase(fetchIdea.fulfilled, (state, action) => {
        state.status = RequestStatus.succeeded;
        state.data.idea = action.payload.result as Idea;
      })
      .addCase(removeIdea.fulfilled, (state, action) => {
        state.status = RequestStatus.succeeded;
        state.data.ideas = state.data?.ideas?.filter(
          (idea) => +idea.id !== +action.payload
        );
      })
      .addCase(fetchLKInputTypes.fulfilled, (state, action) => {
        state.status = RequestStatus.succeeded;
        state.inputTypesLookup.lkInputTypes = action.payload
          ?.result as LkInputType[];
      })
      .addCase(fetchLKInputTypes.pending, handlePending)
      .addCase(fetchLKInputTypes.rejected, handleRejected)
      .addCase(addIdea.pending, handlePending)
      .addCase(addIdea.fulfilled, handleFulfilled)
      .addCase(addIdea.rejected, handleRejected)
      .addCase(editIdea.pending, handlePending)
      .addCase(editIdea.fulfilled, handleFulfilled)
      .addCase(editIdea.rejected, handleRejected)
      .addCase(fetchIdeas.pending, handlePending)
      .addCase(fetchIdea.rejected, handleRejected)
      .addCase(fetchIdea.pending, handlePending)
      .addCase(fetchIdeas.rejected, handleRejected)
      .addCase(likeDislike.fulfilled, handleFulfilled)
      .addCase(likeDislike.pending, handlePending)
      .addCase(likeDislike.rejected, handleRejected)
      .addCase(rateIdea.fulfilled, handleFulfilled)
      .addCase(rateIdea.pending, handlePending)
      .addCase(rateIdea.rejected, handleRejected);
  },
});

const handlePending = (state: IdeasState) => {
  state.status = RequestStatus.loading;
};
const handleFulfilled = (state: IdeasState) => {
  state.status = RequestStatus.succeeded;
};

const handleRejected = (state: IdeasState, action: any) => {
  state.status = RequestStatus.failed;
  state.error = action.error.message ?? "An error occurred";
};

export default ideaSlice.reducer;
