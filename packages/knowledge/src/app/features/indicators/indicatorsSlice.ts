import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BlogConsume } from "@4eplatform/shared/apis/blog";
import { AskExpertConsume } from "@4eplatform/shared/apis/ask_expert";
import { ChallengeConsume } from "@4eplatform/shared/apis/challenge";
import { IndexConsume } from "@4eplatform/shared/apis/idea_bank";
import { KnowledgeConsume } from "@4eplatform/shared/apis/knowledge";
import { KnowledgeAggConsume } from "@4eplatform/shared/apis/knowledge_agg";
import { RequestStatus } from "@4eplatform/shared/enums/enums";
import { ResponseModel } from "@4eplatform/shared/models/responseModel";
import {
  blog,
  AskExpert,
  Challenges,
  IdeaBank,
  Knowledge,
  UserAndIOrgIndicators,
} from "../../models/indicatorsModel";

// Define the state structure
interface KnowledgeIndicatorsState {
  blogIndicators: blog | null;
  askExpertIndicators: AskExpert | null;
  challengesIndicators: Challenges | null;
  ideaBankIndicators: IdeaBank | null;
  knowledgeIndicators: Knowledge | null;
  userAndIOrgIndicators: UserAndIOrgIndicators | null;
  loading: boolean;
  error: string | null;
  status: RequestStatus;
}

// Initialize state
const initialState: KnowledgeIndicatorsState = {
  blogIndicators: null,
  askExpertIndicators: null,
  challengesIndicators: null,
  ideaBankIndicators: null,
  knowledgeIndicators: null,
  userAndIOrgIndicators: null,
  loading: false,
  error: null,
  status: RequestStatus.idle,
};

// Create async thunks for API interactions
export const fetchBlogIndex = createAsyncThunk<
  ResponseModel,
  void
>(
  "knowledgeIndicators/fetchBlogIndex",
  async (_, { rejectWithValue }) => {
    try {
      const response = await BlogConsume.getIndex();
      return response;
    } catch (error) {
      return rejectWithValue("Failed to fetch blog indicators");
    }
  }
);

export const fetchAskExpertIndex = createAsyncThunk<
  ResponseModel,
  void
>(
  "knowledgeIndicators/fetchAskExpertIndex",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AskExpertConsume.getIndex();
      return response;
    } catch (error) {
      return rejectWithValue("Failed to fetch ask expert indicators");
    }
  }
);

export const fetchChallengeIndex = createAsyncThunk<
  ResponseModel,
  void
>(
  "knowledgeIndicators/fetchChallengeIndex",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ChallengeConsume.getIndex();
      return response;
    } catch (error) {
      return rejectWithValue("Failed to fetch challenge indicators");
    }
  }
);

export const fetchIdeaBankIndex = createAsyncThunk<
  ResponseModel,
  void
>(
  "knowledgeIndicators/fetchIdeaBankIndex",
  async (_, { rejectWithValue }) => {
    try {
      const response = await IndexConsume.getIndex();
      return response;
    } catch (error) {
      return rejectWithValue("Failed to fetch idea bank indicators");
    }
  }
);

export const fetchKnowledgeIndex = createAsyncThunk<
  ResponseModel,
  void
>(
  "knowledgeIndicators/fetchKnowledgeIndex",
  async (_, { rejectWithValue }) => {
    try {
      const response = await KnowledgeConsume.getIndex();
      return response;
    } catch (error) {
      return rejectWithValue("Failed to fetch knowledge indicators");
    }
  }
);

export const fetchUserAndIOrgIndicators = createAsyncThunk<
  ResponseModel,
  void
>(
  "knowledgeIndicators/fetchUserAndIOrgIndicators",
  async (_, { rejectWithValue }) => {
    try {
      const response = await KnowledgeAggConsume.getUserAndIOrgIndicators();
      return response;
    } catch (error) {
      return rejectWithValue("Failed to fetch user and organization indicators");
    }
  }
);

