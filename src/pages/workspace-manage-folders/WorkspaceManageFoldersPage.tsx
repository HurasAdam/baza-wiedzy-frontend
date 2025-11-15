import { Separator } from "@/components/ui/separator";
import type { AxiosError } from "axios";
import { useState } from "react";
import { useOutletContext, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Alert } from "../../components/shared/alert-modal";
import { EditWorkspaceFolderModal } from "../../components/workspace-folder/EditWorkspaceFolderModal";
import queryClient from "../../config/query.client";
import { FolderSort, type FolderSortType } from "../../constants/workspace-folders-sort";
import {
  useDeleteWorkspaceFolderMutation,
  useFindWorkspaceFoldersQuery,
} from "../../hooks/workspace-folders/use-workspace-folder";
import type { Workspace } from "../../layouts/workspace/components/WorkspaceSidebar";
import ManageFoldersFilters, { type Folder } from "./components/ManageFoldersFilters";
import ManageFoldersHeader from "./components/ManageFoldersHeader";
import ManageFoldersListSection from "./components/ManageFoldersListSection";

export const WorkspaceManageFoldersPage = () => {
  const { workspace, handleAddFolder } = useOutletContext<{
    folders: unknown[];
    workspace: Workspace;
    handleAddFolder: () => void;
  }>();
  const { mutate: deleteMutate, isPending } = useDeleteWorkspaceFolderMutation();
  const { workspaceId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const titleParam = searchParams.get("name") || "";
  const sortParam: FolderSortType =
    searchParams.get("sort") === FolderSort.OLDEST ? FolderSort.OLDEST : FolderSort.NEWEST;

  console.log("WOKR", workspace);

  const { data: folders = [], isLoading: isFoldersLoading } = useFindWorkspaceFoldersQuery(workspaceId!, searchParams);

  const [view, setView] = useState<"grid" | "list">("list");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formName, setFormName] = useState("");

  const changeTitleHandler = (value: string) => {
    setSearchParams((prev) => {
      if (value) prev.set("name", value);
      else prev.delete("name");
      return prev;
    });
  };

  const changeSortHandler = (sort: FolderSortType) => {
    setSearchParams((prev) => {
      prev.set("sort", sort);
      return prev;
    });
  };

  const resetFilters = (): void => {
    setSearchParams({});
  };

  const onDeleteConfirm = (workspaceId: string, folderId: string) => {
    deleteMutate(
      { workspaceId, folderId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["workspace-folders", workspaceId] });
          setIsDeleteOpen(false);
          toast.success("Zmiany zostały zapisane", {
            position: "bottom-right",
            description: "Folder został usuniety",
          });
        },
        onError: (error) => {
          const { status } = error as AxiosError;

          if (status === 409) {
            setIsDeleteOpen(false);
            toast.error("Niepowodzenie", {
              description: "Nie można usunąć folderu zawierającego artykuły",
              position: "bottom-right",
              duration: 7000,
            });
            return;
          }

          toast.error("Wystąpił błąd serwera");
        },
      }
    );
  };

  const openEdit = (folder: Folder) => {
    setSelectedFolder(folder);
    setFormName(folder.name);
    setIsEditOpen(true);
  };

  const openDelete = (folder: Folder) => {
    setSelectedFolder(folder);
    setIsDeleteOpen(true);
  };

  return (
    <div className="py-6 w-full ">
      <div className="max-w-6xl mx-auto px-4">
        <ManageFoldersHeader handleAddFolder={handleAddFolder} />
        <Separator className="my-4" />

        <ManageFoldersFilters
          query={titleParam}
          setQuery={changeTitleHandler}
          resetFilters={resetFilters}
          view={view}
          setView={setView}
          folders={folders}
          sort={sortParam}
          changeSortHandler={changeSortHandler}
        />

        {folders && (
          <ManageFoldersListSection
            isLoading={isFoldersLoading}
            handleAddFolder={handleAddFolder}
            query={titleParam}
            folders={folders}
            view={view}
            resetFilters={resetFilters}
            openEdit={openEdit}
            openDelete={openDelete}
          />
        )}
      </div>

      {selectedFolder && (
        <EditWorkspaceFolderModal
          isEditingWorkspaceFolder={isEditOpen}
          setIsEditingWorkspaceFolder={setIsEditOpen}
          folderId={selectedFolder?._id}
          workspaceId={workspace._id}
        />
      )}

      {selectedFolder && (
        <Alert
          isOpen={isDeleteOpen}
          title="Usuń folder"
          onCancel={() => setIsDeleteOpen(false)}
          onConfirm={() => onDeleteConfirm(workspace?._id, selectedFolder._id)}
          isLoading={isPending}
        >
          Czy na pewno chcesz usunąć folder <strong>{selectedFolder?.name}</strong>?
        </Alert>
      )}
    </div>
  );
};
