import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { HeaderTitle } from "@/components/composites/header-title";
import { FilterBar } from "@/components/composites/filter-bar";
import { useContacts } from "@/hooks/use-contacts";
import { useConnections } from "@/hooks/use-connections";
import {
  CreateContactDialog,
  EditContactDialog,
} from "./components/dialogs/contact-dialogs";
import { ContactForm, type ContactFormData } from "./components/forms/contact-form";
import type { Contact, CreateContactData } from "@/types/contact";
import { EmptyCard } from "@/components/composites/emptyCard";
import { ConfirmDelete } from "@/components/composites/confirm-delete";
import { formatString } from "@/utils/format-string";
import Icon from "@/components/ui/Icon/Icon";
import { Typography } from "@/components/ui/typography/typography";
import { ContactsMobileCard } from "./components/contactsMobileCard";

export default function ContactsPage() {
  const { contacts, loading, create, update, remove } = useContacts();
  const { connections } = useConnections();
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [connectionFilter, setConnectionFilter] = useState("");

  const connectionOptions = [
    { value: "all", label: "Todas" },
    ...connections.map((c) => ({ value: c.id, label: c.name })),
  ];

  const toContactPayload = (data: ContactFormData): CreateContactData => ({
    name: data.name,
    phone: data.phone,
    connectionId: data.connectionId,
    email: data.email ?? "",
  });

  const handleCreate = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await create(toContactPayload(data));
      toast.success("Contato criado com sucesso!");
    } catch {
      toast.error("Erro ao criar contato.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: ContactFormData) => {
    if (!editingContact) return;
    setIsSubmitting(true);
    try {
      await update(editingContact.id, toContactPayload(data));
      toast.success("Contato atualizado com sucesso!");
    } catch {
      toast.error("Erro ao atualizar contato.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await remove(deleteTarget.id);
      toast.success("Contato deletado com sucesso!");
    } catch {
      toast.error("Erro ao deletar contato.");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const getConnectionName = (connectionId: string) =>
    connections.find((c) => c.id === connectionId)?.name ?? "Não atribuída";

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      !search ||
      contact.name.toLowerCase().includes(search.toLowerCase()) ||
      contact.phone.includes(search) ||
      (contact.email || "").toLowerCase().includes(search.toLowerCase());

    const matchesConnection =
      !connectionFilter || connectionFilter === "all" || contact.connectionId === connectionFilter;

    return matchesSearch && matchesConnection;
  });

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
        title="Contatos"
        subtitle="Gerencie seus contatos e organize-os por conexão."
        button="Novo contato"
        buttonFn={() => setCreateOpen(true)}
      />



      <CreateContactDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
      />

      <EditContactDialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setEditingContact(null);
        }}
        contact={editingContact}
        onSubmit={handleUpdate}
        isSubmitting={isSubmitting}
      />

      {contacts.length === 0 ? (
        <EmptyCard
          variant="file"
          title="Nenhum contato"
          description="Crie seu primeiro contato para começar."
          button="Novo contato"
          buttonFn={() => setCreateOpen(true)}
        />
      ) : (

        <>
          <div className="space-y-3 md:hidden">
            <FilterBar
              variante="full"
              search={{ value: search, onChange: setSearch, placeholder: "Buscar contato..." }}
              selects={[
                {
                  label: "Conexão",
                  value: connectionFilter,
                  onValueChange: setConnectionFilter,
                  options: connectionOptions,
                },
              ]}
            />
            {filteredContacts.length === 0 ? (
              <EmptyCard
                embedded
                variant="search"
                title="Nenhum contato encontrado"
                description="Tente ajustar seus filtros ou buscar por outro termo."
                button="Limpar filtros"
                buttonFn={() => {
                  setSearch("");
                  setConnectionFilter("");
                }}
              />
            ) : (
              <ContactsMobileCard
                contacts={filteredContacts}
                getConnectionName={getConnectionName}
                onEdit={(contact) => {
                  setEditingContact(contact);
                  setEditOpen(true);
                }}
                onDelete={setDeleteTarget}
              />
            )}
          </div>

          <Card className="hidden px-5 md:block">
            <Typography type="heading-s" className="font-bold">
              Lista de contatos
            </Typography>
            <FilterBar
              variante="compact"
              search={{ value: search, onChange: setSearch, placeholder: "Buscar contato..." }}
              selects={[
                {
                  label: "Conexão",
                  value: connectionFilter,
                  onValueChange: setConnectionFilter,
                  options: connectionOptions,
                },
              ]}
            />

            {filteredContacts.length === 0 ? (
              <EmptyCard
                embedded
                variant="search"
                title="Nenhum contato encontrado"
                description="Tente ajustar seus filtros ou buscar por outro termo."
                button="Limpar filtros"
                buttonFn={() => {
                  setSearch("");
                  setConnectionFilter("");
                }}
              />
            ) : (
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Conexão</TableHead>
                      <TableHead className="w-[120px] text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell className="">
                          <div className="font-medium flex items-center gap-2 ">

                            <span className="bg-primary size-8 text-primary-foreground flex items-center justify-center rounded-full">
                              <Icon icon="user" size={18} />
                            </span>
                            {contact.name}
                          </div>
                        </TableCell>
                        <TableCell>{formatString(contact.phone, "phone")}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {contact.email || "Não Cadastrado"}
                        </TableCell>
                        <TableCell>{getConnectionName(contact.connectionId)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Dialog
                              open={editOpen && editingContact?.id === contact.id}
                              onOpenChange={(open) => {
                                setEditOpen(open);
                                if (!open) setEditingContact(null);
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button

                                  size="icon"
                                  onClick={() => setEditingContact(contact)}
                                >
                                  <Icon icon="edit" />

                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Editar contato</DialogTitle>
                                </DialogHeader>
                                <ContactForm
                                  initialData={editingContact ?? undefined}
                                  onSubmit={handleUpdate}
                                  isSubmitting={isSubmitting}
                                  onClose={() => {
                                    setEditOpen(false);
                                    setEditingContact(null);
                                  }}
                                />
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => setDeleteTarget(contact)}
                            >
                              <Icon icon="trash" />

                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            )}
          </Card>
        </>
      )}

      <ConfirmDelete
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title={`Deletar contato "${deleteTarget?.name ?? ""}"?`}
        description="Esta ação não pode ser desfeita. Todos os dados relacionados serão removidos permanentemente."
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}