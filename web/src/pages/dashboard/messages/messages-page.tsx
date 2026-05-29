import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeaderTitle } from "@/components/composites/header-title";
import { FilterBar } from "@/components/composites/filter-bar";
import { EmptyCard } from "@/components/composites/emptyCard";
import { ConfirmDelete } from "@/components/composites/confirm-delete";
import { LoadingState } from "@/components/composites/loading-state";
import Icon from "@/components/ui/Icon/Icon";
import { Typography } from "@/components/ui/typography/typography";
import { useMessages } from "@/hooks/use-messages";
import { useConnections } from "@/hooks/use-connections";
import { usePagination } from "@/hooks/use-pagination";
import {
  CreateMessageDialog,
  EditMessageDialog,
} from "./components/dialogs/message-dialogs";
import { MessagesMobileCard } from "./components/messages-mobile-card";
import type { Message } from "@/types/message";
import type { CreateMessageData, UpdateMessageData } from "@/types/message";
import { ChevronLeftIcon, ChevronRightIcon, Info } from "lucide-react";
import { getConnectionTypeIcon, connectionTypes } from "@/lib/connection-types";
import { useContacts } from "@/hooks/use-contacts";
import { MessageDetailsSheet } from "./components/dialogs/message-details-sheet";

const statusOptions = [
  { value: "all", label: "Todas" },
  { value: "sent", label: "Enviadas" },
  { value: "scheduled", label: "Agendadas" },
  { value: "blocked", label: "Bloqueadas" },
];

const typeOptions = [
  { value: "all", label: "Todos" },
  ...connectionTypes.map((t) => ({ value: t.value, label: t.label })),
];

