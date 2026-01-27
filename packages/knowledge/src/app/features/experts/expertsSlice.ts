import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ResponseModel } from "../../models/responseModel";
import {AskExpertConsume} from "@4eplatform/shared/apis/ask_expert";
import { ExpertModel } from "../../models/getAllExpertsModel";
import { RequestStatus } from "../../enums/enums";
import { ExpertsBySpecializationIdModel } from "../../models/ExpertsBySpecializationIdModel";
import { KnowledgeAggConsume } from "@4eplatform/shared/apis/knowledge_agg";
import { QuestionsModel } from "../../models/Questions";

interface ExpertsState {
  data: ExpertModel[];
  expert: ExpertModel;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  totalpages: number;
  taotalItems: number;
  message: string;
  expertsBySpecializationId: ExpertsBySpecializationIdModel[];
  expertQuestions: QuestionsModel[];
}

const initialState: ExpertsState = {
  data: [],
  expert: new ExpertModel(
    0,
    "",
    "",
    "",
    "",
    "",
    "",
    [],
    0,
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    false,false
  ),
  status: "idle",
  error: null,
  totalpages: 1,
  taotalItems: 1,
  message: "",
  expertsBySpecializationId: [],
  expertQuestions: []
};

export const addExpertBasicInfo = createAsyncThunk<ResponseModel, any>(
  "experts/addExpertBasicInfo",
  async (data, thunkApi) => {
    try {
      const response = await AskExpertConsume.addExpertBasicInfo(data);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
export const editExpertBasicInfo = createAsyncThunk<ResponseModel, any>(
  "experts/editExpertBasicInfo",
  async (data, thunkApi) => {
    const objToFormData = (data: any) => {
      const formData = new FormData();
      for (let [key, value] of Object.entries(data)) {
        if (value)
          //@ts-ignore
          formData.append(key, value);
      }
      return formData;
    };
    let myBody={
      firstName: data.firstName,
      secondName: data.secondName,
      thirdName: data.thirdName,
      fourthName: data.fourthName,
      imgUrl: data.imgUrl,
      email: data.email,
      phoneNumber: data.phoneNumber,
      birthDate: data.birthDate,
      nationality: data.nationality,
      address: data.address,
      informationAboutExpert: data.informationAboutExpert,
      isExternalExpert: data.isExternalExpert,
  }
  let formBody = objToFormData(myBody);
    try {
      const response = await AskExpertConsume.editExpertBasicInfo({body:formBody,id:data?.id});
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
export const addExperiences = createAsyncThunk<ResponseModel, any>(
  "experts/addExperiences",
  async (data, thunkApi) => {
    try {
      const response = await AskExpertConsume.addExperience(data);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
export const editExperience = createAsyncThunk<ResponseModel, any>(
  "experts/editExperiences",
  async (data, thunkApi) => {
    try {
      let body={
          experienceName: data.experienceName,
          experienceYears: data.experienceYears,
          specializationId: data.specializationId,
          jobLocation: data.jobLocation,
          expertId:data.expertId, 
      }
      const response = await AskExpertConsume.putExperience({body,id:data?.id});
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
export const deleteExperience = createAsyncThunk<ResponseModel, any>(
  "experts/deleteExperience",
  async (data, thunkApi) => {
    try {
      const response = await AskExpertConsume.deleteExperience(data);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const getExperts = createAsyncThunk<ResponseModel, any>(
  "/Expert/GetAllExpertsPaginated",
  async (params: any = {}) => {
    const response = await AskExpertConsume.getAllExperts({
      pagesize: params?.pageSize,
      pagenumber: params?.pageNumber,
      searchTerm: params?.searchTerm,
      date: params?.date,
    });
    return response;
  }
);

export const addQuestion = createAsyncThunk<ResponseModel, any>(
  "question/addQuestion",
  async (body, thunkApi) => {
    try {
      const response = await AskExpertConsume.addQuestion(body);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const getExpertById = createAsyncThunk<
  ResponseModel,
  number | string | Number
>("getExpertById", async (data: number | string | Number, thunkApi) => {
  try {
    const response = await AskExpertConsume.getExpertById(data);

    return response;
  } catch (err: any) {
    return thunkApi.rejectWithValue(err);
  }
});

export const getExpertsBySpecializationId = createAsyncThunk<
  ResponseModel,
  number | string | Number
>(
  "getExpertsBySpecializationId",
  async (data: number | string | Number, thunkApi) => {
    
    try {
      const response = await AskExpertConsume.getExpertsBySpecializationId(data);
      
      return response;
    } catch (err: any) {
      return thunkApi.rejectWithValue(err);
    }
  }
);

export const deleteExpert = createAsyncThunk<ResponseModel, any>(
  "experts/deleteExpert",
  async (data, thunkApi) => {
    try {
      const response = await AskExpertConsume.deleteExpert(data);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchQuestionsByExpertId = createAsyncThunk<
  ResponseModel,
  { expertId: string; myparams?: any }
>("experts/fetchQuestionsByExpertId", async ({ expertId, myparams }) => {
  const response = await KnowledgeAggConsume.getQuestionsByExpertId({
      pageSize: myparams?.pageSize,
      pageNumber: myparams?.pageNumber,
      expertId,
  });
  return response;
});

const handlePending = (state: ExpertsState) => {
  state.status = RequestStatus.loading == 1 ? "loading" : "idle";
};
const handleFulfilled = (state: ExpertsState) => {
  state.status = RequestStatus.succeeded == 2 ? "succeeded" : "idle";
};

const handleRejected = (state: ExpertsState, action: any) => {
  state.status = RequestStatus.failed == 3 ? "failed" : "idle";
  state.error = action.error.message ?? "An error occurred";
};


const expertsSlice = createSlice({
  name: "experts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addQuestion.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(addQuestion.fulfilled, (state) => {
      state.status = 'succeeded';
      })
    .addCase(addQuestion.rejected, (state) => {
      state.status = 'failed';
      })
    .addCase(getExperts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getExperts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.result as unknown as ExpertModel[];
        state.totalpages = action.payload.totalPages as number;
        state.taotalItems = action.payload.totalItems as any;
      })
      .addCase(getExperts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "An error occurred";
      })

      .addCase(fetchQuestionsByExpertId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchQuestionsByExpertId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.expertQuestions = action.payload.result as unknown as QuestionsModel[];
        state.totalpages = action.payload.totalPages as any;
        state.taotalItems = action.payload.totalItems as any;
      })
      .addCase(fetchQuestionsByExpertId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "An error occurred";
      })

      // Get getExpertsBySpecializationId
      .addCase(getExpertsBySpecializationId.pending, (state: ExpertsState) => {
        state.status = "loading";
      })
      .addCase(
        getExpertsBySpecializationId.fulfilled,
        (state: ExpertsState, action: PayloadAction<ResponseModel>) => {
          state.status = "succeeded";
          state.expertsBySpecializationId = action.payload?.result as unknown as ExpertsBySpecializationIdModel[];
        }
      )
      .addCase(
        getExpertsBySpecializationId.rejected,
        (state: ExpertsState, action: PayloadAction<any>) => {
          state.status = "failed";
          state.message = action.payload?.message;
        }
      )

      // getExpertById
      .addCase(getExpertById.pending, (state: ExpertsState) => {
        state.status = "loading";
      })
      .addCase(
        getExpertById.fulfilled,
        (state: ExpertsState, action: PayloadAction<ResponseModel>) => {
          state.status = "succeeded";
          state.expert = action.payload?.result as unknown as ExpertModel;
        }
      )
      .addCase(
        getExpertById.rejected,
        (state: ExpertsState, action: PayloadAction<any>) => {
          state.status = "failed";
          state.message = action.payload?.message;
        }
      )
      .addCase(addExpertBasicInfo.pending, handlePending)
      .addCase(addExpertBasicInfo.fulfilled, handleFulfilled)
      .addCase(addExpertBasicInfo.rejected, handleRejected)
      .addCase(editExpertBasicInfo.pending, handlePending)
      .addCase(editExpertBasicInfo.fulfilled, handleFulfilled)
      .addCase(editExpertBasicInfo.rejected, handleRejected)
      .addCase(addExperiences.pending, handlePending)
      .addCase(addExperiences.fulfilled, handleFulfilled)
      .addCase(addExperiences.rejected, handleRejected)
      .addCase(editExperience.pending, handlePending)
      .addCase(editExperience.fulfilled, handleFulfilled)
      .addCase(editExperience.rejected, handleRejected)
      .addCase(deleteExperience.pending, handlePending)
      .addCase(deleteExperience.fulfilled, handleFulfilled)
      .addCase(deleteExperience.rejected, handleRejected)
      .addCase(deleteExpert.pending, handlePending)
      .addCase(deleteExpert.fulfilled, handleFulfilled)
      .addCase(deleteExpert.rejected, handleRejected);
  },
});

export default expertsSlice.reducer;
