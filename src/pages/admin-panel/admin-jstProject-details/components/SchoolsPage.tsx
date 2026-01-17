import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus, School } from "lucide-react";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { JstSchoolModal } from "../../../../components/jst-school/jst-school-modal";
import { useFindJstSchoolsQuery } from "../../../../hooks/jst-schools/use-jst-schools";
import type { IJstProject } from "../../../../types";
import { SchoolCard } from "./SchoolCard";

export function SchoolsPage() {
  const { jstProject } = useOutletContext<{ jstProject: IJstProject }>();
  const { data: schools, isLoading } = useFindJstSchoolsQuery(jstProject?._id, {});
  const [isCreatingSchool, setIsCreatingSchool] = useState(false);
  const handleEdit = (schoolId: string) => console.log("edit", schoolId);
  const handleDelete = (schoolId: string) => console.log("delete", schoolId);
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
              {schools.map((school: any) => (
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
    </div>
  );
}
