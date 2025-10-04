import $axios from "../axios";
import {
  IFullSchedulePayload,
  IGenericSuccessMessage,
  IMoveOrSwapPayload,
} from "./schedule.types";

import { isAxiosError } from "axios";

export const getScheduleBySlug = async (slug: string): Promise<IFullSchedulePayload | null> => {
  try {
    const { data } = await $axios.get<{ data: IFullSchedulePayload | null }>(`/api/schedules/class/${slug}`);
    return data.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return null; // Jadval topilmasa, null qaytaramiz
    }
    throw error; // Boshqa xatoliklarni qayta tashlaymiz
  }
};

export const generateScheduleForClassBySlug = async (slug: string): Promise<IGenericSuccessMessage> => {
    const { data } = await $axios.post<IGenericSuccessMessage>(`/api/schedules/generate/class/${slug}`);
  return data;
};

export const moveOrSwapEntry = async (payload: IMoveOrSwapPayload): Promise<IGenericSuccessMessage> => {
  const { classSlug, ...body } = payload;
  if (body.displacedEntryOriginalDay === undefined) delete body.displacedEntryOriginalDay;
    const { data } = await $axios.put<IGenericSuccessMessage>(`/api/schedules/class/${classSlug}/move`, body);
  return data;
};

export const deleteScheduleEntries = async (payload: { classSlug: string; entryIds: number[]; subjectId: number; }): Promise<IGenericSuccessMessage> => {
  const { classSlug, ...body } = payload;
    const { data } = await $axios.delete<IGenericSuccessMessage>(`/api/schedules/${classSlug}/entries`, { data: body });
  return data;
};