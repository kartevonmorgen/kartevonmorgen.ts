import { AxiosResponse } from 'axios'

export enum REQUEST_METHOD_TYPES_ENUM {
  GET = 'get',
  PUT = 'put',
  POST = 'post',
  PATCH = 'patch',
  DELETE = 'delete',
}

export interface IGlobalResponseType<T = {}> {
  status: number;
  message: string;
  payload: T;
}

export type RequestConfigurationType = {
  data: any | null;
  method: REQUEST_METHOD_TYPES_ENUM;
  token?: string;
  headers?: {
    [string]: string;
  };
};

export type RequestHandlerOptionsType = {
  url: string;
  configuration?: RequestConfigurationType;
};

export type RequestHandlerType = <T>(
  options: RequestHandlerOptionsType,
) => Promise<AxiosResponse<T>>;
