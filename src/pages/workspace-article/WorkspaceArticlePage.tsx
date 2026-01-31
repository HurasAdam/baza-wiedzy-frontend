import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { toast } from "sonner";
import { EditWorkspaceArticleModal } from "../../components/workspace-article-edit/EditWorkspaceArticleModal";
import { CreateWorkspaceArticleVariantModal } from "../../components/workspace-article-variant/CreateWorkspaceArticleVariantModal";
import * as animation from "../../constants/animations";
import { useFindWorkspaceArticleQuery } from "../../hooks/workspace-articles/use-workspace-articles";
import type { Folder } from "../workspace-manage-folders/components/ManageFoldersFilters";
import ArticleHeader from "./components/ArticleHeader";
import { ArticleVariants } from "./components/ArticleVariants";

export function WorkspaceArticlePage() {
  const { articleId } = useParams();
  const { folderId: currentFolderId } = useParams();
  const { data: article, isLoading } = useFindWorkspaceArticleQuery(articleId!);
  const [isCreateVariantModalOpen, setIsCreateVariantModalOpen] = useState<boolean>(false);
  const [isEditTitleModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const { folders, permissions } = useOutletContext<{
    folders: Folder[];
    workspace: unknown;
    handleAddFolder: () => void;
  }>();

  const navigate = useNavigate();

  const onAddVariant = () => {
    setIsCreateVariantModalOpen(true);
  };

  const onArticleEdit = () => {
    setIsEditModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <span className="animate-spin w-8 h-8 block rounded-full border-4 border-gray-300 border-t-primary"></span>
      </div>
    );
  }

  if (!article) {
    return <p className="text-center mt-10">Nie znaleziono artykułu</p>;
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Odpowiedź skopiowana do schowka", { position: "bottom-right" });
  };

  return (
    <motion.div
      variants={animation.pageFadePremium}
      initial="init"
      animate="visible"
      exit="exit"
      className="mx-auto max-w-[1380px]  py-1 space-y-6"
    >
      <ArticleHeader
        title={article.title}
        folderName={article.folder.name}
        createdBy={article.createdBy}
        createdAt={article.createdAt}
        onBack={() => navigate(-1)}
        onAddVariant={onAddVariant}
        onArticleEdit={onArticleEdit}
        permissions={permissions}
      />

      <ArticleVariants
        articleId={article._id}
        variants={article.responseVariants}
        onCopy={copyToClipboard}
        permissions={permissions}
      />

      <CreateWorkspaceArticleVariantModal
        isOpen={isCreateVariantModalOpen}
        articleId={article?._id}
        onClose={() => setIsCreateVariantModalOpen(false)}
      />

      {isEditTitleModalOpen && currentFolderId && (
        <EditWorkspaceArticleModal
          isOpen={isEditTitleModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          article={article}
          folders={folders}
          currentFolderId={currentFolderId}
          navigate={navigate}
        />
      )}
    </motion.div>
  );
}
