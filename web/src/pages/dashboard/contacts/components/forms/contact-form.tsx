import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConnections } from "@/hooks/use-connections";
import type { Contact } from "@/types/contact";

const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  phone: z.string().min(1, "O telefone é obrigatório"),
  email: z.union([z.string().email("Email inválido"), z.literal("")]),
  connectionId: z.string().min(1, "Selecione uma conexão"),
});

type FormData = z.infer<typeof formSchema>;

type ContactFormProps = {
  initialData?: Contact;
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting: boolean;
  onClose: () => void;
};

export type { FormData as ContactFormData };

export const ContactForm = ({
  initialData,
  onSubmit,
  isSubmitting,
  onClose,
}: ContactFormProps) => {
  const { connections } = useConnections();

  const form = useForm<FormData>({
    defaultValues: {
      name: initialData?.name ?? "",
      phone: initialData?.phone ?? "",
      email: initialData?.email ?? "",
      connectionId: initialData?.connectionId ?? "",
    },
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = async (data: FormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Nome</FieldLabel>
            <Input
              aria-invalid={fieldState.invalid}
              placeholder="Nome do contato"
              {...field}
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="phone"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Telefone</FieldLabel>
            <Input
              aria-invalid={fieldState.invalid}
              placeholder="(11) 99999-9999"
              mask="phone"
              {...field}
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Email</FieldLabel>
            <Input
              aria-invalid={fieldState.invalid}
              placeholder="email@exemplo.com"
              type="email"
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
                <SelectValue placeholder="Selecione uma conexão" />
              </SelectTrigger>
              <SelectContent>
                {connections.map((connection) => (
                  <SelectItem key={connection.id} value={connection.id}>
                    {connection.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : initialData ? "Atualizar" : "Criar"}
        </Button>
      </div>
    </form>
  );
};