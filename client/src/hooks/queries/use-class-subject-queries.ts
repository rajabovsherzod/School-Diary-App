import { getClassSubjects, getUnassignedSubjects } from "@/lib/api/class-subject/class-subject";
import { useQuery } from "@tanstack/react-query";

export const useGetClassSubjects = (slug: string) => {
  return useQuery({
    queryKey: ["classSubjects", slug],
    queryFn: () => getClassSubjects(slug),
    enabled: !!slug,
  });
};

export const useGetUnassignedSubjects = (classId: number | undefined) => {
  return useQuery({
    queryKey: ["subjects", "unassigned", classId],
    queryFn: () => getUnassignedSubjects(classId!),
    enabled: !!classId,
  });
};
