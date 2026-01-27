import { configureStore } from "@reduxjs/toolkit";
import toolbarReducer from "./features/toolbarSlice";
import { useDispatch } from "react-redux";
import favouritesListSlice from "./features/favouritesListSlice";
import postHiddenWorkspacesSlice from "./features/postHiddenWorkspacesSlice";
import deleteHiddenWorkspacesSlice from "./features/deleteHiddenWorkspacesSlice";
import getAllMyComponentsSlice from "./features/getAllMyComponentsSlice";
import getAllHiddenWorkspacesSlice from "./features/getAllHiddenWorkspacesSlice";

const store = configureStore({
  reducer: {
    toolbar: toolbarReducer,
    getFavouriteList: favouritesListSlice,
    postHiddenWorkspaces: postHiddenWorkspacesSlice,
    deleteHiddenWorkspaces: deleteHiddenWorkspacesSlice,
    myComponents: getAllMyComponentsSlice,
    hiddenWorkspaces: getAllHiddenWorkspacesSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
type DispatchFunc = () => AppDispatch;
export const useAppDispatch: DispatchFunc = useDispatch;
