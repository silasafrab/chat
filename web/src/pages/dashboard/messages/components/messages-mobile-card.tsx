import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography/typography";
import Icon from "@/components/ui/Icon/Icon";
import { cn } from "@/lib/utils";
import type { Message } from "@/types/message";

interface MessagesMobileCardProps {
  messages: Message[];
  getConnectionName: (connectionId: string) => string;
  getContactNames: (contactIds: string[]) => string;
  getMessageDisplayStatus: (message: Message) => Message["status"];
  onEdit: (message: Message) => void;
  onDelete: (message: Message) => void;
  className?: string;
}

function MessageMobileCardItem({
  message,
  connectionName,
  contactNames,
  getMessageDisplayStatus,
  onEdit,
  onDelete,
}: {
  message: Message;
  connectionName: string;
  contactNames: string;
  getMessageDisplayStatus: (message: Message) => Message["status"];
  onEdit: () => void;
  onDelete: () => void;
}) {
  const displayStatus = getMessageDisplayStatus(message);
  const canEdit = displayStatus === "scheduled";
  return (
    <Card className="font-semibold">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Icon icon="paper-fill" size={18} />
          </span>
          <Typography type="body-s">{message.title}</Typography>
        </div>
        <Badge variant={displayStatus === "sent" ? "default" : displayStatus === "blocked" ? "destructive" : "outline"}>
          {displayStatus === "sent" ? "Enviada" : displayStatus === "blocked" ? "Bloqueada" : "Agendada"}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div>
          <Typography type="body-xs" className="text-muted-foreground">
            Conteúdo
          </Typography>
          <Typography type="body-s" className="font-normal">
            {message.content}
          </Typography>
        </div>
        <div>
          <Typography type="body-xs" className="text-muted-foreground">
            Conexão
          </Typography>
          <Typography type="body-s" className="font-normal">
            {connectionName}
          </Typography>
        </div>
        <div>
          <Typography type="body-xs" className="text-muted-foreground">
            Contatos
          </Typography>
          <Typography type="body-s" className="font-normal">
            {contactNames || "—"}
          </Typography>
        </div>
        {message.scheduledAt && (
          <div>
            <Typography type="body-xs" className="text-muted-foreground">
              Agendamento
            </Typography>
            <Typography type="body-s" className="font-normal">
              {format(message.scheduledAt, "dd/MM/yyyy HH:mm")}
            </Typography>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end gap-2">
        {canEdit && (
          <Button size="icon" onClick={onEdit} aria-label={`Editar ${message.title}`}>
            <Icon icon="edit" />
          </Button>
        )}
        <Button
          size="icon"
          variant="destructive"
          onClick={onDelete}
          aria-label={`Excluir ${message.title}`}
        >
          <Icon icon="trash" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export const MessagesMobileCard = ({
  messages,
  getConnectionName,
  getContactNames,
  getMessageDisplayStatus,
  onEdit,
  onDelete,
  className,
}: MessagesMobileCardProps) => {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {messages.map((message) => (
        <MessageMobileCardItem
          key={message.id}
          message={message}
          connectionName={getConnectionName(message.connectionId)}
          contactNames={getContactNames(message.contactIds)}
          getMessageDisplayStatus={getMessageDisplayStatus}
          onEdit={() => onEdit(message)}
          onDelete={() => onDelete(message)}
        />
      ))}
    </div>
  );
};