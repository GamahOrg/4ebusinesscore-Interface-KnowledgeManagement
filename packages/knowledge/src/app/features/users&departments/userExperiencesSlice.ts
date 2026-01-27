import { experiences } from "./../../pages/knowledge/experts/components/TabelData";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ResponseModel } from "../../models/responseModel";
import {UserManagmentConsume} from "@4eplatform/shared/apis/user_management"
import { UserExperienceModel } from "../../models/UserExperienceModel";

export const fetchUserExperiences = createAsyncThunk<
  ResponseModel,
  number | string | Number
>(
  "userExperiences/fetchUserExperiences",
  async (data: number | string | Number, thunkApi) => {
    try {
      const response = await UserManagmentConsume?.getUserExperienceByUserId(data);
      return response;
    } catch (err: any) {
      return thunkApi.rejectWithValue(err);
    }
  }
);
interface experiences {
  data: UserExperienceModel;
  status: string;
  message: string;
}
let initialState: experiences = {
  data: new UserExperienceModel(),
  status: "idle",
  message: "",
};

const userExperiencesSlice = createSlice({
  name: "userExperiences",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserExperiences.pending, (state: experiences) => {
        state.status = "loading";
      })
      .addCase(
        fetchUserExperiences.fulfilled,
        (state: experiences, action: PayloadAction<ResponseModel>) => {
          state.status = "succeeded";
          state.data = action.payload?.result as unknown as UserExperienceModel;
        }
      )
      .addCase(
        fetchUserExperiences.rejected,
        (state: experiences, action: PayloadAction<any>) => {
          state.status = "failed";
          state.message = action.payload?.message;
        }
      );
  },
});

export default userExperiencesSlice.reducer;
