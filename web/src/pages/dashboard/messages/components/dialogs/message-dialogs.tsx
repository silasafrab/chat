import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MessageForm, type MessageFormData } from "../forms/message-form";
import type { Message } from "@/types/message";

type CreateMessageDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MessageFormData) => Promise<void>;
  isSubmitting: boolean;
};

export const CreateMessageDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: CreateMessageDialogProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Nova mensagem</SheetTitle>
        </SheetHeader>
        <MessageForm
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          onClose={() => onOpenChange(false)}
        />
      </SheetContent>
    </Sheet>
  );
};

type EditMessageDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: Message | null;
  onSubmit: (data: MessageFormData) => Promise<void>;
  isSubmitting: boolean;
};

export const EditMessageDialog = ({
  open,
  onOpenChange,
  message,
  onSubmit,
  isSubmitting,
}: EditMessageDialogProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} >
      <SheetContent side="right" className="sm:max-w-lg ">
        <SheetHeader>
          <SheetTitle>Editar mensagem</SheetTitle>
        </SheetHeader>
        <MessageForm
          initialData={message ?? undefined}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          onClose={() => onOpenChange(false)}
        />
      </SheetContent>
    </Sheet>
  );
};