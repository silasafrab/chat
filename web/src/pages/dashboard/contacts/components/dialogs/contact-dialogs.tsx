import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContactForm, type ContactFormData } from "../forms/contact-form";
import type { Contact } from "@/types/contact";

type CreateContactDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ContactFormData) => Promise<void>;
  isSubmitting: boolean;
};

export const CreateContactDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: CreateContactDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo contato</DialogTitle>
        </DialogHeader>
        <ContactForm
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

type EditContactDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
  onSubmit: (data: ContactFormData) => Promise<void>;
  isSubmitting: boolean;
};

export const EditContactDialog = ({
  open,
  onOpenChange,
  contact,
  onSubmit,
  isSubmitting,
}: EditContactDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar contato</DialogTitle>
        </DialogHeader>
        <ContactForm
          initialData={contact ?? undefined}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          onClose={() => {
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};