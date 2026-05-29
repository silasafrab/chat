import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import { Typography } from "@/components/ui/typography/typography";
import Icon from "@/components/ui/Icon/Icon";
import { getConnectionTypeIcon } from "@/lib/connection-types";
import {

  Clock,
  Send,

  MessageSquare,
} from "lucide-react";
import type { Message } from "@/types/message";
import type { Contact } from "@/types/contact";

type MessageDetailsSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: Message | null;
  connectionName: string;
  connectionType: string | undefined;
  contacts: Contact[];
};

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <Typography type="body-xs" className="mb-0.5 text-muted-foreground">
          {label}
        </Typography>
        <Typography type="body-s" className="font-medium">
          {children}
        </Typography>
      </div>
    </div>
  );
}

export function MessageDetailsSheet({
  open,
  onOpenChange,
  message,
  connectionName,
  connectionType,
  contacts,
}: MessageDetailsSheetProps) {
  if (!message) return null;

  const getContactNames = (contactIds: string[]) =>
    contactIds
      .map((id) => contacts.find((c) => c.id === id)?.name)
      .filter(Boolean)
      .join(", ");

  const statusLabel =
    message.status === "sent"
      ? "Enviada"
      : message.status === "blocked"
        ? "Bloqueada"
        : "Agendada";

  const statusVariant =
    message.status === "sent"
      ? "default"
      : message.status === "blocked"
        ? "destructive"
        : "outline";

  const StatusIcon =
    message.status === "sent"
      ? Send
      : message.status === "blocked"
        ? MessageSquare
        : Clock;

  return (
    <Sheet open={open} onOpenChange={onOpenChange} >
      <SheetContent side="right" className="sm:max-w-lg border-none">
        <SheetHeader className="pb-2">
          <SheetTitle>Detalhes da mensagem</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] pr-3">
          <div className="px-6 space-y-3 pt-10">
            <div className="flex justify-between" >

              <Typography type="heading-s" className="font-semibold">
                Mensagem
              </Typography>
              <Badge>
                {message.status === "sent" ? "Mensagem enviada" : message.status === "blocked" ? "Envio bloqueado" : "Aguardando envio"}
              </Badge>
            </div>
            <div className="border border-border/20 p-5 rounded-lg ">
              <Typography type="body-l" className="font-semibold">
                {message.title}
              </Typography>
              <Typography type="body-s" className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                {message.content}
              </Typography>
            </div>
            <div className="space-y-3">
              <Typography type="heading-s" className="font-semibold">
                Conexão utilizada
              </Typography>
              <div className="space-x-2 flex items-center">
                <Icon
                  icon={getConnectionTypeIcon((connectionType as any) ?? "whatsapp")}
                  size={16}
                  className="text-primary"
                />
                <Typography type="body-l" className="font-semibold">{connectionName}</Typography>
              </div>

              <div className="border border-border/20 p-5 rounded-lg">
                <Typography type="body-l" className="font-medium mb-3">
                  Destinatários
                </Typography>
                {getContactNames(message.contactIds) || (
                  <span className="text-muted-foreground">Nenhum contato</span>
                )}

                <Typography type="body-xs" className="mt-2 text-muted-foreground">
                  {message.contactIds.length === 0
                    ? "Nenhum contato selecionado"
                    : message.contactIds.length === 1
                      ? "1 contato selecionado"
                      : `${message.contactIds.length} contatos selecionados`}
                </Typography>
              </div>
            </div>
            <div className="">
              {message.scheduledAt && (
                <div className="">
                  <DetailRow
                    icon={<Icon icon="calendar" />}
                    label="Agendado para"
                  >
                    {format(message.scheduledAt, "dd/MM/yyyy 'às' HH:mm")}
                  </DetailRow>
                </div>
              )}
              <div className="mt-3">
                <DetailRow
                  icon={<Icon icon="alarm-clock" />}
                  label="Criada em"
                >
                  {format(message.createdAt, "dd/MM/yyyy 'às' HH:mm")}
                </DetailRow>
              </div>
            </div>
          </div>

        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}