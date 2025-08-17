export interface DashboardStats {
  totalClasses: number;
  totalStudents: number;
  scheduledClassesCount: number;
  unscheduledClassesCount: number;
}

export interface ClassBasicInfo {
  id: number;
  name: string;
  slug: string;
}
