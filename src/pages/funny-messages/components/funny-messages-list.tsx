import type { IFunnyMessage } from "../../../types/funny-message";
import FunnyMessageCard from "./funny-message-card";
import FunnyMessageCardsSkeleton from "./funny-message-card-skeleton";

interface IFunnyMessagesListProps {
  messages: IFunnyMessage[];
  isLoading: boolean;
}

export const FunnyMessagesList = ({
  messages,
  isLoading,
}: IFunnyMessagesListProps) => {
  if (isLoading) {
    // Pokaż 3 skeletony (lub tyle ile chcesz)
    return <FunnyMessageCardsSkeleton count={5} />;
  }

  if (!messages || messages.length === 0)
    return (
      <p className="text-muted-foreground text-center py-12 italic">
        Brak wiadomości do wyświetlenia.
      </p>
    );

  return (
    <div className="space-y-8">
      {messages.map((msg) => (
        <FunnyMessageCard msg={msg} />
      ))}
    </div>
  );
};
