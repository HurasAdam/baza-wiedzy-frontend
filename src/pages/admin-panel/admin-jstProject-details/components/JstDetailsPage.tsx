import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import queryClient from "../../../../config/query.client";
import { useUpdateJstProjectMutation } from "../../../../hooks/jst-projects/use-jst-projects";
import type { IJstProject } from "../../../../types";
import type { JstProjectFormData } from "../../../../validation/jst-project.schema";
import { JstProjectDetailsForm } from "./JstProjectDetailsForm";

export const JstDetailsPage = () => {
  const { jstProject } = useOutletContext<{ jstProject: IJstProject }>();
  const { mutate, isPending } = useUpdateJstProjectMutation();
  const [isEditing, setIsEditing] = useState(false);

  const onSave = ({ jstProjectId, data }: { jstProjectId: string; data: JstProjectFormData }) => {
    mutate(
      { jstProjectId, data },
      {
        onSuccess: () => {
          setIsEditing(false);
          queryClient.invalidateQueries({ queryKey: ["jst-project", jstProjectId] });
          toast.success("Zmiany zostały zapisane", {
            position: "bottom-right",
            description: "Projekt został zaktualizowany",
          });
        },
      },
    );
  };

  if (!jstProject) return null;

  return (
    <div className="mt-6 space-y-6">
      <Card>
        <CardHeader className="flex items-start justify-between space-y-0">
          <h2 className="text-lg font-medium">{isEditing ? "Edytuj projekt" : "Informacje o projekcie"}</h2>
          {!isEditing && (
            <Button size="sm" onClick={() => setIsEditing(true)}>
              Edytuj
            </Button>
          )}
        </CardHeader>

        <CardContent className="pt-4 space-y-6">
          {isEditing ? (
            <JstProjectDetailsForm
              project={jstProject}
              onCancel={() => setIsEditing(false)}
              onSave={onSave}
              isLoading={isPending}
            />
          ) : (
            <>
              <div>
                <span className="text-sm text-muted-foreground">Nazwa projektu</span>
                <p className="text-xl font-semibold text-foreground">{jstProject.name}</p>
              </div>

              <div>
                <span className="text-sm text-muted-foreground mb-1 block">Opis</span>
                <div className="p-4 rounded-md ">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {jstProject.description || "Brak opisu projektu"}
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
