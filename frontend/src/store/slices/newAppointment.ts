import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  appointmentFields,
  AppointmentStatus,
} from "../../utils/appointment";
import type { loading } from "../../utils/loading";
import api from "../../api/api";
import axios from "axios";

interface appointmentState {
  appointmentFields: appointmentFields;
  loading: loading;
  error: string | null;
}

const initialState: appointmentState = {
  appointmentFields: {
    appointmentValue: null as unknown as number,
    date: null as unknown as string,
    clientid: null as unknown as number,
    paid: false,
    paymentMethod: null as unknown as string,
    status: null as unknown as AppointmentStatus,
  },
  error: null,
  loading: "iddle",
};

export const createAppointment = createAsyncThunk(
  "appointment/createAppointment",
  async (appointment: appointmentFields, { rejectWithValue }) => {
    try {
      const response = await api.post(`appointment/${appointment.clientid}`, {
        ...appointment,
      });
      return response.data as appointmentFields;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data);
      } else {
        return rejectWithValue(error);
      }
    }
  }
);

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    setFieldsAppoitment(state, action: PayloadAction<appointmentFields>) {
      console.log(action.payload + " " + action.type)
      state.appointmentFields = action.payload;
      console.log(state.appointmentFields)
    },
    clearAppointmentFields(state) {
      state.appointmentFields = {
        appointmentValue: null as unknown as number,
        date: null as unknown as string,
        clientid: null as unknown as number,
        paid: false,
        paymentMethod: null as unknown as string,
        status: null as unknown as AppointmentStatus,
      };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(createAppointment.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state) => {
        state.loading = "sucess";
        state.appointmentFields = {
          appointmentValue: null as unknown as number,
          date: null as unknown as string,
          clientid: null as unknown as number,
          paid: false,
          paymentMethod: null as unknown as string,
          status: null as unknown as AppointmentStatus,
        };
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      });
  },
});


export const {clearAppointmentFields, setFieldsAppoitment} = appointmentSlice.actions;
export default appointmentSlice.reducer;
