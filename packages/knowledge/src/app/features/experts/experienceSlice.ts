import { experiences } from "./../../pages/knowledge/experts/components/TabelData";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ResponseModel } from "../../models/responseModel";
import {AskExpertConsume} from "@4eplatform/shared/apis/ask_expert";
import { ExperienceModel } from "../../models/experienceModel";

export const fetchExperiencesForExpert = createAsyncThunk<
  ResponseModel,
  number | string | Number
>(
  "experiences/fetchExperiences",
  async (data: number | string | Number, thunkApi) => {
    try {
      const response = await AskExpertConsume?.getExperienceByExpertId(data);
      return response;
    } catch (err: any) {
      return thunkApi.rejectWithValue(err);
    }
  }
);
interface experiences {
  data: ExperienceModel[];
  status: string;
  message: string;
}
let initialState: experiences = {
  data: [],
  status: "idle",
  message: "",
};

const expertExperienceSlice = createSlice({
  name: "experiences",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExperiencesForExpert.pending, (state: experiences) => {
        state.status = "loading";
      })
      .addCase(
        fetchExperiencesForExpert.fulfilled,
        (state: experiences, action: PayloadAction<ResponseModel>) => {
          state.status = "succeeded";
          state.data = action.payload?.result as unknown as ExperienceModel [];
        }
      )
      .addCase(
        fetchExperiencesForExpert.rejected,
        (state: experiences, action: PayloadAction<any>) => {
          state.status = "failed";
          state.message = action.payload?.message;
        }
      );
  },
});

export default expertExperienceSlice.reducer;
