import ClassesList from "@/components/classes/classes-list";
import AddClassModal from "@/components/classes/add-class-modal";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function ClassesPage() {
  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sinflar</h1>
          <p className="text-muted-foreground mt-1">
            Mavjud sinflarni boshqarish va ko&apos;rish.
          </p>
        </div>
        <AddClassModal>
          <Button className="mt-4 sm:mt-0">
            <PlusCircle className="mr-2 h-4 w-4" />
            Sinf qo&apos;shish
          </Button>
        </AddClassModal>
      </div>
      <ClassesList />
    </div>
  );
}
