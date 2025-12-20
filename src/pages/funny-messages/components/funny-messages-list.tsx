import type { IFunnyMessage } from "../../../types/funny-message";
import FunnyMessageCard from "./funny-message-card";
import FunnyMessageCardsSkeleton from "./funny-message-card-skeleton";

interface IFunnyMessagesListProps {
  messages: IFunnyMessage[];
  isLoading: boolean;
  currentUserId?: string;
  onEdit?: (msgId: string) => void;
  onDelete?: (msg: IFunnyMessage) => void;
}

export const FunnyMessagesList = ({
  messages,
  isLoading,
  currentUserId,
  onEdit,
  onDelete,
}: IFunnyMessagesListProps) => {
  if (isLoading) {
    return <FunnyMessageCardsSkeleton count={5} />;
  }

  if (!messages || messages.length === 0)
    return <p className="text-muted-foreground text-center py-12 italic">Brak wiadomości do wyświetlenia.</p>;

  return (
    <div className="flex flex-col gap-4 mt-6">
      {messages.map((msg) => (
        <FunnyMessageCard key={msg._id} msg={msg} currentUserId={currentUserId} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};
