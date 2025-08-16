import $axios from "../axios";
import { TApiError } from "@/types/api-error";
import {
  IFullSchedulePayload,
  IGenericSuccessMessage,
  IMoveOrSwapPayload,
} from "./schedule.types";

export const getScheduleBySlug = async (
  slug: string
): Promise<IFullSchedulePayload | null> => {
  try {
    const { data } = await $axios.get<IFullSchedulePayload>(
      `/schedules/class/${slug}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching schedule by slug:", error);
    return null;
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
  // YECHIM: `classSlug` URL'ga, qolgan ma'lumotlar tanaga (body) joylashtirildi.
  const { classSlug, ...rest } = payload;
  const { data } = await $axios.put<IGenericSuccessMessage>(
    `/schedules/class/${classSlug}/move`,
    rest
  );
  return data;
};
