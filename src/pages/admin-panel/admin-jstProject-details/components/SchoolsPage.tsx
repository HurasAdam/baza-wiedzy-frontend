import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus, School } from "lucide-react";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { JstSchoolModal } from "../../../../components/jst-school/jst-school-modal";
import { Alert } from "../../../../components/shared/alert-modal";
import queryClient from "../../../../config/query.client";
import { useDeleteJstSchoolMutation, useFindJstSchoolsQuery } from "../../../../hooks/jst-schools/use-jst-schools";
import type { IJstProject, IJstSchool } from "../../../../types";
import { SchoolCard } from "./SchoolCard";

export function SchoolsPage() {
  const { jstProject } = useOutletContext<{ jstProject: IJstProject }>();
  const { data: schools = [], isLoading } = useFindJstSchoolsQuery(jstProject?._id, {});
  const [isCreatingSchool, setIsCreatingSchool] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<IJstSchool | null>(null);

  const { mutate: deleteMutation, isPending: isDeleteLoading } = useDeleteJstSchoolMutation();

  const handleEdit = (schoolId: string) => console.log("edit", schoolId);

  const handleDelete = (school: IJstSchool) => {
    setSelectedSchool(school);
    setIsDeleteOpen(true);
  };

  const onDeleteConfirm = (schoolId: string) => {
    if (!schoolId) return;

    deleteMutation(
      { projectId: jstProject._id, schoolId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["jst-schools", jstProject._id] });
          toast.success("Szkoła została usunięta", {
            position: "bottom-right",
          });
        },
        onSettled: () => {
          setIsDeleteOpen(false);
          setSelectedSchool(null);
        },
      },
    );
  };

  const handleAdd = () => setIsCreatingSchool(true);

  return (
    <div className="mt-6 space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <School className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-medium">Lista szkół</h2>
          </div>

          <Button size="sm" variant="outline" onClick={handleAdd} className="flex items-center gap-1">
            <Plus className="w-4 h-4" />
            Dodaj szkołę
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading && <div className="p-6 text-sm text-muted-foreground">Ładowanie szkół…</div>}
          {!isLoading && (!schools || schools.length === 0) && (
            <div className="p-6 text-sm text-muted-foreground">Brak przypisanych szkół</div>
          )}

          {!isLoading && schools?.length > 0 && (
            <ul className="divide-y">
              {schools.map((school: IJstSchool) => (
                <SchoolCard key={school._id} school={school} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {isCreatingSchool && (
        <JstSchoolModal
          projects={[jstProject]}
          isCreatingJstSchool={isCreatingSchool}
          setIsCreatingJstSchool={setIsCreatingSchool}
        />
      )}

      {selectedSchool && isDeleteOpen && (
        <Alert
          isOpen={isDeleteOpen}
          title="Usuń szkołę"
          requireConfirmation
          isConfirmEnabled
          onCancel={() => setIsDeleteOpen(false)}
          onConfirm={() => selectedSchool && onDeleteConfirm(selectedSchool._id)}
          isLoading={isDeleteLoading}
          type="warning"
        >
          <p className="text-sm text-muted-foreground mb-3">Czy jesteś pewien że chcesz usunąć te szkołę ?</p>

          <div className="text-sm text-muted-foreground mt-2 space-y-3">
            <p>
              Szkoła <strong>{selectedSchool.name}</strong> zostanie trwale usunięta.
            </p>
            <span>
              Operacja ta jest <span className="font-medium mx-1.5 text-destructive">nieodwracalna</span>!
            </span>
          </div>
        </Alert>
      )}
    </div>
  );
}
