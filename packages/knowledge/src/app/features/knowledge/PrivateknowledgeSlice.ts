import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseModel } from "../../models/responseModel";
import { Knowledge, AllKnowledge } from "../../models/Knowledge";
import { KnowledgeConsume } from "@4eplatform/shared/apis/knowledge";
import { KnowledgeAggConsume } from "@4eplatform/shared/apis/knowledge_agg";
import { UserManagmentConsume } from "@4eplatform/shared/apis/user_management";
import { userRoleModel } from "../../models/user-role-model";

interface KnowledgeState {
  data: AllKnowledge;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  userRoles: userRoleModel[];
}

const initialState: KnowledgeState = {
  data: new AllKnowledge(null, [], 0, 0, 0, 0),
  status: "idle",
  error: "",
  userRoles: [],
};

export const getKnowledgeById = createAsyncThunk<ResponseModel, any>(
  "Knowledge/getKnowledgeById",
  async (params, thunkApi) => {
    try {
      const response = await KnowledgeConsume.getKnowledgeById(
        `${params?.knowledgeId}?knowledgeType=0`
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

// export const fetchPrivateKnowledges = createAsyncThunk<ResponseModel, any>(
//   "knowledge/fetchPrivateKnowledge",
//   async (params, thunkApi) => {
//     try {
//       const response = await KnowledgeConsume.getPrivateKnowledge(params);
//       return response;
//     } catch (error) {
//       return thunkApi.rejectWithValue(error);
//     }
//   }
// );

export const fetchPrivateKnowledges = createAsyncThunk<ResponseModel, any>(
  "knowledge/fetchPrivateKnowledge",
  async (params, thunkApi) => {
    try {
      const response = await KnowledgeAggConsume.getPrivateKnowledge(params);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchUserRoles = createAsyncThunk<ResponseModel, any>(
  "Privateknowledge/fetchUserRoles",
  async (data: any, thunkApi) => {
    try {
      const response = await UserManagmentConsume?.getAllUserRoles(data.id, {
        pageSize: data?.pageSize,
        pageNumber: data?.pageNumber,
      });
      return response;
    } catch (err: any) {
      return thunkApi.rejectWithValue(err?.message);
    }
  }
);

const PrivateknowledgeSlice = createSlice({
  name: "Privateknowledge",
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
        state?.data?.knowledges?.push(action.payload?.result as Knowledge);
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
          (knowledge) => knowledge.id !== action.payload.knowledgeId
        ) as Knowledge[];
      })
      .addCase(removeKnowledge.rejected, (state) => {
        state.status = "failed";
      })

      .addCase(fetchUserRoles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserRoles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userRoles = action.payload?.result as userRoleModel[];
      })
      .addCase(fetchUserRoles.rejected, (state, action) => {
        state.status = "failed";
      })

      //Fetch knowledges

      .addCase(fetchPrivateKnowledges.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPrivateKnowledges.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = {
          knowledges: action.payload?.result ?? [],
          pageIndex: action.payload?.pageIndex,
          pageSize: action.payload?.pageSize,
          totalItems: action.payload?.totalItems,
          totalPages: action.payload?.totalPages,
        };
      })
      .addCase(fetchPrivateKnowledges.rejected, (state) => {
        state.status = "failed";
      });
  },
});
export default PrivateknowledgeSlice.reducer;
