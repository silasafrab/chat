import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import { connectionTypeMap, connectionTypes } from "@/lib/connection-types";
import type { Connection } from "@/types/connection";

const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  description: z.string(),
  type: z.enum(["whatsapp", "telegram", "sms", "email"], {
    required_error: "Selecione um tipo",
  }),
  active: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

type ConnectionFormProps = {
  initialData?: Connection;
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting: boolean;
  onClose: () => void;
};

export type { FormData as ConnectionFormData };

export const ConnectionForm = ({
  initialData,
  onSubmit,
  isSubmitting,
  onClose,
}: ConnectionFormProps) => {
  const form = useForm<FormData>({
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      type: initialData?.type ?? "whatsapp",
      active: initialData?.active ?? true,
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
            <FieldLabel>Nome da conexão</FieldLabel>
            <Input
              aria-invalid={fieldState.invalid}
              placeholder="Ex: WhatsApp Principal"
              {...field}
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="description"
        render={({ field }) => (
          <Field>
            <FieldLabel>Descrição</FieldLabel>
            <Textarea
              placeholder="Descrição da conexão (opcional)"
              className="min-h-[80px]"
              {...field}
            />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="type"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Tipo</FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                aria-invalid={fieldState.invalid}
                className="w-full"
              >
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {connectionTypes.map((type) => {
                  const { icon: Icon, color } = connectionTypeMap[type.value];
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <span className="flex items-center gap-2">
                        <Icon className={`size-4 ${color}`} />
                        {type.label}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="active"
        render={({ field }) => (
          <div className="flex items-center justify-between rounded-3xl border p-4">
            <div>
              <p className="text-sm font-medium">Ativo</p>
              <p className="text-xs text-muted-foreground">
                {field.value
                  ? "Conexão ativa e disponível"
                  : "Conexão inativa"}
              </p>
            </div>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </div>
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