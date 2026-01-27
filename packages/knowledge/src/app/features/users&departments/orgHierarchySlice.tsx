import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ResponseModel } from "../../models/responseModel";
import { OrgHierarchyModel } from "../../models/OrgHierarchyModel";
import { ControlPanelAggConsume } from "@4eplatform/shared/apis/control_panel_agg";
import { OrgConsume } from "@4eplatform/shared/apis/org";


export const fetchOrgs= createAsyncThunk<ResponseModel,object|undefined>(
  "orgs/fetchorgs",
  async (params = {}, thunkApi) => {
    try {
    const response = await ControlPanelAggConsume.getEmployee({params});
    return response;
    }catch (error) {
    return thunkApi.rejectWithValue(error);
  }
  }
);

export const fetchOrgsWithMembers= createAsyncThunk<ResponseModel,any>(
  "orgs/fetchOrgsWithMembers",
  async (data, thunkApi) => {
    try {
    const response = await OrgConsume.getAllOrgWithMembersHierarchy();
    return response;
    }catch (error) {
    return thunkApi.rejectWithValue(error);
  }
  }
);
export const fetchOrgsToHandleSearch= createAsyncThunk<ResponseModel,any>(
  "orgs/fetchOrgsToHandleSearch",
  async (params = {}, thunkApi) => {
    try {
    const response = await ControlPanelAggConsume.getEmployee(params);
    return response;
    }catch (error) {
    return thunkApi.rejectWithValue(error);
  }
  }
);

interface OrgHierarchy {
  data: OrgHierarchyModel[];
  status: string;
  message: string;
  orgs: OrgHierarchyModel[];
}
let initialState: OrgHierarchy = {
  data: [],
  status: "idle",
  message: "",
  orgs:[],
};

const orgHierarchySlice = createSlice({
  name: "OrgHierarchy",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrgs.pending, (state: OrgHierarchy) => {
        state.status = "loading";
      })
      .addCase(
        fetchOrgs.fulfilled,
        (state: OrgHierarchy, action: PayloadAction<ResponseModel>) => {
          state.status = "succeeded";
          state.data = action.payload.result as OrgHierarchyModel[];
 
        }
      )
      .addCase(
        fetchOrgs.rejected,
        (state: OrgHierarchy, action: PayloadAction<any>) => {
          state.status = "failed";
          state.message = action.payload?.message;
        }
      ).addCase(fetchOrgsWithMembers.pending, (state: OrgHierarchy) => {
        state.status = "loading";
      }).addCase(
        fetchOrgsWithMembers.fulfilled,
        (state: OrgHierarchy, action: PayloadAction<ResponseModel>) => {
          state.status = "succeeded";
          state.data = action.payload.result as OrgHierarchyModel[];
 
        }
      ).addCase(
        fetchOrgsWithMembers.rejected,
        (state: OrgHierarchy, action: PayloadAction<any>) => {
          state.status = "failed";
          state.message = action.payload?.message;
        }
      )
      .addCase(fetchOrgsToHandleSearch.pending, (state: OrgHierarchy) => {
        state.status = "loading";
      })
      .addCase(
        fetchOrgsToHandleSearch.fulfilled,
        (state: OrgHierarchy, action: PayloadAction<ResponseModel>) => {
          state.status = "succeeded";
          state.orgs = action.payload.result as OrgHierarchyModel[];
 
        }
      )
      .addCase(
        fetchOrgsToHandleSearch.rejected,
        (state: OrgHierarchy, action: PayloadAction<any>) => {
          state.status = "failed";
          state.message = action.payload?.message;
        }
      )
  },
});

export default orgHierarchySlice.reducer;
