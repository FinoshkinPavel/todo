import axios, {AxiosResponse} from "axios";
import {ResponseType} from "./todolists-api";

const instanse = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': 'bbb78875-e77b-430a-a608-d8c2c7f5b8a4'
    }
})

export const authAPI = {
    login (data: LoginParamsType) {
         return instanse.post<LoginParamsType, AxiosResponse<ResponseType<{userId : number }>>>('/auth/login', data)
    },
    me(){
        return instanse.get<ResponseType<MeParamType>>('/auth/me')
    },
    logOut(){
        return instanse.delete<ResponseType>('/auth/login')
    }
}

export type MeParamType = {
    id: number
    email: string
    login: string
}

export type LoginParamsType = {
    email: string
    password: string
    rememberMe?: boolean
    captcha?: boolean
}