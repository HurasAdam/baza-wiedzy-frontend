import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import type { UserStats } from "./StatisticsSection";

interface StatUser {
  userId: string;
  name: string;
  surname: string;
  email: string;
  role: string;
  stats: UserStats;
}

interface UserCellProps {
  user: StatUser;
  backendBase: string;
}

const UserCell = ({ user, backendBase }: UserCellProps) => {
  const avatarUrl = user.avatar ? `${backendBase}${user.avatar.replace(/^\/app/, "")}` : null;

  return (
    <div className="flex items-center gap-3.5">
      <Avatar className="h-9 w-9">
        {avatarUrl ? (
          <AvatarImage
            className="object-cover"
            src={avatarUrl}
            alt={`${user.name} ${user.surname}`}
            crossOrigin="anonymous"
            style={{ imageRendering: "auto" }}
          />
        ) : (
          <AvatarFallback>
            {user.name?.[0]}
            {user.surname?.[0]}
          </AvatarFallback>
        )}
      </Avatar>
      <span>
        {user.name} {user.surname}
      </span>
    </div>
  );
};

export default UserCell;
