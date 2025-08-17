import {
  GraduationCap,
  Users,
  CalendarX2,
  BookMarked,
  CheckCircle2,
  BookUp,
  CalendarPlus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  getDashboardStats,
  getClassesWithoutSchedule,
} from "@/lib/api/statistics/statistics";

const StatCard = ({
  icon: Icon,
  title,
  value,
  description,
  gradient,
}: {
  icon: React.ElementType;
  title: string;
  value: number | string;
  description?: string;
  gradient: string;
}) => (
  <Card
    className={`relative overflow-hidden transition-all duration-300 ease-in-out ${gradient}`}
  >
    <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 p-4 pb-2">
      <CardTitle className="text-sm font-medium text-white/90">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="relative z-10 p-4 pt-0">
      <div className="text-5xl font-bold tracking-tight text-white">
        {value}
      </div>
      {description && (
        <p className="text-xs text-white/80 pt-1">{description}</p>
      )}
    </CardContent>
    <Icon className="absolute right-6 top-4 h-20 w-20 text-white/10 z-0" />
  </Card>
);

export default async function Home() {
  const [stats, classesWithoutSchedule] = await Promise.all([
    getDashboardStats(),
    getClassesWithoutSchedule(),
  ]);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-full text-center">
        <div>
          <h2 className="text-2xl font-bold">Xatolik!</h2>
          <p className="text-muted-foreground">
            Boshqaruv paneli ma&apos;lumotlarini yuklab bo&apos;lmadi.
            <br />
            Backend serveri ishlayotganiga ishonch hosil qiling.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl md:text-5xl">
          Boshqaruv Paneli
        </h1>
        <p className="mt-2 max-w-2xl mx-auto text-base text-muted-foreground md:mt-4 md:text-lg">
          Tizimning umumiy holati va muhim ko&apos;rsatkichlar bilan tanishing.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={GraduationCap}
          title="Umumiy Sinflar"
          value={stats.totalClasses}
          description={`${stats.scheduledClassesCount} ta sinfda dars jadvali mavjud`}
          gradient="bg-primary"
        />
        <StatCard
          icon={Users}
          title="Jami O'quvchilar"
          value={stats.totalStudents}
          description="Barcha sinflardagi o'quvchilar soni"
          gradient="bg-primary"
        />
        <StatCard
          icon={CalendarX2}
          title="Jadvalsiz Sinflar"
          value={stats.unscheduledClassesCount}
          description="Dars jadvali yaratilishi kerak"
          gradient="bg-primary"
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">
          Harakat talab qilinadigan vazifalar
        </h2>

        {classesWithoutSchedule.length > 0 ? (
          <div className="bg-card border rounded-lg p-4 sm:p-6 space-y-4">
            {classesWithoutSchedule.map((cls) => (
              <div
                key={cls.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-background hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary rounded-full">
                    <BookMarked className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">
                      {cls.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Jadval kutilmoqda
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    <Link href={`/classes/${cls.slug}/subjects`}>
                      <BookUp className="mr-2 h-4 w-4" />
                      Fan Biriktirish
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    <Link href={`/classes/${cls.slug}/schedule`}>
                      <CalendarPlus className="mr-2 h-4 w-4" />
                      Jadval Yaratish
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border rounded-lg p-12 flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold">
              Barcha vazifalar bajarilgan!
            </h3>
            <p className="text-muted-foreground mt-2">
              Hamma sinflar uchun dars jadvallari yaratilgan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
