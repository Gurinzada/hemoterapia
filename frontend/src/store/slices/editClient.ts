import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { loading } from "../../utils/loading";
import api from "../../api/api";
import { isAxiosError } from "axios";

interface fieldsClients {
  id: number;
  userNameClient: string;
  emailClient: string;
  phoneClient: string;
}

interface editClienteState {
  editFields: fieldsClients;
  editLoading: loading;
  editError: string | null;
}

const initialState: editClienteState = {
  editFields: {
    id: null as unknown as number,
    emailClient: "",
    phoneClient: "",
    userNameClient: "",
  },
  editError: null,
  editLoading: "iddle",
};

interface idUser {
  id: number;
}

export const findOneClient = createAsyncThunk(
  "clients/getOneClient",
  async (id: idUser, { rejectWithValue }) => {
    try {
        const response = await api.get(`clients/${id.id}`);
        return response.data as fieldsClients;
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message);
      }
      return rejectWithValue(error);
    }
  }
);

export const editClient = createAsyncThunk(
  "clients/editClient",
  async (fields: fieldsClients, { rejectWithValue }) => {
    try {
      const response = await api.patch(`clients/${fields.id}`, {
        ...fields,
      });
      return response.data as fieldsClients;
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message);
      }
      return rejectWithValue(error);
    }
  }
);

const editClientSlice = createSlice({
  name: "editClient",
  initialState,
  reducers: {
    clearEditState(state) {
      state.editFields = {
        id: null as unknown as number,
        emailClient: "",
        phoneClient: "",
        userNameClient: "",
      };
      state.editError = null;
      state.editLoading = "iddle";
    },
    setEditFields(state, action: PayloadAction<fieldsClients>) {
      state.editFields = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(editClient.pending, (state) => {
        state.editLoading = "pending";
        state.editError = null;
      })
      .addCase(editClient.fulfilled, (state, action) => {
        state.editLoading = "sucess";
        state.editFields = action.payload;
        console.log(state.editFields);
      })
      .addCase(editClient.rejected, (state, action) => {
        state.editLoading = "failed";
        state.editError = action.payload as string;
      })
      .addCase(findOneClient.pending, (state) => {
        state.editLoading = "pending";
        state.editError = null;
      })
      .addCase(findOneClient.fulfilled, (state, action) => {
        state.editLoading = "sucess";
        state.editFields = action.payload;
      })
      .addCase(findOneClient.rejected, (state, action) => {
        state.editLoading = "failed";
        state.editError = action.payload as string;
      });
  },
});

export const { clearEditState, setEditFields } = editClientSlice.actions;
export default editClientSlice.reducer;
