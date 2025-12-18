import type { AxiosError } from "axios";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import queryClient from "../../config/query.client";
import { useFindOneFlagQuery, useUpdateOneFlagMutation } from "../../hooks/flag/user-flag";

import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import FlagForm from "./flag-form";

// Predefiniowane kolory
export const colorOptions = ["#E53E3E", "#3182CE", "#2F855A", "#D69E2E", "#6B46C1", "#DD6B20", "#38B2AC", "#4A5568"];

// Schemat
export const flagSchema = z.object({
  name: z.string().min(1, "Nazwa flagi jest wymagana"),
  color: z.string().min(1, "Kolor flagi jest wymagany"),
});

export type FlagForm = z.infer<typeof flagSchema>;

interface FlagModalProps {
  selectedFlag: string | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const EditFlagModal = ({ selectedFlag, isOpen, setIsOpen }: FlagModalProps) => {
  const { data: flag } = useFindOneFlagQuery(selectedFlag!);
  const { mutate, isPending } = useUpdateOneFlagMutation();

  const onClose = () => setIsOpen(false);

  const onSubmit = (data: FlagForm) => {
    if (!selectedFlag) return;

    mutate(
      { flagId: selectedFlag, data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["my-flags-with-stats"],
          });
          queryClient.invalidateQueries({
            queryKey: ["my-flag", selectedFlag],
          });

          onClose();
          toast.success("Zmiany zostały zapisane", {
            position: "bottom-right",
            description: "Wybrana etykieta została zaktualizowana",
          });
        },
        onError: (error) => {
          const { status } = error as AxiosError;

          if (status === 409) {
            toast.error("Wystąpił błąd", {
              position: "bottom-right",
              description: "Istnieje już etykieta o podanej nazwie. Nazwa musi być unikalna.",
            });
          } else if (status === 403) {
            toast.error("Brak wymaganych uprawnień.");
          } else {
            toast.error("Wystąpił błąd, spróbuj ponownie.");
          }
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
      <DialogContent className="max-h-[80vh] overflow-y-auto focus:outline-none">
        {/* ===== Header ===== */}
        <div className="space-y-2 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted/40">
              <Pencil className="h-4 w-4 text-muted-foreground" />
            </div>

            <DialogTitle className="text-lg font-semibold leading-none">Edytuj etykietę</DialogTitle>
          </div>

          <p className="text-sm text-muted-foreground max-w-[420px]">
            Zaktualizuj nazwę lub kolor etykiety, aby lepiej dopasować ją do swoich potrzeb
          </p>
        </div>

        {/* ===== Form ===== */}
        <FlagForm
          key={flag?._id}
          defaultValues={flag ?? { name: "", color: "" }}
          onSubmit={onSubmit}
          isSaving={isPending}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
