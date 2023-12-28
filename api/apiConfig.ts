import { AxiosRequestConfig } from 'axios'
import * as qs from 'qs'
import { PathLike } from 'fs'


export const ApiConfig: AxiosRequestConfig = {
  withCredentials: false,
  timeout: 10 * 1000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  proxy: false,
  paramsSerializer: (params) => qs.stringify(params, { indices: false }),
}
