import type { AxiosError } from "axios";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import queryClient from "../../config/query.client";
import { useFindOneFlagQuery, useUpdateOneFlagMutation } from "../../hooks/flag/user-flag";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import FlagForm from "./flag-form";

// Predefiniowane kolory
export const colorOptions = [
  "#E53E3E", // Red
  "#3182CE", // Blue
  "#2F855A", // Green
  "#D69E2E", // Yellow
  "#6B46C1", // Purple
  "#DD6B20", // Orange
  "#38B2AC", // Teal
  "#4A5568", // Slate / Navy
];

// Schemat dla formularza flagi
export const flagSchema = z.object({
  name: z.string().min(1, "Nazwa flagi jest wymagana"),
  color: z.string().min(1, "Kolor flagi jest wymagany"),
});

export type FlagForm = z.infer<typeof flagSchema>;

interface FlagModalProps {
  selectedFlag: string | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSave: (data: FlagForm) => void;
  isLoading: boolean;
}

export const EditFlagModal = ({ selectedFlag, isOpen, setIsOpen, onSave }: FlagModalProps) => {
  const { data: flag, isLoading } = useFindOneFlagQuery(selectedFlag!);
  const { mutate } = useUpdateOneFlagMutation();

  const onClose = () => {
    setIsOpen(false);
  };

  const onSubmit = (data: FlagForm) => {
    if (!selectedFlag) return;
    mutate(
      { flagId: selectedFlag, data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["my-flags-with-stats"] });
          queryClient.invalidateQueries({ queryKey: ["my-flag", selectedFlag] });
          onClose();
          toast.success("Zmiany zostały zapisane", {
            position: "bottom-right",
            description: "Wybrana etykieta została zaktualizowana",
          });
        },
        onError: (error) => {
          const { status } = error as AxiosError;

          if (status === 409) {
            toast.error(
              "Wystąpił błąd",

              {
                duration: 6200,
                position: "bottom-right",
                description: "Istnieje już etykieta o wybranej nazie - nazwa etykiety musi być unikalna",
              }
            );
            return;
          } else if (status === 403) {
            toast.error("Brak wymaganych uprawnień do wykonania tej operacji.");
            return;
          } else {
            toast.error("Wystąpił błąd, spróbuj ponownie");
          }
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
      <DialogContent className="max-h-[80vh] overflow-y-auto focus:outline-none">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="border p-1.5 bg-muted rounded-lg">
              <Pencil className="w-4.5 h-4.5" />
            </div>
            Edytuj etykietę
          </DialogTitle>
        </DialogHeader>
        <FlagForm
          key={flag?._id}
          defaultValues={flag ?? { name: "", color: "" }}
          onSubmit={onSubmit}
          isSaving={false}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
