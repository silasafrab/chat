import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Icon from "@/components/ui/Icon/Icon";
import { Typography } from "@/components/ui/typography/typography";
import { cn } from "@/lib/utils";
import type { Contact } from "@/types/contact";
import { formatString } from "@/utils/format-string";

interface ContactsMobileCardProps {
  contacts: Contact[];
  getConnectionName: (connectionId: string) => string;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
  className?: string;
}

function ContactMobileCardItem({
  contact,
  connectionName,
  onEdit,
  onDelete,
}: {
  contact: Contact;
  connectionName: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="font-semibold">
      <CardHeader className="flex flex-row items-center gap-2">
        <span className="bg-primary size-8 shrink-0 text-primary-foreground flex items-center justify-center rounded-full">
          <Icon icon="user" size={18} />
        </span>
        <Typography type="body-s">{contact.name}</Typography>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div>
          <Typography type="body-xs" className="text-muted-foreground">
            Telefone
          </Typography>
          <Typography type="body-s">
            {formatString(contact.phone, "phone")}
          </Typography>
        </div>
        <div>
          <Typography type="body-xs" className="text-muted-foreground">
            Email
          </Typography>
          <Typography type="body-s" className="text-muted-foreground font-normal">
            {contact.email || "Não cadastrado"}
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
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button size="icon" onClick={onEdit} aria-label={`Editar ${contact.name}`}>
          <Icon icon="edit" />
        </Button>
        <Button
          size="icon"
          variant="destructive"
          onClick={onDelete}
          aria-label={`Excluir ${contact.name}`}
        >
          <Icon icon="trash" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export const ContactsMobileCard = ({
  contacts,
  getConnectionName,
  onEdit,
  onDelete,
  className,
}: ContactsMobileCardProps) => {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {contacts.map((contact) => (
        <ContactMobileCardItem
          key={contact.id}
          contact={contact}
          connectionName={getConnectionName(contact.connectionId)}
          onEdit={() => onEdit(contact)}
          onDelete={() => onDelete(contact)}
        />
      ))}
    </div>
  );
};
