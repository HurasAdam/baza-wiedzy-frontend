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
  onRequestEdit: (member: WorkspaceMember) => void;
  permissions: Record<string, boolean>;
}

export const WorkspaceMemberCard = ({
  member,
  workspaceId,
  onRequestRemove,
  onRequestEdit,
  permissions,
}: WorkspaceMemberCardProps) => {
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
          className={`px-2.5 py-2 text-xs font-semibold rounded-xl uppercase ${
            member.isOwner ? "bg-primary/20 text-primary" : "bg-muted text-foreground "
          }`}
        >
          {member.isOwner ? "Właściciel" : "Użytkownik"}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={!permissions.isOwner}>
            <Button variant="ghost" size="icon">
              {permissions.isOwner && <MoreVertical className="w-4 h-4" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {!member.isOwner && <DropdownMenuItem>Ustaw jako właściciela</DropdownMenuItem>}
            <DropdownMenuItem onClick={() => onRequestEdit(member)}>Uprawnienia</DropdownMenuItem>
            {!member.isOwner && (
              <DropdownMenuItem onClick={() => onRequestRemove(member)} className="text-destructive">
                Usuń z kolekcji
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
