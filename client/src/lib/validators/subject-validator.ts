import { z } from "zod";

export const subjectFormSchema = z.object({
  name: z.string().min(1, { message: "Fan nomi kiritilishi shart." }),
});
export type SubjectFormValues = z.infer<typeof subjectFormSchema>;
export type SubjectApiPayload = SubjectFormValues;
