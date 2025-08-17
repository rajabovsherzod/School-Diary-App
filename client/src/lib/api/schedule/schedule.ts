import $axios from "../axios";
import {
  IFullSchedulePayload,
  IGenericSuccessMessage,
  IMoveOrSwapPayload,
} from "./schedule.types";

export const getScheduleBySlug = async (slug: string): Promise<IFullSchedulePayload | null> => {
  try {
    const { data } = await $axios.get<{ data: IFullSchedulePayload | null }>(`/schedules/class/${slug}`);
    return data.data;
  } catch (error) {
    console.error("Error fetching schedule by slug:", error);
    return null;
  }
};

export const generateScheduleForClassBySlug = async (slug: string): Promise<IGenericSuccessMessage> => {
  const { data } = await $axios.post<IGenericSuccessMessage>(`/schedules/generate/class/${slug}`);
  return data;
};

export const moveOrSwapEntry = async (payload: IMoveOrSwapPayload): Promise<IGenericSuccessMessage> => {
  const { classSlug, ...body } = payload;
  if (body.displacedEntryOriginalDay === undefined) delete body.displacedEntryOriginalDay;
  const { data } = await $axios.put<IGenericSuccessMessage>(`/schedules/class/${classSlug}/move`, body);
  return data;
};

export const deleteScheduleEntries = async (payload: { classSlug: string; entryIds: number[]; subjectId: number; }): Promise<IGenericSuccessMessage> => {
  const { classSlug, ...body } = payload;
  const { data } = await $axios.delete<IGenericSuccessMessage>(`/schedules/${classSlug}/entries`, { data: body });
  return data;
};