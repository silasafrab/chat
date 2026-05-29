import { useState } from "react";
import { toast } from "sonner";

import { useConnections } from "@/hooks/use-connections";
import { HeaderTitle } from "@/components/composites/header-title";
import { FilterBar } from "@/components/composites/filter-bar";
import { ConnectionsCard } from "./components/ConnectionsCard";
import {
  CreateConnectionDialog,
  EditConnectionDialog,
} from "./components/dialogs/connection-dialogs";
import type { Connection } from "@/types/connection";
import { EmptyCard } from "@/components/composites/emptyCard";
import { ConfirmDelete } from "@/components/composites/confirm-delete";

const typeOptions = [
  { value: "all", label: "Todos" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "telegram", label: "Telegram" },
  { value: "sms", label: "SMS" },
  { value: "email", label: "Email" },
];

const statusOptions = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Ativo" },
  { value: "inactive", label: "Inativo" },
];

export default function ConnectionsPage() {
  const { connections, loading, create, update, remove } = useConnections();
  const [editingConnection, setEditingConnection] = useState<Connection | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Connection | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const handleCreate = async (data: { name: string; description: string; type: "whatsapp" | "telegram" | "sms" | "email"; active: boolean }) => {
    setIsSubmitting(true);
    try {
      await create(data);
      toast.success("Conexão criada com sucesso!");
    } catch {
      toast.error("Erro ao criar conexão.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: { name: string; description: string; type: "whatsapp" | "telegram" | "sms" | "email"; active: boolean }) => {
    if (!editingConnection) return;
    setIsSubmitting(true);
    try {
      await update(editingConnection.id, data);
      toast.success("Conexão atualizada com sucesso!");
    } catch {
      toast.error("Erro ao atualizar conexão.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await remove(deleteTarget.id);
      toast.success("Conexão deletada com sucesso!");
    } catch {
      toast.error("Erro ao deletar conexão.");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const filteredConnections = connections.filter((connection) => {
    const matchesSearch =
      !search ||
      connection.name.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      !typeFilter || typeFilter === "all" || connection.type === typeFilter;

    const matchesStatus =
      !statusFilter ||
      statusFilter === "all" ||
      (statusFilter === "active" && connection.active) ||
      (statusFilter === "inactive" && !connection.active);

    return matchesSearch && matchesType && matchesStatus;
  });

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("");
    setStatusFilter("");
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <HeaderTitle
        title="Conexões"
        subtitle="Gerencie suas conexões de envio e organize campanhas de mensagens para seus contatos."
        button="Nova conexão"
        buttonFn={() => setCreateOpen(true)}
      />

      <FilterBar
        search={{ value: search, onChange: setSearch, placeholder: "Buscar conexão..." }}
        selects={[
          { label: "Tipo", value: typeFilter, onValueChange: setTypeFilter, options: typeOptions },
          { label: "Status", value: statusFilter, onValueChange: setStatusFilter, options: statusOptions },
        ]}
      />

      <CreateConnectionDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
      />

      <EditConnectionDialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setEditingConnection(null);
        }}
        connection={editingConnection}
        onSubmit={handleUpdate}
        isSubmitting={isSubmitting}
      />

      {connections.length === 0 ? (
        <EmptyCard
          variant="file"
          title="Nenhuma conexão"
          description="Crie sua primeira conexão para começar."
          button="Nova conexão"
          buttonFn={() => setCreateOpen(true)}
        />
      ) : filteredConnections.length === 0 ? (
        <EmptyCard
          variant="search"
          title="Nenhuma conexão encontrada"
          description="Tente ajustar seus filtros ou buscar por outro termo."
          button="Limpar filtros"
          buttonFn={clearFilters}
        />

      ) : (
        <div className="grid grid-cols-4 gap-3">
          {filteredConnections.map((connection) => (
            <ConnectionsCard
              key={connection.id}
              name={connection.name}
              description={connection.description}
              active={connection.active}
              type={connection.type}
              onEdit={() => {
                setEditingConnection(connection);
                setEditOpen(true);
              }}
              onRemove={() => setDeleteTarget(connection)}
            />
          ))}
        </div>
      )}

      <ConfirmDelete
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title={`Deletar conexão "${deleteTarget?.name ?? ""}"?`}
        description="Esta ação não pode ser desfeita. Todos os dados relacionados serão removidos permanentemente."
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}