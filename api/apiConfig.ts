import * as qs from 'qs'
import { PathLike } from 'fs'

export const ApiConfig = {
  returnRejectedPromiseOnError: true,
  withCredentials: false,
  timeout: 10 * 1000,
  headers: {
    common: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
  paramsSerializer: (params: PathLike) => qs.stringify(params, { indices: false }),
}
