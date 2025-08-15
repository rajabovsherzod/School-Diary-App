"use client";

import { useGetClasses } from "@/hooks/queries/use-class-queries";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Pencil,
  Settings,
  Trash2,
  CalendarDays,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { ClassResponse } from "@/lib/api/class/class.types";

const ClassesList = () => {
  const { data, isLoading, isError } = useGetClasses();

  const classes = Array.isArray(data) ? data : [];

  if (isLoading) {
    return (
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b-0 bg-primary hover:bg-primary">
              <TableHead className="w-[50px] border-r text-center text-primary-foreground">
                T/r
              </TableHead>
              <TableHead className="border-r text-primary-foreground">
                Sinf nomi
              </TableHead>
              <TableHead className="border-r text-primary-foreground">
                Sinf rahbari
              </TableHead>
              <TableHead className="w-[150px] border-r text-center text-primary-foreground">
                O&apos;quvchilar soni
              </TableHead>
              <TableHead className="w-[100px] text-center text-primary-foreground">
                Amallar
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i} className="border-b">
                <TableCell className="border-r text-center">
                  <Skeleton className="h-5 w-8 mx-auto" />
                </TableCell>
                <TableCell className="border-r">
                  <Skeleton className="h-5 w-48" />
                </TableCell>
                <TableCell className="border-r">
                  <Skeleton className="h-5 w-48" />
                </TableCell>
                <TableCell className="border-r text-center">
                  <Skeleton className="h-5 w-12 mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-8 w-8 mx-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-16 text-red-500">
        Ma&apos;lumotlarni yuklashda xatolik yuz berdi.
      </div>
    );
  }

  if (!classes || classes.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold">Hozircha sinflar mavjud emas</h3>
        <p className="text-muted-foreground mt-2">
          Birinchi sinfni qo&apos;shish uchun yuqoridagi tugmani bosing.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b-0 bg-primary hover:bg-primary">
            <TableHead className="w-[50px] border-r text-center text-primary-foreground">
              T/r
            </TableHead>
            <TableHead className="border-r text-primary-foreground">
              Sinf nomi
            </TableHead>
            <TableHead className="border-r text-primary-foreground">
              Sinf rahbari
            </TableHead>
            <TableHead className="w-[150px] border-r text-center text-primary-foreground">
              O&apos;quvchilar soni
            </TableHead>
            <TableHead className="w-[100px] text-center text-primary-foreground">
              Amallar
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.length === 0 && !isLoading && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground"
              >
                Hozircha hech qanday sinf mavjud emas
              </TableCell>
            </TableRow>
          )}
          {classes.map((classItem: ClassResponse, index: number) => (
            <TableRow key={classItem.id} className="border-b hover:bg-muted/50">
              <TableCell className="font-medium border-r text-center">
                {index + 1}
              </TableCell>
              <TableCell className="border-r">{classItem.name}</TableCell>
              <TableCell className="border-r">{classItem.teacher}</TableCell>
              <TableCell className="border-r text-center">
                {classItem.studentCount}
              </TableCell>
              <TableCell className="flex justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Menyuni ochish</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Amallar</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Tahrirlash</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/classes/${classItem.slug}/schedule`}>
                        <CalendarDays className="mr-2 h-4 w-4" />
                        <span>Dars jadvali</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/classes/${classItem.slug}/subjects`}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Fanlar</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500 focus:text-red-500">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>O&apos;chirish</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClassesList;
