import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useOutletContext, useParams, useSearchParams } from "react-router-dom";
import WorkspaceArticleDrawer from "../../components/workspace-article-drawer/WorkspaceArticleDrawer";
import * as animation from "../../constants/animations";
import { useFindArticlesByFolderQuery } from "../../hooks/workspace-articles/use-workspace-articles";
import { useFindOneWorkspaceFolderQuery } from "../../hooks/workspace-folders/use-workspace-folder";
import WorkspaceArticleFilters from "./components/WorkspaceArticleFilters";
import WorkspaceArticlesList from "./components/WorkspaceArticlesList";
import { WorkspaceFolderHeader } from "./components/WorkspaceFolderHeader";

export function WorkspaceFolderPage() {
  const { folderId } = useParams();
  const { workspaceId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hoveredArticleId, setHoveredArticleId] = useState<string | null>(null);
  const hoveredArticleIdRef = useRef<string | null>(null);
  const titleParam = searchParams.get("title") || "";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  const { data, isLoading, isError } = useFindArticlesByFolderQuery({
    folderId: folderId!,
    title: titleParam,
    page: pageParam,
  });

  const { data: folderData, isLoading: isFolderDataLoading } = useFindOneWorkspaceFolderQuery(workspaceId, folderId);
  const { permissions } = useOutletContext();

  const onResetAllFilters = () => {
    setSearchParams({});
  };

  const changeTitleHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchParams((prev) => {
      if (value) prev.set("title", value);
      else prev.delete("title");
      prev.delete("page");
      return prev;
    });
  };

  const openArticleDrawer = (articleId: string) => {
    setSelectedArticleId(articleId);
    setIsDrawerOpen(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "v") {
        const currentHoveredId = hoveredArticleIdRef.current;
        console.log("DUPA");
        if (!isDrawerOpen && currentHoveredId) {
          // Otwórz drawer jeśli najechano na artykuł
          openArticleDrawer(currentHoveredId);
        } else if (isDrawerOpen) {
          setIsDrawerOpen(false);
          setSelectedArticleId(null);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen]);

  return (
    <motion.div
      variants={animation.pageFadePremium}
      initial="init"
      animate="visible"
      exit="exit"
      className="flex flex-col pb-5 max-w-[1320px] py-3.5  mx-auto "
    >
      <WorkspaceFolderHeader folder={folderData} isLoading={isFolderDataLoading} permissions={permissions} />

      <WorkspaceArticleFilters
        selectedTitle={titleParam}
        selectedPage={pageParam}
        currentPage={pageParam}
        totalPages={data?.pagination.pages}
        onTitleChange={changeTitleHandler}
        onResetAll={onResetAllFilters}
        resultsCount={data?.pagination.total}
      />

      <WorkspaceArticlesList
        workspaceId={folderData?.workspaceId}
        folderId={folderData?._id}
        articles={{
          data: data?.data ?? [],
          pagination: data?.pagination,
        }}
        selectedTitle={titleParam}
        isLoading={isLoading}
        isError={isError}
        onResetAllFilters={onResetAllFilters}
        toggleFavourite={() => {}}
        pendingId={null}
        openArticleDrawer={openArticleDrawer}
        setHoveredArticleId={setHoveredArticleId}
        setHoveredArticleIdRef={(id) => (hoveredArticleIdRef.current = id)}
      />

      <WorkspaceArticleDrawer
        articleId={selectedArticleId}
        open={isDrawerOpen}
        onOpenChange={(open) => {
          setIsDrawerOpen(open);
          if (!open) setSelectedArticleId(null);
        }}
      />
    </motion.div>
  );
}
