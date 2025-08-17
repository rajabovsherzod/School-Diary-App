import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Interface for the backend's ApiError structure
export interface ApiError {
  message: string;
  errors?: { msg: string; path: string }[];
}

// Type guard to check if an error is an Axios error with our specific data structure
export const isApiError = (
  error: unknown
): error is { response: { data: ApiError } } => {
  return (
    axios.isAxiosError(error) &&
    error.response?.data &&
    typeof error.response.data.message === "string"
  );
};

// A function to extract a user-friendly error message
export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    // Return the specific message from our backend
    return error.response.data.message;
  }
  if (error instanceof Error) {
    // Return the standard error message
    return error.message;
  }
  // Fallback for unknown error types
  return "An unexpected error occurred. Please try again.";
};

export const handleAxiosError = (error: unknown): string => {
  return getErrorMessage(error);
};
