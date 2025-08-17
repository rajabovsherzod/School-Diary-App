import prisma from "@/lib/prisma";

export class StatisticsService {
  public async getDashboardStats() {
    const [totalClasses, totalStudentsData, scheduledClassesCount] =
      await prisma.$transaction([
        prisma.class.count(),
        prisma.class.aggregate({
          _sum: {
            studentCount: true,
          },
        }),
        prisma.class.count({
          where: {
            schedule: {
              some: {},
            },
          },
        }),
      ]);

    const totalStudents = totalStudentsData._sum.studentCount || 0;
    const unscheduledClassesCount = totalClasses - scheduledClassesCount;

    return {
      totalClasses,
      totalStudents,
      scheduledClassesCount,
      unscheduledClassesCount,
    };
  }

  public async getClassesWithoutSchedule() {
    return prisma.class.findMany({
      where: {
        schedule: {
          none: {},
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });
  }
}