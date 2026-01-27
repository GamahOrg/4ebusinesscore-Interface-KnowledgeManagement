import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseModel } from "../../models/responseModel";
import { KnowledgeAggConsume } from "@4eplatform/shared/apis/knowledge_agg";
import { QuestionsArrayModel, QuestionsModel } from "../../models/Questions";
import { RequestStatus } from "../../enums/enums";
import { AskExpertConsume } from "@4eplatform/shared/apis/ask_expert";

interface QuestionSlicesState {
  data: QuestionsArrayModel;
  outgoingQuestions: QuestionsModel[];
  incomingQuestions: QuestionsModel[];
  status: RequestStatus;
  error: string | null;
  totalpages: number;
  taotalItems: number;
  statusForIncoming: string;
  totalPagesForIncoming: number;
  totalItemsForIncoming: number;
  messageForIncoming: string;
  pageSizeForIncoming: number;
  pageIndexForIncoming: number;
  statusForOutgoing: string;
  totalPagesForOutgoing: number;
  totalItemsForOutgoing: number;
  messageForOutgoing: string;
  pageSizeForOutgoing: number;
  pageIndexForOutgoing: number;
  questionDetails: QuestionsModel;
}

const initialState: QuestionSlicesState = {
  data: new QuestionsArrayModel(),
  outgoingQuestions: [],
  incomingQuestions: [],
  status: RequestStatus.idle,
  error: null,
  totalpages: 1,
  taotalItems: 1,
  statusForIncoming: "",
  totalPagesForIncoming: 0,
  totalItemsForIncoming: 0,
  messageForIncoming: "",
  pageSizeForIncoming: 0,
  pageIndexForIncoming: 0,
  statusForOutgoing: "",
  totalPagesForOutgoing: 0,
  totalItemsForOutgoing: 0,
  messageForOutgoing: "",
  pageSizeForOutgoing: 0,
  pageIndexForOutgoing: 0,
  questionDetails: new QuestionsModel(),
};

export const fetchExpertsQuestions = createAsyncThunk<ResponseModel, any>(
  "Experts/fetchQuestions",
  async (params: any = {}, thunkApi) => {
    try {
      const response = await KnowledgeAggConsume.getAllExpertsQuestions({
        searchTerm: params?.searchTerm,
        pagesize: params?.pageSize,
        pagenumber: params?.pageNumber,
      });
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
export const fetchIncomingQuestions = createAsyncThunk<ResponseModel, any>(
  "Experts/fetchIncomingQuestions",
  async (params = {}, thunkApi) => {
    try {
      const response =
        await KnowledgeAggConsume.getAllIncomingQuestions(params);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
export const fetchOutgoingQuestions = createAsyncThunk<ResponseModel, any>(
  "Experts/fetchOutgoingQuestions",
  async (params = {}, thunkApi) => {
    try {
      const response =
        await KnowledgeAggConsume.getAllOutgoingQuestions(params);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchExpertsQuestion = createAsyncThunk<ResponseModel, any>(
  "Experts/fetchQuestion",
  async (questionId: string, thunkApi) => {
    try {
      const response = await KnowledgeAggConsume.getRequestedQuestionById(questionId);
      return response;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const deleteQuestion = createAsyncThunk<ResponseModel, any>(
  "Experts/deleteQuestion",
  async (data, thunkApi) => {
    try {
      const response = await AskExpertConsume.deleteQuestion(data);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const editQuestion = createAsyncThunk<ResponseModel, any>(
  "Experts/editQuestion",
  async (data, thunkApi) => {
    try {
      const response = await AskExpertConsume.editQuestion(
        data.body?.body,
        data.id
      );
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const getRequestedQuestionById = createAsyncThunk<ResponseModel, string>(
  "expertsQuestions/getRequestedQuestionById",
  async (questionId: string, thunkApi) => {
    try {
      const response = await KnowledgeAggConsume.getRequestedQuestionById(questionId);
      return response;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

const questionSlice = createSlice({
  name: "expertsQuestions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpertsQuestions.fulfilled, (state, action) => {
        state.status = RequestStatus.succeeded;
        state.data.questions = action.payload?.result as QuestionsModel[];
        state.data.pageIndex = action.payload?.pageIndex;
        state.data.pageSize = action.payload?.pageSize;
        state.data.totalItems = action.payload?.totalItems;
        state.data.totalPages = action.payload?.totalPages;
        state.data.pageIndex = action.payload?.pageIndex;
      })
      .addCase(fetchExpertsQuestion.fulfilled, (state, action) => {
        state.status = RequestStatus.succeeded;
        state.data.question = action.payload.result as QuestionsModel;
      })
      .addCase(fetchExpertsQuestions.pending, handlePending)
      .addCase(fetchExpertsQuestion.rejected, handleRejected)
      .addCase(fetchExpertsQuestion.pending, handlePending)
      .addCase(fetchExpertsQuestions.rejected, handleRejected)
      .addCase(deleteQuestion.fulfilled, handlePending)
      .addCase(deleteQuestion.pending, handleFulfilled)
      .addCase(deleteQuestion.rejected, handleRejected)
      .addCase(editQuestion.fulfilled, handlePending)
      .addCase(editQuestion.pending, handleFulfilled)
      .addCase(editQuestion.rejected, handleRejected)
      .addCase(fetchIncomingQuestions.fulfilled, (state, action) => {
        state.statusForIncoming = "succeeded";
        state.incomingQuestions = action.payload
          .result as unknown as QuestionsModel[];
        state.totalPagesForIncoming = action.payload.totalPages;
        state.totalItemsForIncoming = action.payload.totalItems;
        state.pageIndexForIncoming = action.payload.pageIndex;
        state.pageSizeForIncoming = action.payload.pageSize;
      })
      .addCase(fetchOutgoingQuestions.fulfilled, (state, action) => {
        state.statusForOutgoing = "succeeded";
        state.outgoingQuestions = action.payload
          .result as unknown as QuestionsModel[];
        state.totalPagesForOutgoing = action.payload.totalPages;
        state.totalItemsForOutgoing = action.payload.totalItems;
        state.pageIndexForOutgoing = action.payload.pageIndex;
        state.pageSizeForOutgoing = action.payload.pageSize;
      })
      .addCase(getRequestedQuestionById.fulfilled, (state, action) => {
        state.status = RequestStatus.succeeded;
        state.questionDetails = action.payload?.result as QuestionsModel;
      })
      .addCase(getRequestedQuestionById.pending, handlePending)
      .addCase(getRequestedQuestionById.rejected, handleRejected)
  },
});

const handlePending = (state: QuestionSlicesState) => {
  state.status = RequestStatus.loading;
};
const handleFulfilled = (state: QuestionSlicesState) => {
  state.status = RequestStatus.succeeded;
};

const handleRejected = (state: QuestionSlicesState, action: any) => {
  state.status = RequestStatus.failed;
  state.error = action.error.message ?? "An error occurred";
};

export default questionSlice.reducer;
