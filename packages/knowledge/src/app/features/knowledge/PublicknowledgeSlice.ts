import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseModel } from "../../models/responseModel";
import { KnowledgeConsume } from "@4eplatform/shared/apis/knowledge";
import { Knowledge, AllKnowledge } from "../../models/Knowledge";

interface KnowledgeState {
  data: AllKnowledge;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: KnowledgeState = {
  data: new AllKnowledge(null, [], 0, 0, 0, 0),
  status: "idle",
  error: "",
};

export const getKnowledgeById = createAsyncThunk<ResponseModel, any>(
  "Knowledge/getKnowledgeById",
  async (params, thunkApi) => {
    try {
      const response = await KnowledgeConsume.getKnowledgeById(
        `${params?.knowledgeId}?knowledgeType=1`
      );
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const addKnowledge = createAsyncThunk<ResponseModel, any>(
  "Knowledge/addKnowledge",
  async (data, thunkApi) => {
    try {
      const response = await KnowledgeConsume.addKnowledge(data);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const editKnowledge = createAsyncThunk<ResponseModel, any>(
  "Knowledge/editKnowledge",
  async (data, thunkApi) => {
    try {
      const response = await KnowledgeConsume.editKnowledge(data);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const removeKnowledge = createAsyncThunk<any, any>(
  "Knowledge/removeKnowledge",
  async (knowledgeId, thunkApi) => {
    try {
      const response = await KnowledgeConsume.removeKnowledge(knowledgeId);
      const result = { response, knowledgeId };
      return result;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchPublicKnowledges = createAsyncThunk<ResponseModel, any>(
  "knowledge/fetchPublicKnowledge",
  async (params, thunkApi) => {
    try {
      const response = await KnowledgeConsume.getPublicKnowledge(params);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

const PublicknowledgeSlice = createSlice({
  name: "Publicknowledge",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getKnowledgeById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getKnowledgeById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.knowledge = action.payload?.result as Knowledge;
      })
      .addCase(getKnowledgeById.rejected, (state, action) => {
        state.status = "failed";
      })

      // Add knowledge
      .addCase(addKnowledge.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addKnowledge.fulfilled, (state, action) => {
        state.status = "succeeded";
        const newKnowledge = action?.meta?.arg as Knowledge;
        state?.data?.knowledges?.push(newKnowledge);
      })
      .addCase(addKnowledge.rejected, (state, action) => {
        state.status = "failed";
      })

      .addCase(editKnowledge.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editKnowledge.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.knowledge = action.payload.result as Knowledge;
      })
      .addCase(editKnowledge.rejected, (state, action) => {
        state.status = "failed";
      })

      .addCase(removeKnowledge.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeKnowledge.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.knowledges = state.data?.knowledges?.filter(
          (knowledge) => +knowledge.id !== +action.payload.knowledgeId
        ) as Knowledge[];
      })
      .addCase(removeKnowledge.rejected, (state) => {
        state.status = "failed";
      })

      //Fetch knowledges
      .addCase(fetchPublicKnowledges.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPublicKnowledges.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = {
          knowledges: action.payload?.result ?? [],
          pageIndex: action.payload?.pageIndex,
          pageSize: action.payload?.pageSize,
          totalItems: action.payload?.totalItems,
          totalPages: action.payload?.totalPages,
        };
      })
      .addCase(fetchPublicKnowledges.rejected, (state) => {
        state.status = "failed";
      });
  },
});
export default PublicknowledgeSlice.reducer;
