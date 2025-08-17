import $axios from "../axios";
import { ClassBasicInfo, DashboardStats } from "./statistics.types";

/**
 * Boshqaruv paneli uchun asosiy statistikani olib keladi.
 * @returns DashboardStats obyektini yoki xatolik yuz bersa null qaytaradi.
 */
export const getDashboardStats = async (): Promise<DashboardStats | null> => {
  try {
    // Backenddagi /api/statistics endpointiga murojaat qiladi
    const response = await $axios.get<{ data: DashboardStats }>("/statistics");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return null;
  }
};

/**
 * Dars jadvali biriktirilmagan sinflar ro'yxatini olib keladi.
 * @returns ClassBasicInfo massivini yoki xatolik yuz bersa bo'sh massiv qaytaradi.
 */
export const getClassesWithoutSchedule = async (): Promise<
  ClassBasicInfo[]
> => {
  try {
    // Backenddagi /api/statistics/classes-without-schedule endpointiga murojaat qiladi
    const response = await $axios.get<{ data: ClassBasicInfo[] }>(
      "/statistics/classes-without-schedule"
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching classes without schedule:", error);
    return [];
  }
};
