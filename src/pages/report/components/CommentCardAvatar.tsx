interface Props {
  name: string;
  surname: string;
}

export const CommentCardAvatar = ({ name, surname }: Props) => {
  const initials = `${name[0] ?? ""}${surname[0] ?? ""}`.toUpperCase();
  return (
    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/70 to-primary/100 text-foreground flex items-center justify-center font-semibold text-xl shadow-md">
      {initials}
    </div>
  );
};
