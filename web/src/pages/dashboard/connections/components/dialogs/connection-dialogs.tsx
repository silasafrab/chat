import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConnectionForm, type ConnectionFormData } from "../forms/connection-form";
import type { Connection } from "@/types/connection";

type CreateConnectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ConnectionFormData) => Promise<void>;
  isSubmitting: boolean;
};

export const CreateConnectionDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: CreateConnectionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova conexão</DialogTitle>
        </DialogHeader>
        <ConnectionForm
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

type EditConnectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connection: Connection | null;
  onSubmit: (data: ConnectionFormData) => Promise<void>;
  isSubmitting: boolean;
};

export const EditConnectionDialog = ({
  open,
  onOpenChange,
  connection,
  onSubmit,
  isSubmitting,
}: EditConnectionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar conexão</DialogTitle>
        </DialogHeader>
        <ConnectionForm
          initialData={connection ?? undefined}
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