export default function MessagesPage() {
  const { messages, loading, create, update, remove } = useMessages();
  const { connections } = useConnections();
  const { contacts } = useContacts();

  const connectionOptions = [
    { value: "all", label: "Todas" },
    ...connections.map((c) => ({ value: c.id, label: c.name })),
  ];
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [detailMessage, setDetailMessage] = useState<Message | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Message | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [connectionFilter, setConnectionFilter] = useState("");

  const buildPayload = (data: {
    title: string;
    content: string;
    connectionId: string;
    contactIds: string[];
    sendNow: boolean;
    scheduledDate: Date | null;
    scheduledTime: string;
  }): { title: string; content: string; connectionId: string; contactIds: string[]; scheduledAt: Date | null } => ({
    title: data.title,
    content: data.content,
    connectionId: data.connectionId,
    contactIds: data.contactIds,
    scheduledAt: data.sendNow
      ? null
      : data.scheduledDate && data.scheduledTime
        ? new Date(
          `${format(data.scheduledDate, "yyyy-MM-dd")}T${data.scheduledTime}:00`,
        )
        : null,
  });

  const handleCreate = async (data: Parameters<typeof buildPayload>[0]) => {
    setIsSubmitting(true);
    try {
      await create(buildPayload(data) as CreateMessageData);
      toast.success("Mensagem criada com sucesso!");
    } catch {
      toast.error("Erro ao criar mensagem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: Parameters<typeof buildPayload>[0]) => {
    if (!editingMessage) return;
    setIsSubmitting(true);
    try {
      await update(editingMessage.id, buildPayload(data) as UpdateMessageData);
      toast.success("Mensagem atualizada com sucesso!");
    } catch {
      toast.error("Erro ao atualizar mensagem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await remove(deleteTarget.id);
      toast.success("Mensagem deletada com sucesso!");
    } catch {
      toast.error("Erro ao deletar mensagem.");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const getConnectionName = (connectionId: string) =>
    connections.find((c) => c.id === connectionId)?.name ?? "—";

  const getConnectionType = (connectionId: string) =>
    connections.find((c) => c.id === connectionId)?.type;

  const getContactCount = (contactIds: string[]) => {
    const count = contactIds.length;
    if (count === 0) return "Nenhum contato";
    if (count === 1) return "1 contato";
    return `${count} contatos`;
  };

  const isConnectionActive = (connectionId: string) =>
    connections.find((c) => c.id === connectionId)?.active ?? false;

  const getMessageDisplayStatus = (message: Message): Message["status"] => {
    if (message.status === "scheduled" && !isConnectionActive(message.connectionId)) {
      return "blocked";
    }
    return message.status;
  };

  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      !search ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.content.toLowerCase().includes(search.toLowerCase());

    const displayStatus = getMessageDisplayStatus(m);

    const matchesStatus =
      !statusFilter || statusFilter === "all" || displayStatus === statusFilter;

    const connectionType = getConnectionType(m.connectionId);
    const matchesType =
      !typeFilter || typeFilter === "all" || connectionType === typeFilter;

    const matchesConnection =
      !connectionFilter || connectionFilter === "all" || m.connectionId === connectionFilter;

    return matchesSearch && matchesStatus && matchesType && matchesConnection;
  });

  const { page, totalPages, paginatedItems, goToPage } = usePagination(filteredMessages);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-3">
      <HeaderTitle
        title="Mensagens"
        subtitle="Crie e gerencie suas mensagens, com agendamento e envio para seus contatos."
        button="Nova mensagem"
        buttonFn={() => setCreateOpen(true)}
      />

      <CreateMessageDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
      />

      <EditMessageDialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setEditingMessage(null);
        }}
        message={editingMessage}
        onSubmit={handleUpdate}
        isSubmitting={isSubmitting}
      />

      {messages.length === 0 ? (
        <EmptyCard
          variant="file"
          title="Nenhuma mensagem"
          description="Crie sua primeira mensagem para começar."
          button="Nova mensagem"
          buttonFn={() => setCreateOpen(true)}
        />
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            <FilterBar
              variante="full"
              search={{ value: search, onChange: setSearch, placeholder: "Buscar mensagem..." }}
              selects={[
                { label: "Status", value: statusFilter, onValueChange: setStatusFilter, options: statusOptions },
                { label: "Tipo", value: typeFilter, onValueChange: setTypeFilter, options: typeOptions },
                { label: "Conexão", value: connectionFilter, onValueChange: setConnectionFilter, options: connectionOptions },
              ]}
            />
            {paginatedItems.length === 0 ? (
              <EmptyCard
                embedded
                variant="search"
                title="Nenhuma mensagem encontrada"
                description="Tente ajustar seus filtros ou buscar por outro termo."
                button="Limpar filtros"
                buttonFn={() => {
                  setSearch("");
                  setStatusFilter("");
                  setTypeFilter("");
                  setConnectionFilter("");
                }}
              />
            ) : (
              <MessagesMobileCard
                messages={paginatedItems}
                getConnectionName={getConnectionName}
                getConnectionType={getConnectionType}
                getContactCount={getContactCount}
                getMessageDisplayStatus={getMessageDisplayStatus}
                onDetails={(message) => {
                  setDetailMessage(message);
                  setDetailsOpen(true);
                }}
                onEdit={(message) => {
                  setEditingMessage(message);
                  setEditOpen(true);
                }}
                onDelete={setDeleteTarget}
              />
            )}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 pt-2">
                <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
                  <ChevronLeftIcon className="size-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Button key={p} variant={page === p ? "default" : "outline"} size="icon" onClick={() => goToPage(p)}>
                    {p}
                  </Button>
                ))}
                <Button variant="outline" size="icon" disabled={page >= totalPages} onClick={() => goToPage(page + 1)}>
                  <ChevronRightIcon className="size-4" />
                </Button>
              </div>
            )}
          </div>

          <Card className="hidden px-5 md:block">
            <Typography type="heading-s" className="font-bold mb-3">
              Lista de mensagens
            </Typography>
            <FilterBar
              variante="compact"
              search={{ value: search, onChange: setSearch, placeholder: "Buscar mensagem..." }}
              selects={[
                { label: "Status", value: statusFilter, onValueChange: setStatusFilter, options: statusOptions },
                { label: "Tipo", value: typeFilter, onValueChange: setTypeFilter, options: typeOptions },
                { label: "Conexão", value: connectionFilter, onValueChange: setConnectionFilter, options: connectionOptions },
              ]}
            />

            {paginatedItems.length === 0 ? (
              <EmptyCard
                embedded
                variant="search"
                title="Nenhuma mensagem encontrada"
                description="Tente ajustar seus filtros ou buscar por outro termo."
                button="Limpar filtros"
                buttonFn={() => {
                  setSearch("");
                  setStatusFilter("");
                  setTypeFilter("");
                  setConnectionFilter("");
                }}
              />
            ) : (
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Conteúdo</TableHead>
                      <TableHead>Conexão</TableHead>
                      <TableHead>Contatos</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[120px] text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedItems.map((message) => {
                      const displayStatus = getMessageDisplayStatus(message);
                      return (
                        <TableRow key={message.id}>
                          <TableCell>
                            <div className="flex items-center gap-2 font-medium">
                              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                <Icon icon={getConnectionTypeIcon(getConnectionType(message.connectionId) ?? "whatsapp")} size={18} />
                              </span>
                              {message.title}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {message.content}
                          </TableCell>
                          <TableCell>{getConnectionName(message.connectionId)}</TableCell>
                          <TableCell>
                            {getContactCount(message.contactIds)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={displayStatus === "sent" ? "default" : displayStatus === "blocked" ? "destructive" : "outline"}
                            >
                              {displayStatus === "sent" ? "Enviada" : displayStatus === "blocked" ? "Bloqueada" : "Agendada"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => {
                                  setDetailMessage(message);
                                  setDetailsOpen(true);
                                }}
                              >
                                <Info className="size-4" />
                              </Button>
                              {displayStatus === "scheduled" && (
                                <Button
                                  size="icon"
                                  onClick={() => {
                                    setEditingMessage(message);
                                    setEditOpen(true);
                                  }}
                                >
                                  <Icon icon="edit" />
                                </Button>
                              )}
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => setDeleteTarget(message)}
                              >
                                <Icon icon="trash" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 pt-2 pb-4">
                <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
                  <ChevronLeftIcon className="size-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Button key={p} variant={page === p ? "default" : "outline"} size="icon" onClick={() => goToPage(p)}>
                    {p}
                  </Button>
                ))}
                <Button variant="outline" size="icon" disabled={page >= totalPages} onClick={() => goToPage(page + 1)}>
                  <ChevronRightIcon className="size-4" />
                </Button>
              </div>
            )}
          </Card>
        </>
      )}

      <MessageDetailsSheet
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open);
          if (!open) setDetailMessage(null);
        }}
        message={detailMessage}
        connectionName={getConnectionName(detailMessage?.connectionId ?? "")}
        connectionType={getConnectionType(detailMessage?.connectionId ?? "")}
        contacts={contacts}
      />

      <ConfirmDelete
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title={`Deletar mensagem "${deleteTarget?.title ?? ""}"?`}
        description="Esta ação não pode ser desfeita. Todos os dados relacionados serão removidos permanentemente."
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}