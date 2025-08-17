import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { loading } from "../../utils/loading";
import type { user, UserRole } from "../../utils/user";
import api from "../../api/api";
import { isAxiosError } from "axios";

interface userState {
  user: user;
  loading: loading;
  error: string | null;
}

const initialState: userState = {
  error: null,
  loading: "iddle",
  user: {
    id: null as unknown as number,
    createdAt: null as unknown as Date,
    deletedAt: null,
    email: "",
    role: null as unknown as UserRole,
    updateAt: null as unknown as Date,
    userName: "",
  },
};

export const fetchMyProfileUser = createAsyncThunk(
  "user/fetchMyUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("users/my");
      if (response.status === 200) {
        return response.data as user;
      }
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message);
      }
      return rejectWithValue(error);
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearStateUser(state) {
      state.error = null;
      state.loading = "iddle";
      state.user = {
        id: null as unknown as number,
        createdAt: null as unknown as Date,
        deletedAt: null,
        email: "",
        role: null as unknown as UserRole,
        updateAt: null as unknown as Date,
        userName: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyProfileUser.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchMyProfileUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
        }
        state.loading = "sucess";
        state.error = null;
      })
      .addCase(fetchMyProfileUser.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearStateUser } = usersSlice.actions;

export default usersSlice.reducer;
