import { useParams, useSearchParams } from "react-router-dom";
import { useFindArticlesByFolderQuery } from "../../hooks/workspace-articles/use-workspace-articles";
import { useFindOneWorkspaceFolderQuery } from "../../hooks/workspace-folders/use-workspace-folder";
import WorkspaceArticleFilters from "./components/WorkspaceArticleFilters";
import WorkspaceArticlesList from "./components/WorkspaceArticlesList";
import { WorkspaceFolderHeader } from "./components/WorkspaceFolderHeader";

export function WorkspaceFolderPage() {
  const { folderId } = useParams();
  const { workspaceId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const titleParam = searchParams.get("title") || "";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  const { data, isLoading, isError } = useFindArticlesByFolderQuery({
    folderId: folderId!,
    title: titleParam,
    page: pageParam,
  });

  const { data: folderData, isLoading: isFolderDataLoading } = useFindOneWorkspaceFolderQuery(workspaceId, folderId);

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

  return (
    <div className="flex flex-col pb-5">
      <WorkspaceFolderHeader folder={folderData} isLoading={isFolderDataLoading} />

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
        openArticleDrawer={() => {}}
        setHoveredArticleId={() => {}}
        setHoveredArticleIdRef={() => {}}
      />
    </div>
  );
}
