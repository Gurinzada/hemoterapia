import { configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import fetchMyProfileSlice from "./slices/userSlice";
 

export const store = configureStore({
    reducer: {
        user: fetchMyProfileSlice
    },
})



export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type useAppSelector<T> = (state: RootState) => T;
export const useAppSelector = <T>(selector: (state: RootState) => T) => {
    return useSelector<RootState, T>(selector);
}
export const useAppDispatch = () => store.dispatch;