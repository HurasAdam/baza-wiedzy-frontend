import { Loader } from "lucide-react";
import FaqCard from "./FaqCard";

export interface Faq {
  _id: string;
  title: string;
  description: string;
  sliug: string;
  items: number;
  labelColor: string;
  isDefault: boolean;
  iconyKey: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface FaqsListProps {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onSetFaqAsDefault: (faqId: string) => void;
  navigate: (url: string) => void;
  faqs: Faq[];
}

const FaqsList = ({ isLoading, isError, error, faqs, onSetFaqAsDefault, navigate }: FaqsListProps) => {
  return (
    <div className="bg-card border rounded-xl overflow-hidden">
      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader className="animate-spin w-6 h-6" />
        </div>
      )}

      {isError && (
        <p className="text-destructive text-center py-10">
          {(error as Error)?.message || "Błąd podczas ładowania projektów"}
        </p>
      )}

      {!isLoading && !isError && faqs.length === 0 && <p className="text-center py-10">Nie znaleziono projektów</p>}

      {!isLoading && !isError && faqs.length > 0 && (
        <ul className="divide-y divide-border">
          {faqs.map((faq) => (
            <FaqCard faq={faq} navigate={navigate} onSetFaqAsDefault={onSetFaqAsDefault} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default FaqsList;
