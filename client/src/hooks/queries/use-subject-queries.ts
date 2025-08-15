"use client";

import { useQuery } from "@tanstack/react-query";
import { getSubjects } from "@/lib/api/subject/subject";

export const useGetSubjects = () => {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });
};
