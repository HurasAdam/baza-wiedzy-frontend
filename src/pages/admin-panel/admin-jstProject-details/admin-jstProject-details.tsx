import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { School } from "lucide-react";
import { useNavigate } from "react-router-dom";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function AdminJstProjectDetailsPage() {
  const navigate = useNavigate();

  const project = {
    _id: "68ceea3fa286b935605c3f37",
    name: "Radom",
    description: "asdasd",
    createdAt: "2025-09-20T17:54:07.611Z",
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* ===== TABS ===== */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="details">Szczegóły</TabsTrigger>
          <TabsTrigger value="schools">Lista szkół</TabsTrigger>
        </TabsList>

        {/* ===== TAB: DETAILS ===== */}
        <TabsContent value="details" className="mt-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium">Informacje o projekcie</h2>
            </CardHeader>

            <Separator />

            <CardContent className="pt-4 space-y-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.description || "Brak opisu projektu"}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID projektu</span>
                  <span className="font-mono">{project._id}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data utworzenia</span>
                  <span>{formatDate(project.createdAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== TAB: SCHOOLS ===== */}
        <TabsContent value="schools" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <School className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-medium">Lista szkół</h2>
            </CardHeader>

            <CardContent className="text-sm text-muted-foreground">Brak przypisanych szkół</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
