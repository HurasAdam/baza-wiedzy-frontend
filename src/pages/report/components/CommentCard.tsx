import { Edit2, MoreVertical, Trash2 } from "lucide-react";

import { Card, CardContent } from "../../../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { formatDate } from "../../../utils/format-date";
import { CommentCardAvatar } from "./CommentCardAvatar";
import type { Comment } from "./CommentListSection";

interface Props {
  comment: Comment;
  canManage: boolean;
  onEdit: (commentId: string) => void;
  onDelete: (commentId: string) => void;
}

export const CommentCard = ({ canManage, comment, onEdit, onDelete }: Props) => {
  return (
    <Card
      key={comment._id}
      className="shadow-lg hover:shadow-xl transition-shadow duration-200 border border-border rounded-xl bg-card/90 py-3.5"
    >
      <CardContent className="flex flex-col sm:flex-row">
        <div className="flex flex-col items-center sm:items-start w-44 flex-shrink-0 px-4 pt-4 pb-1 bg-card/60 rounded-l-xl border-r border-border">
          <CommentCardAvatar name={comment.createdBy.name} surname={comment.createdBy.surname} />
          <div className="mt-1 text-center sm:text-left">
            <div className="font-semibold text-sm text-foreground/90">
              {comment.createdBy.name} {comment.createdBy.surname}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">{comment.createdBy.email ?? "user@example.com"}</div>
          </div>
        </div>

        <div className="flex-1 px-4 py-3 flex flex-col relative">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt, { hours: true })}</span>

            {canManage && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 hover:bg-muted/20 rounded">
                    <MoreVertical className="w-5 h-5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="min-w-[150px]">
                  {/* Edytuj */}
                  <DropdownMenuItem onClick={() => onEdit(comment._id)} className="flex items-center gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edytuj
                  </DropdownMenuItem>

                  {/* Separator */}
                  <div className="my-1 border-t border-border" />

                  {/* Usuń */}
                  <DropdownMenuItem
                    onClick={() => onDelete(comment._id)}
                    className="flex items-center gap-2 text-destructive"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                    Usuń
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <p className="text-sm pl-1 pr-4 text-foreground/90 whitespace-pre-wrap break-words leading-relaxed">
            {comment.content}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
