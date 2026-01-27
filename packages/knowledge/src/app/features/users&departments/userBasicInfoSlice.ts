import { experiences } from "./../../pages/knowledge/experts/components/TabelData";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ResponseModel } from "../../models/responseModel";
import {UserManagmentConsume} from "@4eplatform/shared/apis/user_management"
import { UserBasicInfoModel } from "../../models/UserBasicInfoModel";

export const fetchUserBasicInfo = createAsyncThunk<
  ResponseModel,
  number | string | Number
>(
  "userBasicInfo/fetchUserBasicInfo ",
  async (data: number | string | Number, thunkApi) => {
    try {
      const response = await UserManagmentConsume?.getBasicInformationByUserId(data);
      return response;
    } catch (err: any) {
      return thunkApi.rejectWithValue(err);
    }
  }
);
interface experiences {
  data: UserBasicInfoModel;
  status: string;
  message: string;
}
let initialState: experiences = {
  data: new UserBasicInfoModel(),
  status: "idle",
  message: "",
};

const userBasicInfoSlice = createSlice({
  name: "userBasicInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserBasicInfo.pending, (state: experiences) => {
        state.status = "loading";
      })
      .addCase(
        fetchUserBasicInfo.fulfilled,
        (state: experiences, action: PayloadAction<ResponseModel>) => {
          state.status = "succeeded";
          state.data = action.payload?.result as unknown as UserBasicInfoModel;
        }
      )
      .addCase(
        fetchUserBasicInfo.rejected,
        (state: experiences, action: PayloadAction<any>) => {
          state.status = "failed";
          state.message = action.payload?.message;
        }
      );
  },
});

export default userBasicInfoSlice.reducer;
