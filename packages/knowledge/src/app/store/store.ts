import { configureStore } from "@reduxjs/toolkit";
import ideaSlice from "../features/idea/ideaSlice";
import knowledgePostingSlice from "../features/idea/knowledgePostingSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import knowledgeCategorySlice from "../features/knowledge/knowledgeCategorySlice";
import blogSlice from "../features/blog/blogSlice";
import subKnowledgeSlice from "../features/knowledge/subKnowledgeSlice";
import orgHierarchySlice from "../features/users&departments/orgHierarchySlice";
import challengeSlice from "../features/challenge/challengeSlice";
import commentSlice from "../features/comments/commentSlice";
import expertsSlice from "../features/experts/expertsSlice";
import questionSlice from "../features/questions/questionSlice";
import postingRequestsSlice from "../features/postingRequests/postingRequests";
import userSlice from "../features/users&departments/userSlice";
import specializationsSlice from "../features/experts/specializationsSlice";
import userExperiencesSlice from "../features/users&departments/userExperiencesSlice";
import userBasicInfoSlice from "../features/users&departments/userBasicInfoSlice";
import expertExperienceSlice from "../features/experts/experienceSlice";
import expertsWithoutPaginationSlice from "../features/experts/expertsWithoutPaginationSlice";
import PrivateknowledgeSlice from "../features/knowledge/PrivateknowledgeSlice";
import PublicknowledgeSlice from "../features/knowledge/PublicknowledgeSlice";
import usersSlice from "../features/users&departments/usersSlice";
import rolesSlice from "../features/users&departments/rolesSlice";
import orgsSlice from "../features/users&departments/orgsSlice";
import getAllOrgsSlice from "../features/users&departments/getAllOrgsSlice";
import getAllMyComponents from "../features/getAllMyComponentsSlice";
import { storeRegistry } from "@4eplatform/shared/store/storeRegistry";
import knowledgeIndicatorsSlice from "../features/indicators/indicatorsSlice";
import getAllHiddenWorkspacesSlice from "../features/getAllHiddenWorkspacesSlice";
import favouritesListSlice from "../features/favouritesListSlice";
import postHiddenWorkspacesSlice from "../features/postHiddenWorkspacesSlice";
import deleteHiddenWorkspacesSlice from "../features/deleteHiddenWorkspacesSlice";

const store = storeRegistry.createStore({
  ideas: ideaSlice,
  comments: commentSlice,
  blogs: blogSlice,
  knowledgePosting: knowledgePostingSlice,
  Privateknowledge: PrivateknowledgeSlice,
  Publicknowledge: PublicknowledgeSlice,
  knowledgeCategory: knowledgeCategorySlice,
  SubKnowledges: subKnowledgeSlice,
  orgHierarchy: orgHierarchySlice,
  challenges: challengeSlice,
  experts: expertsSlice,
  questions: questionSlice,
  specializations: specializationsSlice,
  user: userSlice,
  userExperience: userExperiencesSlice,
  userBasicInfo: userBasicInfoSlice,
  expertExperience: expertExperienceSlice,
  expertsWithoutPagination: expertsWithoutPaginationSlice,
  users: usersSlice,
  postingRequests: postingRequestsSlice,
  roles: rolesSlice,
  orgs: orgsSlice,
  managements: getAllOrgsSlice,
  myComponents: getAllMyComponents,
  knowledgeIndicators: knowledgeIndicatorsSlice,
  hiddenWorkspaces: getAllHiddenWorkspacesSlice,
  getFavouriteList: favouritesListSlice,
  postHiddenWorkspaces: postHiddenWorkspacesSlice,
  deleteHiddenWorkspaces: deleteHiddenWorkspacesSlice,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

type DispatchFunc = () => AppDispatch;
export const useAppDispatch: DispatchFunc = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
