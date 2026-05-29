import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SvgTrash } from "../svg/SvgTrash";

type ConfirmDeleteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void | Promise<void>;
  isDeleting?: boolean;
};

export const ConfirmDelete = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  isDeleting,
}: ConfirmDeleteProps) => {
  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>

        </DialogHeader>
        <SvgTrash className="max-h-36 mx-auto" />
        <DialogDescription className="text-center">{description}</DialogDescription>
        <div className="flex justify-end gap-2">
          <Button
            type="button"

            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            disabled={isDeleting}
            onClick={handleConfirm}
          >
            {isDeleting ? "Deletando..." : "Deletar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};