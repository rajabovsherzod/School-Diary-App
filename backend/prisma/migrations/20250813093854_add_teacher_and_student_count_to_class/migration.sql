/*
  Warnings:

  - Added the required column `studentCount` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacher` to the `classes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."classes" ADD COLUMN     "studentCount" INTEGER NOT NULL,
ADD COLUMN     "teacher" TEXT NOT NULL;
