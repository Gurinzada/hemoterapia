import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { clientPaginated } from "../../utils/client";
import type { loading } from "../../utils/loading";
import { isAxiosError } from "axios";
import api from "../../api/api";

interface clientState {
  client: clientPaginated;
  loading: loading;
  error: string | null;
}

const initialState: clientState = {
  client: {
    clients: [],
    lastPage: 0,
    page: 1,
    total: 0
  },
  error: null,
  loading: "iddle",
};

interface myClientsProps {
    limit:number;
    page: number;
}

export const fetchMyClients = createAsyncThunk(
  "clients/fetchMyClients",
  async ({limit = 10, page = 1}: myClientsProps, { rejectWithValue }) => {
    try {
        const response = await api.get(`clients/paginated?limit=${limit}&page=${page}`);
        return response.data as clientPaginated;
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message);
      }
      return rejectWithValue(error);
    }
  }
);

const clientsSlice = createSlice({
    name: "clients",
    initialState,
    reducers: {
        clearStateClients(state) {
            state.error = null;
            state.loading = "iddle";
            state.client = {
                clients: [],
                lastPage: 0,
                page: 1,
                total: 0
            }
        }
    },
    extraReducers(builder) {
        builder
        .addCase(fetchMyClients.pending, (state) => {
            state.loading = "pending";
            state.error = null
        })
        .addCase(fetchMyClients.fulfilled, (state, action) => {
            state.error = null;
            state.loading = "sucess";
            state.client = action.payload;
        })
        .addCase(fetchMyClients.rejected, (state, action) => {
            state.error = action.payload as string;
            state.loading = "failed";
        })
    },
})


export const { clearStateClients } = clientsSlice.actions;

export default clientsSlice.reducer;