// Create the slice
const knowledgeIndicatorsSlice = createSlice({
  name: "knowledgeIndicators",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    resetState: (state) => {
      state.blogIndicators = null;
      state.askExpertIndicators = null;
      state.challengesIndicators = null;
      state.ideaBankIndicators = null;
      state.knowledgeIndicators = null;
      state.userAndIOrgIndicators = null;
      state.loading = false;
      state.error = null;
      state.status = RequestStatus.idle;
    },
    setStatus: (state, action: PayloadAction<RequestStatus>) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Blog Index
      .addCase(fetchBlogIndex.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = RequestStatus.pending;
      })
      .addCase(
        fetchBlogIndex.fulfilled,
        (state, action: PayloadAction<ResponseModel>) => {
          state.loading = false;
          state.blogIndicators = action.payload?.result as blog;
          state.status = RequestStatus.succeeded;
        }
      )
      .addCase(fetchBlogIndex.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch blog indicators";
        state.status = RequestStatus.failed;
      })

      // Ask Expert Index
      .addCase(fetchAskExpertIndex.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = RequestStatus.pending;
      })
      .addCase(
        fetchAskExpertIndex.fulfilled,
        (state, action: PayloadAction<ResponseModel>) => {
          state.loading = false;
          state.askExpertIndicators = action.payload?.result as AskExpert;
          state.status = RequestStatus.succeeded;
        }
      )
      .addCase(fetchAskExpertIndex.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch ask expert indicators";
        state.status = RequestStatus.failed;
      })

      // Challenge Index
      .addCase(fetchChallengeIndex.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = RequestStatus.pending;
      })
      .addCase(
        fetchChallengeIndex.fulfilled,
        (state, action: PayloadAction<ResponseModel>) => {
          state.loading = false;
          state.challengesIndicators = action.payload?.result as Challenges;
          state.status = RequestStatus.succeeded;
        }
      )
      .addCase(fetchChallengeIndex.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch challenge indicators";
        state.status = RequestStatus.failed;
      })

      // Idea Bank Index
      .addCase(fetchIdeaBankIndex.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = RequestStatus.pending;
      })
      .addCase(
        fetchIdeaBankIndex.fulfilled,
        (state, action: PayloadAction<ResponseModel>) => {
          state.loading = false;
          state.ideaBankIndicators = action.payload?.result as IdeaBank;
          state.status = RequestStatus.succeeded;
        }
      )
      .addCase(fetchIdeaBankIndex.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch idea bank indicators";
        state.status = RequestStatus.failed;
      })

      // Knowledge Index
      .addCase(fetchKnowledgeIndex.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = RequestStatus.pending;
      })
      .addCase(
        fetchKnowledgeIndex.fulfilled,
        (state, action: PayloadAction<ResponseModel>) => {
          state.loading = false;
          state.knowledgeIndicators = action.payload?.result as Knowledge;
          state.status = RequestStatus.succeeded;
        }
      )
      .addCase(fetchKnowledgeIndex.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch knowledge indicators";
        state.status = RequestStatus.failed;
      })

      // User and Organization Indicators
      .addCase(fetchUserAndIOrgIndicators.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = RequestStatus.pending;
      })
      .addCase(
        fetchUserAndIOrgIndicators.fulfilled,
        (state, action: PayloadAction<ResponseModel>) => {
          state.loading = false;
          state.userAndIOrgIndicators = action.payload?.result as UserAndIOrgIndicators;
          state.status = RequestStatus.succeeded;
        }
      )
      .addCase(fetchUserAndIOrgIndicators.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch user and organization indicators";
        state.status = RequestStatus.failed;
      });
  },
});

// Export actions and reducer
export const { clearErrors, resetState, setStatus } = knowledgeIndicatorsSlice.actions;
export default knowledgeIndicatorsSlice.reducer;