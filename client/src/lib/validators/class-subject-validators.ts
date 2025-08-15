import * as z from "zod";

export const addSubjectsFormSchema = z.object({
  subjects: z
    .array(
      z.object({
        subjectId: z.number(),
        subjectName: z.string(),
        isSelected: z.boolean(),
        hoursPerWeek: z
          .string()
          .refine(
            (val) =>
              !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 40,
            {
              message: "Soat 0 dan 40 gacha bo'lgan raqam bo'lishi kerak.",
            }
          ),
      })
    )
    .refine((data) => data.some((s) => s.isSelected), {
      message: "Kamida bitta fan tanlanishi kerak.",
    }),
});

export type AddSubjectsFormValues = z.infer<typeof addSubjectsFormSchema>;

export const updateHoursSchema = z.object({
  hoursPerWeek: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 40,
      {
        message: "Soat 0 dan 40 gacha bo'lgan raqam bo'lishi kerak.",
      }
    ),
});

export type UpdateHoursFormValues = z.infer<typeof updateHoursSchema>;
