import { Mail } from "lucide-react";

const UserInfoEmailBadge = ({ email }: { email: string }) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-muted-foreground uppercase flex items-center gap-1">
        <Mail className="w-3 h-3 text-foreground" />
        Email
      </span>
      <span className="text-sm text-foreground truncate max-w-[180px]" title={email}>
        {email}
      </span>
    </div>
  );
};

export default UserInfoEmailBadge;
