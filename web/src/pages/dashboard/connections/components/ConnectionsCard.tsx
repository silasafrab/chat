import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography/typography";
import { connectionTypeMap, getConnectionTypeIcon } from "@/lib/connection-types";
import Icon from "@/components/ui/Icon/Icon";
import type { ConnectionType } from "@/types/connection";

interface ConnectionsCardProps {
  name: string;
  description: string;
  type: ConnectionType;
  active: boolean;
  onEdit: () => void;
  onRemove: () => void;
}

export const ConnectionsCard = ({
  name,
  description,
  type,
  active,
  onEdit,
  onRemove,
}: ConnectionsCardProps) => {
  const { color } =
    connectionTypeMap[type] ?? connectionTypeMap.whatsapp;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <span
          className={`flex size-11 items-center justify-center rounded-full bg-primary ${color}`}
        >
          <Icon icon={getConnectionTypeIcon(type)} className="size-5 text-primary-foreground" />
        </span>
        <Badge variant={active ? "default" : "outline"}>
          {active ? "Ativo" : "Inativo"}
        </Badge>
      </CardHeader>
      <CardContent>
        <Typography type="heading-s" className="font-bold">
          {name}
        </Typography>
        <Typography type="body-s" className="text-muted-foreground">
          {description || "Sem descrição"}
        </Typography>
      </CardContent>
      <CardFooter className="flex justify-end gap-1">
        <Button variant="outline" onClick={onEdit}>Editar</Button>
        <Button variant="destructive" onClick={onRemove}>Remover</Button>
      </CardFooter>
    </Card>
  );
};