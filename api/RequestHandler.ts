import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ApiConfig } from './apiConfig'

const APIInstance = () => {
  const Instance = Axios.create(ApiConfig)

  return {
    GetRequest: <T, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> => {
      return Instance.get(url, config)
    },

    PostRequest: <T, B = {}, R = AxiosResponse<T>>(
      url: string,
      data?: B,
      config?: AxiosRequestConfig,
    ): Promise<R> => {
      return Instance.post(url, data, config)
    },

    PutRequest: <T, B = {}, R = AxiosResponse<T>>(
      url: string,
      data?: B,
      config?: AxiosRequestConfig,
    ): Promise<R> => {
      return Instance.put(url, data, config)
    },

    PatchRequest: <T, B = {}, R = AxiosResponse<T>>(
      url: string,
      data?: B,
      config?: AxiosRequestConfig,
    ): Promise<R> => {
      return Instance.patch(url, data, config)
    },

    DeleteRequest: <T, R = AxiosResponse<T>>(
      url: string,
      config?: AxiosRequestConfig,
    ): Promise<R> => {
      return Instance.delete(url, config)
    },

    // Result managers
    GetSuccessData: <T>(response: AxiosResponse<T>): T => {
      return response.data
    },

    GetFailureData: <T extends { status: string; message: string }>(error: AxiosError<T>) => {
      console.log('>>> 111 ERROR:', { error, errorResponse: error.response?.data })
      return {
        errorCode: error.response?.data?.status || '',
        errorMessage: error.response?.data?.message || '',
        errorResponse: error.response?.data || '',
      }
    },
  }
}

export const AxiosInstance = APIInstance()
