import * as z from "zod";

export const classFormSchema = z.object({
  name: z.string().min(1, { message: "Sinf nomi kiritilishi shart." }),
  studentCount: z
    .string()
    .min(1, { message: "O'quvchilar soni kiritilishi shart." }),
  teacher: z
    .string()
    .min(5, { message: "Sinf rahbari ismi kiritilishi shart." }),
});

export type ClassFormValues = z.infer<typeof classFormSchema>;

export const classApiSchema = classFormSchema.extend({
  studentCount: z.coerce
    .number()
    .min(1, { message: "O'quvchilar soni kamida 1 bo'lishi kerak." }),
});

export type ClassApiPayload = z.infer<typeof classApiSchema>;
