import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseModel } from "../../models/responseModel";
import {AskExpertConsume} from "@4eplatform/shared/apis/ask_expert";
import { SpecializationModel } from "../../models/specializationsModel";


interface SpecializationsState {
  data: SpecializationModel[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: SpecializationsState = {
  data: [],
  status: "idle",
  error: null,
};


export const getSpecializations = createAsyncThunk<ResponseModel, any>(
  "specializations/getAllSpecializations",
  async () => {
    const response = await AskExpertConsume.getAllSpecializations();
    return response;
  }
);

const specializationsSlice = createSlice({
  name: "specializations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSpecializations.pending, (state) => {
      state.status = "loading";
    })
    .addCase(getSpecializations.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.data = action.payload.result as unknown as SpecializationModel[];
    })
    .addCase(getSpecializations.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message ?? "An error occurred";
    })
  },
});


export default specializationsSlice.reducer;
