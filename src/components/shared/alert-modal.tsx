import { Check, Loader } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { ConfirmationCheckbox } from "./confirmation-checkbox";

interface Props {
  isOpen: boolean;
  children: ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  requireConfirmation?: boolean;
  isConfirmEnabled?: boolean;
  type?: "warning" | "info" | "success" | "default";
  title?: string;
  isLoading: boolean;
}
const titleColors = {
  warning: "text-rose-700/90",
  default: "text-foreground",
  info: "text-indigo-800/80",
  success: "text-green-700/85",
};
export function Alert({
  isOpen,
  title,
  onCancel,
  onConfirm,
  children,
  requireConfirmation = false,
  isConfirmEnabled = false,

  type = "default",
  isLoading,
}: Props) {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsChecked(false);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className={`${titleColors[type]} text-lg font-bold`}>
            {title || "Czy na pewno chcesz kontynuować?"}
          </AlertDialogTitle>
          <AlertDialogDescription className="pt-1.5 pb-0.5">{children}</AlertDialogDescription>
        </AlertDialogHeader>
        {requireConfirmation && isConfirmEnabled && (
          <ConfirmationCheckbox onChange={setIsChecked} checked={isChecked} label="Rozumiem" id="confirmation" />
        )}
        <AlertDialogFooter>
          <AlertDialogCancel className="hover:bg-muted" onClick={onCancel}>
            Anuluj
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={(requireConfirmation && !isChecked) || isLoading}>
            {isLoading ? (
              <>
                <Loader className="animate-spin" />
                Potwierdź
              </>
            ) : (
              <>
                <Check />
                Potwierdź
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
