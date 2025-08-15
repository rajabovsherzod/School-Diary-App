"use client";

import { useQuery } from "@tanstack/react-query";
import { getClasses, getClassBySlug } from "@/lib/api/class/class";

export const useGetClasses = () => {
  return useQuery({
    queryKey: ["classes"],
    queryFn: getClasses,
  });
};

export const useGetClassBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["classes", slug],
    queryFn: () => getClassBySlug(slug),
    enabled: !!slug,
  });
};
