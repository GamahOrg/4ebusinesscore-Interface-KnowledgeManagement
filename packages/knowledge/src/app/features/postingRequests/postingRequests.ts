import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseModel } from "../../models/responseModel";
import {KnowledgeAggConsume} from "@4eplatform/shared/apis/knowledge_agg";
import { QuestionsArrayModel, QuestionsModel } from "../../models/Questions";
import { RequestStatus } from "../../enums/enums";
import { AskExpertConsume } from "@4eplatform/shared/apis/ask_expert";
import { ControlPanelAggConsume } from "@4eplatform/shared/apis/control_panel_agg";

interface PartsState {
    data:  any;
    loading: boolean;
    error: null | string;
  }
  
  // Replace 'YourPartsDataType' with the actual type of your Parts data
  
  // Define the initial state
  const initialState: PartsState = {
    data: [],
    loading: false,
    error: null,
  };

  

export const fetchRequestsRoles = createAsyncThunk<any, string>(
    'postingRequests/fetchRequestsRoles',
    async (id, { rejectWithValue }) => {
      try {
     
        // const response = await userAggregatorApiConsume.getParts(id)
        const response = await ControlPanelAggConsume.getMyWorkspaces({componentId:id})
  
        return response.result;
      } catch (error:any) {
        // Handle errors and provide meaningful error messages
        return rejectWithValue(error.message || 'Failed to fetch Parts');
      }
    }
  );


const postingRequestsSlice = createSlice({
  name: "postingRequests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchRequestsRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequestsRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action?.payload ;
      })
      .addCase(fetchRequestsRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});


export default postingRequestsSlice.reducer;
