import $axios from "../axios";
import { TApiError } from "@/types/api-error";
import {
  IFullSchedulePayload,
  IGenericSuccessMessage,
  IMoveOrSwapPayload,
} from "./schedule.types";

export const getScheduleBySlug = async (
  slug: string
): Promise<IFullSchedulePayload> => {
  try {
    const response = await $axios.get(`/schedules/class/${slug}`);
    return response.data;
  } catch (error) {
    throw error as TApiError;
  }
};

export const generateScheduleForClassBySlug = async (
  slug: string
): Promise<IGenericSuccessMessage> => {
  const response = await $axios.post(`/schedules/generate/class/${slug}`);
  return response.data;
};

export const moveOrSwapEntry = async (
  payload: IMoveOrSwapPayload
): Promise<IGenericSuccessMessage> => {
  const response = await $axios.put("/schedules/move", payload);
  return response.data;
};