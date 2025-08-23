import { iconMap } from "../../../../constants/role-icons";
import type { UserShape } from "./UserInfoTab";

interface UserInfoRoleBadgeProps {
  user: UserShape;
}

const UserInfoRoleBadge = ({ user }: UserInfoRoleBadgeProps) => {
  const RoleIcon = iconMap[user.role.iconKey] || null;

  return (
    <div className="flex flex-col   gap-2 min-w-[160px] ">
      <div
        className="flex items-center justify-center w-16 h-16 rounded-lg border bg-background"
        style={{ backgroundColor: `${user.role.labelColor}20`, color: user.role.labelColor }}
      >
        {RoleIcon && <RoleIcon className="w-8 h-8" />}
      </div>
      <span className="text-sm font-medium text-foreground">{user.role.name}</span>
    </div>
  );
};

export default UserInfoRoleBadge;
