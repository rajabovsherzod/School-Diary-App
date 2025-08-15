import { Library, School, Settings, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold tracking-tight mb-2">
        Boshqaruv paneli
      </h1>
      <p className="text-muted-foreground mb-8">
        Kundalik tizimiga xush kelibsiz. Quyidagi bolimlardan birini tanlang:
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/users">
          <div className="group flex flex-col justify-between h-full rounded-lg border bg-card text-card-foreground p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
            <div>
              <Users className="h-8 w-8 mb-4 text-primary" />
              <h2 className="text-xl font-semibold mb-1">O&apos;quvchilar</h2>
              <p className="text-sm text-muted-foreground">
                O&apos;quvchilarni boshqarish va ro&apos;yxatini ko&apos;rish.
              </p>
            </div>
          </div>
        </Link>
        <Link href="/classes">
          <div className="group flex flex-col justify-between h-full rounded-lg border bg-card text-card-foreground p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
            <div>
              <School className="h-8 w-8 mb-4 text-primary" />
              <h2 className="text-xl font-semibold mb-1">Sinflar</h2>
              <p className="text-sm text-muted-foreground">
                Sinflar ro&apos;yxati va dars jadvallarini ko&apos;rish.
              </p>
            </div>
          </div>
        </Link>
        <Link href="/library">
          <div className="group flex flex-col justify-between h-full rounded-lg border bg-card text-card-foreground p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
            <div>
              <Library className="h-8 w-8 mb-4 text-primary" />
              <h2 className="text-xl font-semibold mb-1">Kutubxona</h2>
              <p className="text-sm text-muted-foreground">
                O&apos;quv materiallari va kitoblar manbasi.
              </p>
            </div>
          </div>
        </Link>
        <Link href="/settings">
          <div className="group flex flex-col justify-between h-full rounded-lg border bg-card text-card-foreground p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
            <div>
              <Settings className="h-8 w-8 mb-4 text-primary" />
              <h2 className="text-xl font-semibold mb-1">Sozlamalar</h2>
              <p className="text-sm text-muted-foreground">
                Tizim va profil sozlamalarini boshqarish.
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
