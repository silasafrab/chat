import { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useConnections } from "@/hooks/use-connections";
import { useContacts } from "@/hooks/use-contacts";
import type { Message } from "@/types/message";
import { Badge } from "@/components/ui/badge";
import { ContactsCombobox } from "./contacts-combobox";

const formSchema = z.object({
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

type FormData = z.infer<typeof formSchema>;

type MessageFormProps = {
  initialData?: Message;
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting: boolean;
  onClose: () => void;
};

export type { FormData as MessageFormData };

export const MessageForm = ({
  initialData,
  onSubmit,
  isSubmitting,
  onClose,
}: MessageFormProps) => {
  const { connections } = useConnections();
  const { contacts } = useContacts();

  const initialSendNow = !initialData?.scheduledAt;

  const form = useForm<FormData>({
    defaultValues: {
      title: initialData?.title ?? "",
      content: initialData?.content ?? "",
      connectionId: initialData?.connectionId ?? "",
      contactIds: initialData?.contactIds ?? [],
      sendNow: initialSendNow,
      scheduledDate: initialData?.scheduledAt ?? null,
      scheduledTime: initialData?.scheduledAt
        ? format(initialData.scheduledAt, "HH:mm")
        : "08:00",
    },
    resolver: zodResolver(formSchema),
  });

  const sendNow = form.watch("sendNow");
  const selectedConnectionId = form.watch("connectionId");
  const prevConnectionIdRef = useRef(selectedConnectionId);

  const filteredContacts = contacts.filter(
    (c) => c.connectionId === selectedConnectionId,
  );

  useEffect(() => {
    if (prevConnectionIdRef.current !== selectedConnectionId) {
      form.setValue("contactIds", filteredContacts.map((c) => c.id));
      prevConnectionIdRef.current = selectedConnectionId;
    }
  }, [selectedConnectionId, form, filteredContacts]);

  const handleSubmit = async (data: FormData) => {
    const connection = connections.find((c) => c.id === data.connectionId);
    if (connection && !connection.active) {
      form.setError("connectionId", { message: "Conexão inativa. Selecione uma conexão ativa." });
      return;
    }
    await onSubmit(data);
    onClose();
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 p-5">
      <Controller
        control={form.control}
        name="title"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Título</FieldLabel>
            <Input
              aria-invalid={fieldState.invalid}
              placeholder="Título da mensagem"
              {...field}
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="content"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Conteúdo da mensagem</FieldLabel>
            <Textarea
              aria-invalid={fieldState.invalid}
              placeholder="Digite sua mensagem..."
              className="min-h-[100px]"
              {...field}
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="connectionId"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Conexão</FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                aria-invalid={fieldState.invalid}
                className="w-full"
              >
                <SelectValue placeholder="Selecione a conexão" />
              </SelectTrigger>
              <SelectContent>
                {connections.map((connection) => (
                  <SelectItem
                    key={connection.id}
                    value={connection.id}
                    disabled={!connection.active}
                  >
                    {connection.name}
                    {!connection.active && (
                      <Badge variant="outline">Inativo</Badge>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      {selectedConnectionId && (
        <Controller
          control={form.control}
          name="contactIds"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Contatos</FieldLabel>
              <ContactsCombobox
                contacts={filteredContacts}
                value={field.value ?? []}
                onChange={field.onChange}
                invalid={fieldState.invalid}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      )}

      <div className="flex items-center justify-between rounded-3xl border p-4">
        <div>
          <p className="text-sm font-medium">Enviar agora</p>
          <p className="text-xs text-muted-foreground">
            {sendNow
              ? "A mensagem será enviada imediatamente"
              : "A mensagem será agendada"}
          </p>
        </div>
        <Controller
          control={form.control}
          name="sendNow"
          render={({ field }) => (
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>

      {!sendNow && (
        <div className="grid grid-cols-2 gap-3">
          <Controller
            control={form.control}
            name="scheduledDate"
            render={({ field }) => (
              <Field>
                <FieldLabel>Data</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="size-4" />
                      {field.value
                        ? format(field.value, "dd/MM/yyyy")
                        : "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ?? undefined}
                      onSelect={(date) => field.onChange(date ?? null)}
                      disabled={(date) => date < startOfDay(new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="scheduledTime"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Horário</FieldLabel>
                <Input type="time" {...field} />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Salvando..."
            : initialData
              ? "Atualizar"
              : "Criar"}
        </Button>
      </div>
    </form>
  );
};