import { Mail, Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";
import type { IFunnyMessage } from "../../../types/funny-message";
import FunnyMessageCard from "./funny-message-card";
import FunnyMessageCardsSkeleton from "./funny-message-card-skeleton";

interface IFunnyMessagesListProps {
  messages: IFunnyMessage[];
  isLoading: boolean;
  currentUserId?: string;
  onEdit?: (msgId: string) => void;
  onDelete?: (msg: IFunnyMessage) => void;
  onCreate?: () => void;
  canCreate?: boolean;
  hasActiveFilters?: boolean;
}

export const FunnyMessagesList = ({
  messages,
  isLoading,
  currentUserId,
  onEdit,
  onDelete,
  onCreate,
  canCreate,
  hasActiveFilters = false,
}: IFunnyMessagesListProps) => {
  if (isLoading) {
    return <FunnyMessageCardsSkeleton count={5} />;
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] w-full text-muted-foreground">
        <Mail className="w-20 h-20 mb-4 text-muted-foreground/50" />
        <p className="text-lg font-medium">
          {hasActiveFilters ? "Brak wyników dla wybranego filtra" : "Brak wiadomości do wyświetlenia"}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {hasActiveFilters
            ? "Spróbuj zmienić kryteria wyszukiwania."
            : "Utwórz nową wiadomość, aby rozpocząć dodawanie zabawnych treści."}
        </p>
        {!hasActiveFilters && canCreate && onCreate && (
          <Button onClick={onCreate} className="mt-6 gap-2 shadow-md hover:shadow-lg transition-all">
            <Plus className="w-4 h-4" />
            Dodaj wiadomość
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mt-6">
      {messages.map((msg) => (
        <FunnyMessageCard key={msg._id} msg={msg} currentUserId={currentUserId} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};
