import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AnyAction, PayloadAction, ThunkDispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";
import { API } from "../utils/API";

export interface UserState {
  data: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchData = createAsyncThunk<
  any,
  { id: string },
  { rejectValue: any }
>("organization", async ({ id }, thunkAPI) => {
  try {
    const response = await axios.get(`${API}/organization/${id}`);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchData.fulfilled, (state, action: PayloadAction<any>) => {
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchData.rejected, (state, action: PayloadAction<any>) => {
        state.data = null;
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
export type AppThunkDispatch = ThunkDispatch<RootState, unknown, AnyAction>;
