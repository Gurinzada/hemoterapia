import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { appointmentPaginated } from "../../utils/appointment";
import type { loading } from "../../utils/loading";
import api from "../../api/api";
import { isAxiosError } from "axios";

interface appointmentState {
    appointments: appointmentPaginated;
    loading: loading;
    error: string | null;
}

const initialState: appointmentState = {
    appointments: {
        appointments: [],
        lastPage: 1,
        page: 1,
        total: 0
    },
    loading: "iddle",
    error: null
}

interface fetchMyAppointmentsProps {
    limit:number;
    page: number;
}

export const fetchMyAppointments = createAsyncThunk(
    "appointment/fetchMyAppointments",
    async ({limit = 10, page = 1 }:fetchMyAppointmentsProps, { rejectWithValue }) => {
        try {
            const response = await api.get(`appointment/paginated?limit=${limit}&page=${page}`);
            return response.data as appointmentPaginated;
        } catch (error) {
            if(isAxiosError(error)) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue(error);
            }
        }
    }
);

const appointmentSlice = createSlice({
    name: "appointment",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
        .addCase(fetchMyAppointments.pending, (state) => {
            state.loading = "pending";
            state.error = null;
        })
        .addCase(fetchMyAppointments.fulfilled, (state, action) => {
            state.appointments = action.payload as appointmentPaginated;
            state.loading = "sucess";
        })
        .addCase(fetchMyAppointments.rejected, (state, action) => {
            state.loading = "failed";
            state.error = action.payload as string;
        })
    },
});

export default appointmentSlice.reducer;