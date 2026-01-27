import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseModel } from "../../models/responseModel";
import { RequestStatus } from "../../enums/enums";
import { ChallengeArrayModel, ChallengeModel } from "../../models/challenges";
import { KnowledgeAggConsume } from "@4eplatform/shared/apis/knowledge_agg";
import { ChallengeConsume } from "@4eplatform/shared/apis/challenge";
interface ChallengeState {
  data: ChallengeArrayModel;
  LKProjects: [];
  status: RequestStatus;
  error: string | null;
}

const initialState: ChallengeState = {
  data: new ChallengeArrayModel(),
  LKProjects: [],
  status: RequestStatus.idle,
  error: "",
};

export const fetchChallenges = createAsyncThunk<ResponseModel, any>(
  "blogs/fetchChallenges",
  async (params = {}, thunkApi) => {
    try {
      const response = await KnowledgeAggConsume.getChallenges(params);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchChallenge = createAsyncThunk<ResponseModel,any>(
  "challenges/fetchBlog",
  async (challengeId: string, thunkApi) => {
    try {
      const response = await KnowledgeAggConsume.getRequestedChallengeById(challengeId);
      return response;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const addChallenge = createAsyncThunk<ResponseModel, any>(
  "challenges/addChallenge",
  async (newChallenge, thunkApi) => {
    try {
      const response = await ChallengeConsume.addChallenge(newChallenge);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const editChallenge = createAsyncThunk(
  "challenges/editChallenge",
  async ({ challenge, id }: { challenge: object; id: string }, thunkApi) => {
    try {
      const response = await ChallengeConsume.editChallenge({
        body: challenge,
        id: id,
      });
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const removeChallenge = createAsyncThunk<ResponseModel, any>(
  "challenges/removeChallenge",
  async (data, thunkApi) => {
    try {
      await ChallengeConsume.deleteChallenge(data);
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchLookupsProjects = createAsyncThunk<any>(
  "challenges/fetchLookupsProjects",
  async (_, thunkApi) => {
    try {
      const response = await ChallengeConsume.getLookupsProjects();
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

const challengeSlice = createSlice({
  name: "challenges",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChallenges.fulfilled, (state, action) => {
        state.status = RequestStatus.succeeded;
        state.data.Challenges = action.payload?.result as ChallengeModel[];
        state.data.pageIndex = action.payload?.pageIndex;
        state.data.pageSize = action.payload?.pageSize;
        state.data.totalItems = action.payload?.totalItems;
        state.data.totalPages = action.payload?.totalPages;
        state.data.pageIndex = action.payload?.pageIndex;
      })
      .addCase(fetchChallenge.fulfilled, (state, action) => {
        state.status = RequestStatus.succeeded;
        state.data.Challenge = action.payload?.result as ChallengeModel;
      })
      .addCase(removeChallenge.fulfilled, (state, action) => {
        state.status = RequestStatus.succeeded;
        state.data.Challenges = state.data.Challenges?.filter(
          (challenge) => challenge?.id !== +action?.payload
        );
      })
      .addCase(fetchLookupsProjects.fulfilled, (state, action) => {
        state.status = RequestStatus.succeeded;
        state.LKProjects = action.payload?.result;
      })
      .addCase(addChallenge.pending, handlePending)
      .addCase(addChallenge.fulfilled, handleFulfilled)
      .addCase(addChallenge.rejected, handleRejected)
      .addCase(editChallenge.pending, handlePending)
      .addCase(editChallenge.fulfilled, handleFulfilled)
      .addCase(editChallenge.rejected, handleRejected)
      .addCase(fetchChallenges.pending, handlePending)
      .addCase(fetchChallenges.rejected, handleRejected)
      .addCase(fetchChallenge.rejected, handleRejected)
      .addCase(fetchChallenge.pending, handlePending)
      .addCase(removeChallenge.rejected, handleRejected)
      .addCase(removeChallenge.pending, handlePending)
      .addCase(fetchLookupsProjects.rejected, handleRejected)
      .addCase(fetchLookupsProjects.pending, handlePending);
  },
});

const handlePending = (state: ChallengeState) => {
  state.status = RequestStatus.loading;
};
const handleFulfilled = (state: ChallengeState) => {
  state.status = RequestStatus.succeeded;
};

const handleRejected = (state: ChallengeState, action: any) => {
  state.status = RequestStatus.failed;
  state.error = action.error.message ?? "An error occurred";
};

export default challengeSlice.reducer;
