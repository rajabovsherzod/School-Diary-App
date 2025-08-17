import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ApiError {
  message: string;
  errors?: { msg: string; path: string }[];
}

export const isApiError = (
  error: unknown
): error is { response: { data: ApiError } } => {
  return (
    axios.isAxiosError(error) &&
    !!error.response?.data &&
    typeof error.response.data.message === "string"
  );
};

export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return error.response.data.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred. Please try again.";
};

export const handleAxiosError = (error: unknown): string => {
  return getErrorMessage(error);
};