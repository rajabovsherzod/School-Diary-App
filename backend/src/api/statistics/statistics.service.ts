import prisma from "@/lib/prisma";

/**
 * Implements the core logic for the new statistics API. This service uses Prisma to efficiently calculate key dashboard metrics in a single database transaction: total classes, total students (by summing student counts), and the number of classes with and without schedules. This forms the foundation of the new, data-rich dashboard.
 */
export class StatisticsService {
  /**
   * Retrieves key dashboard statistics in a single database transaction.
   *
   * @returns An object containing total classes, total students, scheduled classes count, and unscheduled classes count.
   */
  public async getDashboardStats() {
    const [totalClasses, totalStudentsData, scheduledClassesCount] =
      await prisma.$transaction([
        prisma.class.count(),
        prisma.class.aggregate({
          _sum: {
            studentCount: true,
          },
        }),
        // XATO TUZATILDI: 'birga-ko'p' munosabati uchun to'g'ri sintaksis
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

  /**
   * Retrieves classes without a schedule.
   *
   * @returns An array of classes without a schedule.
   */
  public async getClassesWithoutSchedule() {
    // XATO TUZATILDI: 'birga-ko'p' munosabati uchun to'g'ri sintaksis
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
