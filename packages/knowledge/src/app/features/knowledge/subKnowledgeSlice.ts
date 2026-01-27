import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseModel } from "../../models/responseModel";
import { RequestStatus } from "../../enums/enums";
import { AllSubKnowledges, SubKnowledge } from "../../models/SubKnowledge";
import { KnowledgeConsume } from "@4eplatform/shared/apis/knowledge";
import { KnowledgeAggConsume } from "@4eplatform/shared/apis/knowledge_agg";

interface SubKnowledgeState {
  subKnowledges: AllSubKnowledges;
  subKnowledge: SubKnowledge;
  isFavoirate: boolean;
  status: RequestStatus;
  error: string | null | unknown;
}

const initialState: SubKnowledgeState = {
  subKnowledges: new AllSubKnowledges(),
  subKnowledge: new SubKnowledge(),
  isFavoirate: false,
  status: RequestStatus.idle,
  error: "",
};

export const fetchSubKnowledges = createAsyncThunk<ResponseModel, any>(
  "SubKnowledges/fetchSubKnowledges",
  async (params, thunkApi) => {
    try {
      const response =
        await KnowledgeAggConsume.getSubKnowledgeByKnowledgeId(params);

      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchSubKnowledge = createAsyncThunk<ResponseModel, string>(
  "SubKnowledges/fetchSubKnowledge",
  async (subKnowledgeId: string, thunkApi) => {
    try {
      const response =
        await KnowledgeAggConsume.getSubKnowledgeById(subKnowledgeId);
      return response;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const addSubKnowledge = createAsyncThunk<ResponseModel, any>(
  "SubKnowledges/addSubKnowledge",
  async (subKnowledge, thunkApi) => {
    try {
      const response = await KnowledgeConsume.addSubKnowledge(subKnowledge);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const editSubKnowledge = createAsyncThunk(
  "SubKnowledges/editSubKnowledge",
  async (subKnowledge: object, thunkApi) => {
    try {
      const response = await KnowledgeConsume.editSubKnowledge(subKnowledge);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const removeSubKnowledge = createAsyncThunk(
  "SubKnowledges/removeSubKnowledge",
  async (subKnowledgeId: string, thunkApi) => {
    try {
      const response =
        await KnowledgeConsume.removeSubKnowledge(subKnowledgeId);
      return { response, subKnowledgeId };
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const likeDislike = createAsyncThunk<ResponseModel, any>(
  "SubKnowledges/likeDislike",
  async (likeState, thunkApi) => {
    try {
      const response = await KnowledgeConsume.subKnowledgeReaction(likeState);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const rateSubKnowledges = createAsyncThunk<ResponseModel, any>(
  "SubKnowledges/rateSubKnowledges",
  async (params, thunkApi) => {
    try {
      const response = await KnowledgeConsume.subKnowledgeRating({
        subKnowledgeId: params.subKnowledgeId,
        rateValue: params.value,
      });
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const toggleFavorite = createAsyncThunk<ResponseModel, any>(
  "SubKnowledges/toggleFavorite",
  async (subId, thunkApi) => {
    try {
      const response = await KnowledgeConsume.subKnowledgeFavorite({
        subKnowledgeId: subId,
      });
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

const SubKnowledgeslice = createSlice({
  name: "SubKnowledges",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubKnowledges.fulfilled, (state, action) => {
        state.status = RequestStatus.succeeded;
        state.subKnowledges = action.payload as unknown as AllSubKnowledges;
      })
      .addCase(fetchSubKnowledge.fulfilled, (state, action) => {
        state.status = RequestStatus.succeeded;
        state.subKnowledge = action.payload?.result as SubKnowledge;
      })
      .addCase(removeSubKnowledge.fulfilled, (state, action) => {
        state.status = RequestStatus.succeeded;
        state.subKnowledges.result = state?.subKnowledges?.result?.filter(
          (subKnowledge) => subKnowledge.id !== action.payload.subKnowledgeId
        );
      })
      .addCase(likeDislike.fulfilled, handleFulfilled)
      .addCase(likeDislike.pending, handlePending)
      .addCase(likeDislike.rejected, handleRejected)

      // .addCase(toggleFavorite.pending, (state) => {
      //   state.error = null;
      // })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.status = RequestStatus.succeeded;
        state.isFavoirate = !state.isFavoirate;
        // state.isFavorite = !action.payload.result.isFavorite;
      })
      // .addCase(toggleFavorite.rejected, (state, action) => {
      //   state.error = action.payload;
      // })
      .addCase(toggleFavorite.pending, handlePending)
      .addCase(toggleFavorite.rejected, handleRejected)

      .addCase(rateSubKnowledges.fulfilled, handleFulfilled)
      .addCase(rateSubKnowledges.pending, handlePending)
      .addCase(rateSubKnowledges.rejected, handleRejected)

      .addCase(addSubKnowledge.pending, handlePending)
      .addCase(addSubKnowledge.fulfilled, handleFulfilled)
      .addCase(addSubKnowledge.rejected, handleRejected)
      .addCase(editSubKnowledge.pending, handlePending)
      .addCase(editSubKnowledge.fulfilled, handleFulfilled)
      .addCase(editSubKnowledge.rejected, handleRejected)
      .addCase(removeSubKnowledge.rejected, handleRejected)
      .addCase(removeSubKnowledge.pending, handlePending)
      .addCase(fetchSubKnowledges.pending, handlePending)
      .addCase(fetchSubKnowledges.rejected, handleRejected)
      .addCase(fetchSubKnowledge.rejected, handleRejected)
      .addCase(fetchSubKnowledge.pending, handlePending);
  },
});

const handlePending = (state: SubKnowledgeState) => {
  state.status = RequestStatus.loading;
};
const handleFulfilled = (state: SubKnowledgeState) => {
  state.status = RequestStatus.succeeded;
};

const handleRejected = (state: SubKnowledgeState, action: any) => {
  state.status = RequestStatus.failed;
  state.error = action.error.message ?? "An error occurred";
};

export default SubKnowledgeslice.reducer;
