import { useQuery } from "@tanstack/react-query";
import { getScheduleBySlug } from "@/lib/api/schedule/schedule";

export const useGetScheduleBySlug = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["schedule", slug],
    queryFn: () => getScheduleBySlug(slug!),
    enabled: !!slug,
  });
};