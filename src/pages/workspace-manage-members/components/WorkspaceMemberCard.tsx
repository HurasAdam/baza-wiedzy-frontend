import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import type { WorkspaceMember } from "./WorkspaceMembersSection";

interface WorkspaceMemberCardProps {
  member: WorkspaceMember;
  workspaceId: string;
  onRequestRemove: (member: WorkspaceMember) => void;
}

const rolesMap: Record<string, string> = {
  OWNER: "WŁAŚCICIEL",

  VIEWER: "CZYTELNIK",
  EDITOR: "MODERATOR",
} as const;

export const WorkspaceMemberCard = ({ member, workspaceId, onRequestRemove }: WorkspaceMemberCardProps) => {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition">
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarFallback className="">
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
          className={`px-2 py-1.5 text-xs font-semibold rounded-xl ${
            member.role === "OWNER" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-700"
          }`}
        >
          {rolesMap[member.role]}
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
            <DropdownMenuItem onClick={() => onRequestRemove(member)} className="text-destructive">
              Usuń z kolekcji
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
