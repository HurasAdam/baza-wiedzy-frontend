// pages/workspace-article/AddWorkspaceArticlePage.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

import { Loader } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { WorkspaceArticleForm } from "../../components/workspace-article/workspace-article-form";
import { useCreateWorkspaceArticleMutation } from "../../hooks/workspace-articles/use-workspace-articles";
import { workspaceArticleSchema, type WorkspaceArticleFormData } from "../../validation/workspace-article.schema";
import CreateArticleHeader from "./components/CreateArticleHeader";

type OutletContext = {
  workspace: Workspace;
  folders: WorkspaceFolder[];
};

export const CreateWorkspaceArticlePage = () => {
  const { workspaceId, folderId } = useParams();
  const navigate = useNavigate();
  const { mutate, isPending: isCreateLoading } = useCreateWorkspaceArticleMutation();
  const { folders } = useOutletContext<OutletContext>();

  const form = useForm<WorkspaceArticleFormData>({
    resolver: zodResolver(workspaceArticleSchema),
    defaultValues: {
      folderId: "",
      title: "",
      responseVariants: [{ version: 1, variantName: "", variantContent: "" }],
    },
  });

  const onSubmit = (data: WorkspaceArticleFormData) => {
    // mutate(
    //   { workspaceId: workspaceId!, folderId: folderId!, payload: data },
    //   {
    //     onSuccess: () => {
    //       toast.success("Artykuł został dodany");
    //       navigate(`/workspace/${workspaceId}/folders/${folderId}`);
    //     },
    //     onError: () => {
    //       toast.error("Wystąpił błąd przy dodawaniu artykułu");
    //     },
    //   }
    // );

    mutate(data, {
      onSuccess: () => {
        toast.success("Zmiany zostały zapisane", {
          position: "bottom-right",
          description: "Artykuł został dodany",
        });
        navigate(`/workspace/${workspaceId}/folders/${data.folderId}`);
      },
    });
  };

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <div className="  py-2 flex flex-col gap-6">
      <CreateArticleHeader />

      <Separator className="my-4 " />

      <FormProvider {...form}>
        <WorkspaceArticleForm folders={folders} />
      </FormProvider>

      <div className="flex justify-end gap-3 max-w-6xl mx-auto w-full">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Anuluj
        </Button>
        <Button variant="default" onClick={handleSubmit} disabled={isCreateLoading}>
          {isCreateLoading ? (
            <div className="flex items-center gap-2">
              <Loader className="animate-spin w-4 h-4" />
              Zapisuję...
            </div>
          ) : (
            "Zapisz"
          )}
        </Button>
      </div>
    </div>
  );
};
