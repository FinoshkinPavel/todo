import {Dispatch} from "redux";
import {authAPI, LoginParamsType} from "../../api/authAPI";
import {setAppStatusAC} from "../../app/app-reducer";
import {AxiosError} from "axios";
import {ResultCodeStatus} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";


export const loginTC = createAsyncThunk('auth/login', async (param :LoginParamsType, thunkAPI)=> {
    thunkAPI.dispatch(setAppStatusAC({status:'loading'}))
    const res = await  authAPI.login(param)
          try {
              if (res.data.resultCode === ResultCodeStatus.succeed) {
                  thunkAPI.dispatch(setAppStatusAC({status:'succeeded'}))
                  return {isLoggedIn: true}
              } else if (res.data.resultCode === ResultCodeStatus.failed) {
                  handleServerAppError(res.data, thunkAPI.dispatch)
                  thunkAPI.rejectWithValue({isLoggedIn: false})
              }
              //@ts-ignore
          } catch(e: AxiosError) {
            handleServerNetworkError(e, thunkAPI.dispatch)
              return thunkAPI.rejectWithValue({isLoggedIn: false})
        }
})

export const loginTC_ = (data: LoginParamsType) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status:'loading'}))
    authAPI.login(data)
        .then((res) => {
            if (res.data.resultCode === ResultCodeStatus.succeed) {
                dispatch(setIsLoggedInAC({value: true}))
                dispatch(setAppStatusAC({status:'succeeded'}))
            } else if (res.data.resultCode === ResultCodeStatus.failed) {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e: AxiosError) => {
            handleServerNetworkError(e, dispatch)
        })
}


const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{value: boolean}>){
            state.isLoggedIn = action.payload.value
        }
    },
    extraReducers: builder => {
        builder.addCase(loginTC.fulfilled, (state, action)=>{
            if(action.payload)
             state.isLoggedIn = action.payload.isLoggedIn
        })
    }
})

export const authLoginReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions


export const logOutTC = () => (dispatch: Dispatch)=> {
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.logOut()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: false}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
