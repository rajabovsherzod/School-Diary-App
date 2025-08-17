import $axios from "../axios";
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
  const { classSlug, ...body } = payload;

  // MUHIM: Agar `displacedEntryOriginalDay` bo'lmasa, uni backendga yubormaymiz.
  // Bu backend validatsiyasidan muammosiz o'tishni ta'minlaydi.
  if (body.displacedEntryOriginalDay === undefined) {
    delete body.displacedEntryOriginalDay;
  }

  const { data } = await $axios.put<IGenericSuccessMessage>(
    `/schedules/class/${classSlug}/move`,
    body
  );
  return data;
};

export const deleteScheduleEntries = async (payload: {
  classSlug: string;
  entryIds: number[];
  subjectId: number;
}): Promise<IGenericSuccessMessage> => {
  const { classSlug, ...body } = payload;
  const { data } = await $axios.delete<IGenericSuccessMessage>(
    `/schedules/${classSlug}/entries`,
    { data: body } // DELETE so'rovida body `data` propertisi ichida yuboriladi
  );
  return data;
};
