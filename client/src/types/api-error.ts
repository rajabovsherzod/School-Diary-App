import { AxiosError } from "axios";
export interface IApiErrorData {
  status: "error" | "fail";
  message: string;
  stack?: string;
}
export type TApiError = AxiosError<IApiErrorData>;