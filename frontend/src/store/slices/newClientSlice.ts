import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { loading } from "../../utils/loading";
import api from "../../api/api";
import { isAxiosError } from "axios";

interface fieldsClients {
  userNameClient: string;
  emailClient: string;
  phoneClient: string;
}

interface newClientState {
  fields: fieldsClients;
  loading: loading;
  error: string | null;
}

const initialState: newClientState = {
  fields: {
    emailClient: "",
    phoneClient: "",
    userNameClient: "",
  },
  error: null,
  loading: "iddle",
};

export const postNewClient = createAsyncThunk(
  "clients/newClient",
  async (fields:fieldsClients, { rejectWithValue }) => {
    try {
      const response = await api.post("clients", {
        ...fields
      });
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message);
      }
      return rejectWithValue(error);
    }
  }
);

const newClientSlice = createSlice({
    name: "newClient",
    initialState,
    reducers: {
        clearStateNewClient(state) {
            state.fields = {
                emailClient: "",
                phoneClient: "",
                userNameClient: ""
            }
            state.error = null;
            state.loading = "iddle";
        },
        setNewClientFields(state, action:PayloadAction<fieldsClients>){
            state.fields = action.payload
        }
    },
    extraReducers(builder) {
        builder
        .addCase(postNewClient.pending, (state) => {
            state.error = null;
            state.loading = "pending";
        })
        .addCase(postNewClient.fulfilled, (state) => {
            state.loading = "sucess";
            state.fields = {
                emailClient: "",
                phoneClient: "",
                userNameClient: ""
            }
        })
        .addCase(postNewClient.rejected, (state, action) => {
            state.error = action.payload as string;
            state.loading = "failed";
        })
    },
})


export const { clearStateNewClient, setNewClientFields } = newClientSlice.actions;
export default newClientSlice.reducer;