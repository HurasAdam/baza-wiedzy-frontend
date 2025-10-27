import { Loader } from "lucide-react";
import TagCard from "./TagCard";

export interface Tag {
  _id: string;
  name: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isUsed: boolean;
  __v: number;
}

interface TagsListProps {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  tags: Tag[];
  onEditTag: (tagId: string) => void;
}

const TagsList = ({ isLoading, isError, error, tags, onEditTag }: TagsListProps) => {
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

      {!isLoading && !isError && tags.tags.length === 0 && (
        <p className="text-center py-10">Nie znaleziono produktów</p>
      )}

      {!isLoading && !isError && tags.tags.length > 0 && (
        <ul className="divide-y divide-border">
          {tags.tags.map((tag: Tag) => (
            <TagCard key={tag._id} tag={tag} onEditTag={onEditTag} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagsList;
