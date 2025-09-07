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
import axios, { isAxiosError } from "axios";

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

interface appointmentUpdateProps {
  id: number;
  appointment: appointmentFields;
}

export const createAppointment = createAsyncThunk(
  "appointmentCreate/createAppointment",
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

export const getAnAppointment = createAsyncThunk(
  "appointmentCreate/getAnAppointment",
  async (id:number, { rejectWithValue }) => {
    try {
      const response = await api.get(`appointment/${id}`);
      return response.data as appointmentFields;
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue(error);
    }
  }
)

export const updateAnAppointment = createAsyncThunk(
  "appointmentCreate/updateAnAppointment",
  async ({appointment, id}: appointmentUpdateProps, { rejectWithValue }) => {
    try {
      const response = await api.patch(`appointment/${id}/${appointment.clientid}`, {
        ...appointment
      })
      return response.data as appointmentFields;
    } catch (error) {
      if(isAxiosError(error)){
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue(error);
      }
    }
  }
)

const appointmentSlice = createSlice({
  name: "appointmentCreate",
  initialState,
  reducers: {
    setFieldsAppoitment(state, action: PayloadAction<appointmentFields>) {
      console.log(action.payload + " " + action.type)
      state.appointmentFields = action.payload;
      console.log(state.appointmentFields)
    },
    clearAppointmentFields(state) {
      state.appointmentFields = {
        appointmentValue: 0,
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
          appointmentValue: 0 as unknown as number,
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
      })
      .addCase(getAnAppointment.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(getAnAppointment.fulfilled, (state, action) => {
        state.loading = "sucess";
        state.appointmentFields = action.payload as appointmentFields;
        console.log(state.appointmentFields);
      })
      .addCase(getAnAppointment.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })
      .addCase(updateAnAppointment.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(updateAnAppointment.fulfilled, (state, action) => {
        state.loading = "sucess";
        state.appointmentFields = action.payload as appointmentFields;
      })
      .addCase(updateAnAppointment.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = "failed";
      })
  },
});


export const {clearAppointmentFields, setFieldsAppoitment} = appointmentSlice.actions;
export default appointmentSlice.reducer;
