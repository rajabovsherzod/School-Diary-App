import $axios from "../axios";
import { ClassBasicInfo, DashboardStats } from "./statistics.types";

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await $axios.get<{ data: DashboardStats }>("/statistics");
  return data.data;
};

export const getClassesWithoutSchedule = async (): Promise<ClassBasicInfo[]> => {
  const { data } = await $axios.get<{ data: ClassBasicInfo[] }>(
    "/statistics/classes-without-schedule"
  );
  return data.data;
};