import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ResponseModel } from "../../models/responseModel";
import { OrgHierarchyModel } from "../../models/OrgHierarchyModel";
import { OrgConsume } from "@4eplatform/shared/apis/org";



export const fetchAllOrgs = createAsyncThunk<ResponseModel, any>(
  "AllOrgHierarchy/fetchAllOrgs",
  async (params = {}, thunkApi) => {
    try {
      const response = await OrgConsume.getAllOrgsBySearch(params);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

interface OrgHierarchy {
  status: string;
  message: string;
  orgs: OrgHierarchyModel[];
}
let initialState: OrgHierarchy = {
  status: "idle",
  message: "",
  orgs: [],
};

const getAllOrgsSlice = createSlice({
  name: "AllOrgHierarchy",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrgs.pending, (state: OrgHierarchy) => {
        state.status = "loading";
      })
      .addCase(
        fetchAllOrgs.fulfilled,
        (state: OrgHierarchy, action: PayloadAction<ResponseModel>) => {
          state.status = "succeeded";
          state.orgs = action.payload.result as OrgHierarchyModel[];
        }
      )
      .addCase(
        fetchAllOrgs.rejected,
        (state: OrgHierarchy, action: PayloadAction<any>) => {
          state.status = "failed";
          state.message = action.payload?.message;
        }
      );
  },
});

export default getAllOrgsSlice.reducer;
