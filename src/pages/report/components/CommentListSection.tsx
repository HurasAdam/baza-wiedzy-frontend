import { useAuthQuery } from "../../../hooks/auth/use-auth";
import { CommentCard } from "./CommentCard";

export interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  createdBy: {
    name: string;
    surname: string;
    email?: string;
  };
}

interface Props {
  comments: Comment[];
  onEditComment?: (commentId: string) => void;
  onDeleteComment?: (commentId: string) => void;
}

export function CommentListSection({ comments, onEditComment, onDeleteComment }: Props) {
  const { data: user } = useAuthQuery();
  console.log(user);
  return (
    <section className="mt-6 pb-16 px-2">
      <h3 className="text-base font-semibold mb-4 text-muted-foreground ">Komentarze</h3>

      {comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">Brak komentarzy.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => {
            const isCommentAuthro = user?._id === c?.createdBy._id;

            return <CommentCard comment={c} canManage={isCommentAuthro} onEdit={() => {}} onDelete={() => {}} />;
          })}
        </div>
      )}
    </section>
  );
}
