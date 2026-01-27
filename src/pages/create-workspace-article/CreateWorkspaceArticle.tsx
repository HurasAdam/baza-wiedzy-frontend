import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { WorkspaceArticleForm } from "../../components/workspace-article/workspace-article-form";
import { useCreateWorkspaceArticleMutation } from "../../hooks/workspace-articles/use-workspace-articles";
import type { Workspace } from "../../layouts/workspace/components/WorkspaceSidebar";
import { workspaceArticleSchema, type WorkspaceArticleFormData } from "../../validation/workspace-article.schema";
import CreateArticleHeader from "./components/CreateArticleHeader";

type OutletContext = {
  workspace: Workspace;
  folders: WorkspaceFolder[];
};

export const CreateWorkspaceArticlePage = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { mutate, isPending: isCreateLoading } = useCreateWorkspaceArticleMutation();
  const { folders } = useOutletContext<OutletContext>();

  const form = useForm<WorkspaceArticleFormData>({
    resolver: zodResolver(workspaceArticleSchema),
    defaultValues: {
      folderId: "",
      title: "",
      responseVariants: [
        {
          version: 1,
          variantName: "Wersja 1",
          variantContent: "",
        },
      ],
    },
  });

  const onSubmit = (data: WorkspaceArticleFormData) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Artykuł został dodany", {
          position: "bottom-right",
        });
        navigate(`/workspace/${workspaceId}/folders/${data.folderId}`);
      },
    });
  };

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <div className="flex flex-col min-h-screen bg-background/50 pt-1.5">
      <CreateArticleHeader />

      {/* ===================================================== */}
      {/* ================= Formularz================= */}
      {/* ===================================================== */}
      <div className="flex-1 py-8 max-w-7xl mx-auto w-full space-y-8">
        <FormProvider {...form}>
          <WorkspaceArticleForm folders={folders} />
        </FormProvider>
      </div>

      {/* ===================================================== */}
      {/* ================= Footer ================= */}
      {/* ===================================================== */}
      <div className="sticky bottom-0 bg-background/70 backdrop-blur-md border-t border-border py-4 px-6 flex justify-end gap-3 max-w-6xl mx-auto w-full z-10">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Anuluj
        </Button>
        <Button variant="default" onClick={handleSubmit} disabled={isCreateLoading}>
          {isCreateLoading ? (
            <div className="flex items-center gap-2">
              <Loader className="animate-spin w-4 h-4" />
              Saving...
            </div>
          ) : (
            "Zapisz"
          )}
        </Button>
      </div>
    </div>
  );
};
