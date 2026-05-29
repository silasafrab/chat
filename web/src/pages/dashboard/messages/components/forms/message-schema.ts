import { z } from "zod";

export const messageFormSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  content: z.string().min(1, "O conteúdo é obrigatório"),
  connectionId: z.string().min(1, "Selecione uma conexão"),
  contactIds: z.array(z.string()).min(1, "Selecione pelo menos um contato"),
  sendNow: z.boolean(),
  scheduledDate: z.date().nullable(),
  scheduledTime: z.string(),
}).refine((data) => {
  if (data.sendNow) return true;
  if (!data.scheduledDate || !data.scheduledTime) return true;

  const [hours, minutes] = data.scheduledTime.split(":").map(Number);
  const scheduled = new Date(data.scheduledDate);
  scheduled.setHours(hours, minutes, 0, 0);

  return scheduled > new Date();
}, {
  message: "O agendamento deve ser no futuro.",
  path: ["scheduledTime"],
});

export type MessageFormData = z.infer<typeof messageFormSchema>;