import { configureStore, Store } from "@reduxjs/toolkit";
import userSlice from "./userSlice";

export const store: Store = configureStore({
  reducer: {
    userData: userSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
