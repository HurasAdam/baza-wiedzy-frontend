import { EditTagModal } from "@/components/tag/edit-tag-modal";
import { TagModal } from "@/components/tag/tag-modal";
import { useFindTagsQuery } from "@/hooks/tags/use-tags";
import { useMemo, useState } from "react";
import TagsHeader from "./components/TagsHeader";
import TagsList from "./components/TagsList";

export const TagsPage = () => {
  const [isCreatingTag, setIsCreatingTag] = useState<boolean>(false);
  const [isEditingTag, setIsEditingTag] = useState(false);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const params = useMemo(() => {
    const searchParams = new URLSearchParams();
    if (searchTerm) searchParams.append("name", searchTerm);
    return searchParams;
  }, [searchTerm]);

  const { data: tags = [], isLoading, isError, error } = useFindTagsQuery(params);

  const onCreateTag = (): void => {
    setIsCreatingTag(true);
  };

  const onEditTag = (tagID: string): void => {
    setEditingTagId(tagID);
    setIsEditingTag(true);
  };

  return (
    <div className="mx-auto pb-6">
      <TagsHeader
        onCreateTag={onCreateTag}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        foundTagsCount={tags.tags && tags.tags.length}
      />

      <TagsList tags={tags} isLoading={isLoading} isError={isError} error={error} onEditTag={onEditTag} />
      <TagModal isCreatingTag={isCreatingTag} setIsCreatingTag={setIsCreatingTag} />
      {editingTagId && (
        <EditTagModal tagId={editingTagId} isEditingTag={isEditingTag} setIsEditingTag={setIsEditingTag} />
      )}
    </div>
  );
};
