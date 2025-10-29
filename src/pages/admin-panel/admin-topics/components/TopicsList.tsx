import { Ellipsis, FileIcon, Loader, Pin, XCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { Dropdown } from "../../../../components/Dropdown";
import { Button } from "../../../../components/ui/button";
import type { Product } from "../../admin-products/components/ProductsList";

interface Topic {
  _id: string;
  title: string;
  product: Product;
  createdBy: string;
  __v: number;
}

interface TopicsListProps {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  topics: Topic[];
  onEditTopic: (topicId: string) => void;
}

const TopicsList = ({ isLoading, isError, error, topics, onEditTopic }: TopicsListProps) => {
  return (
    <div className="bg-card border rounded-xl overflow-hidden">
      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader className="animate-spin w-6 h-6" />
        </div>
      )}

      {isError && (
        <p className="text-destructive text-center py-10">
          {(error as Error)?.message || "Błąd podczas ładowania produktów"}
        </p>
      )}

      {!isLoading && !isError && topics.length === 0 && <p className="text-center py-10">Nie znaleziono produktów</p>}

      {!isLoading && !isError && topics.length > 0 && (
        <ul className="divide-y divide-border">
          {topics.map((topic: Topic) => (
            <li
              key={topic._id}
              className="flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition group"
            >
              <div className="flex items-center gap-3">
                <span className="inline-block w-5 h-5 rounded-full">
                  <Pin className="w-5 h-5 text-muted-foreground" />
                </span>

                <div className="flex flex-col space-y-0.5">
                  <span className="text-sm font-medium text-foreground">{topic.title}</span>
                  <span className="text-xs text-muted-foreground">Produkt: {topic.product.name}</span>
                </div>
              </div>

              <div className="flex gap-40 items-center">
                <Dropdown
                  withSeparators
                  triggerBtn={
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition">
                      <Ellipsis className="w-4 h-4" />
                    </Button>
                  }
                  options={[
                    {
                      label: "Edytuj",
                      icon: <FileIcon className="w-4 h-4" />,
                      actionHandler: () => onEditTopic(topic._id),
                    },
                    {
                      label: "Usuń",
                      icon: <XCircleIcon className="w-4 h-4 text-red-500" />,
                      actionHandler: () => toast.error(`Usuń ${topic.title}`),
                    },
                  ]}
                  position={{ align: "end" }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopicsList;
