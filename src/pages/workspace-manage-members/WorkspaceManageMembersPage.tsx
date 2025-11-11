import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Copy, MoreVertical, Users } from "lucide-react";
import { useParams } from "react-router-dom";
import { Separator } from "../../components/ui/separator";
import { useFindWorkspaceMembersQuery } from "../../hooks/workspace/use-workspace";

export const WorkspaceManageMembersPage = () => {
  const { workspaceId } = useParams();
  const { data, isLoading } = useFindWorkspaceMembersQuery(workspaceId);

  return (
    <div className="max-w-5xl mx-auto  space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-muted-foreground" />
          <h1 className="text-2xl font-semibold tracking-tight">Członkowie workspace’u</h1>
        </div>
        <Button>Dodaj członka</Button>
      </header>
      <Separator />
      {/* Invite link */}
      <Card>
        <CardHeader className="pb-2">
          <h2 className="text-sm font-medium text-muted-foreground">Link zaproszenia</h2>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <Input readOnly value={`https://yourapp.com/invite/${workspaceId}`} className="flex-1" />
          <Button variant="outline" size="icon">
            <Copy className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Members list */}
      <section>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Lista członków</h2>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Ładowanie członków...</p>
        ) : !data?.length ? (
          <Card className="p-6 text-center text-muted-foreground">Brak członków w tym workspace.</Card>
        ) : (
          <div className="divide-y divide-border rounded-lg border">
            {data.map((member: any) => (
              <div key={member.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {member.name?.[0]}
                      {member.surname?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {member.name} {member.surname}
                    </p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      member.role === "OWNER" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {member.role}
                  </span>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Ustaw jako właściciela</DropdownMenuItem>
                      <DropdownMenuItem>Zmień rolę</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Usuń z workspace’u</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
