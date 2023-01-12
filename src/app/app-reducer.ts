import {Dispatch} from "redux";
import {authAPI} from "../api/authAPI";
import {ResultCodeStatus} from "../api/todolists-api";
import {setIsLoggedInAC} from "../components/Login/auth-login-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {AxiosError} from "axios";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
type InitialStateType = {
    status: string
    error: string | null,
    isInitialized: boolean
}
const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false
}
const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers:{
        setAppErrorAC(state, action: PayloadAction<{error: string | null}>){
            state.error = action.payload.error
        },
        setAppStatusAC(state, action: PayloadAction<{status: RequestStatusType}>){
            state.status = action.payload.status
        },
        setIsInitializedAC(state, action: PayloadAction<{isInitialized: boolean}>){
            state.isInitialized = action.payload.isInitialized
        },
    }
})

export const appReducer = slice.reducer
export const {setAppErrorAC, setAppStatusAC, setIsInitializedAC} = slice.actions


export const initializeAppTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.me()
        .then(res => {
            if (res.data.resultCode === ResultCodeStatus.succeed) {
                dispatch(setIsLoggedInAC({value: true}))
            } else if (res.data.resultCode === ResultCodeStatus.failed) {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e: AxiosError) => {
            handleServerNetworkError(e, dispatch)
        })
        .finally(()=>{
            dispatch(setIsInitializedAC({isInitialized: true}))
        })
}



