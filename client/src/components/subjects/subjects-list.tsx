"use client";

import React from "react";
import { useGetSubjects } from "@/hooks/queries/use-subject-queries";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SubjectsList = () => {
  const { data: subjects, isPending, isError } = useGetSubjects();

  if (isPending) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="border-b-0 bg-primary hover:bg-primary">
              <TableHead className="w-[50px] border-r text-center text-primary-foreground">
                T/r
              </TableHead>
              <TableHead className="border-r text-primary-foreground">
                Nomi
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

  if (!subjects || subjects.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold">Hozircha fanlar mavjud emas</h3>
        <p className="text-muted-foreground mt-2">
          Birinchi fanni qo&apos;shish uchun yuqoridagi tugmani bosing.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="border-b-0 bg-primary hover:bg-primary">
            <TableHead className="w-[50px] border-r text-center text-primary-foreground">
              T/r
            </TableHead>
            <TableHead className="border-r text-primary-foreground">
              Nomi
            </TableHead>
            <TableHead className="w-[100px] text-center text-primary-foreground">
              Amallar
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjects.map((subject, index) => (
            <TableRow key={subject.id} className="border-b hover:bg-muted/50">
              <TableCell className="font-medium border-r text-center">
                {index + 1}
              </TableCell>
              <TableCell className="border-r">{subject.name}</TableCell>
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
                    <DropdownMenuItem
                      onClick={() => alert(`Tahrirlash: ${subject.name}`)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Tahrirlash</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-500 focus:text-red-500"
                      onClick={() => alert(`O'chirish: ${subject.name}`)}
                    >
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

export default SubjectsList;
