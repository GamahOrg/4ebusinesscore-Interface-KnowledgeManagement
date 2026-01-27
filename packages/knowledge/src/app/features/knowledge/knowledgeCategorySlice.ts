import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseModel } from "../../models/responseModel";
import { Category, Categories } from "../../models/KnowledgeCategories";
import { KnowledgeConsume } from "@4eplatform/shared/apis/knowledge";

interface KnowledgeState {
  data: Categories;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: KnowledgeState = {
  data: new Categories(),
  status: "idle",
  error: "",
};

export const fetchKnowledgesCategories = createAsyncThunk<ResponseModel, any>(
  "knowledge/fetchKnowledgeCategories",
  async (params = {}, thunkApi) => {
    try {
      const response = await KnowledgeConsume.getKnowledgeCategory(params);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
export const fetchSubKnowledgesCategories = createAsyncThunk<ResponseModel, any>(
  "knowledge/fetchSubKnowledgeCategories",
  async (params = {}, thunkApi) => {
    try {
      const response = await KnowledgeConsume.getSubKnowledgeCategory(params);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

const knowledgeSlice = createSlice({
  name: "knowledge",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      //Fetch knowledges
      .addCase(fetchKnowledgesCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchKnowledgesCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.Categories = action.payload?.result as Category[];
        state.data.pageIndex = action.payload?.pageIndex;
        state.data.pageSize = action.payload?.pageSize;
        state.data.totalItems = action.payload?.totalItems;
      })
      .addCase(fetchKnowledgesCategories.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchSubKnowledgesCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSubKnowledgesCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.Categories = action.payload?.result as Category[];
        state.data.pageIndex = action.payload?.pageIndex;
        state.data.pageSize = action.payload?.pageSize;
        state.data.totalItems = action.payload?.totalItems;
      })
      .addCase(fetchSubKnowledgesCategories.rejected, (state) => {
        state.status = "failed";
      });
  },
});
export default knowledgeSlice.reducer;
