import { configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import fetchMyProfileSlice from "./slices/userSlice";
import fetchMyClients from "./slices/clientsSlice";
import newClient from "./slices/newClientSlice";
import editClient from "./slices/editClient";
import appointment from "./slices/newAppointment";
import getMyAppointments from "./slices/appointmentSlice";
 

export const store = configureStore({
    reducer: {
        user: fetchMyProfileSlice,
        clients: fetchMyClients,
        newClient: newClient,
        editClient: editClient,
        newAppointment: appointment,
        appointments: getMyAppointments
    },
})



export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type useAppSelector<T> = (state: RootState) => T;
export const useAppSelector = <T>(selector: (state: RootState) => T) => {
    return useSelector<RootState, T>(selector);
}
export const useAppDispatch = () => store.dispatch;