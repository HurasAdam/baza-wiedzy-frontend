import { UserCog } from "lucide-react";
import { Dropdown } from "../../../../components/Dropdown";

interface AdminRolesHeaderProps {
  triggerBtn: React.ReactNode;
  dropdownOptions: any[];
}

const AdminRolesHeader = ({ triggerBtn, dropdownOptions }: AdminRolesHeaderProps) => (
  <div className="flex justify-between items-center">
    <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
      <UserCog className="w-6 h-6 text-muted-foreground" /> Role i uprawnienia
    </h1>
    <Dropdown triggerBtn={triggerBtn} options={dropdownOptions} position={{ align: "end" }} />
  </div>
);

export default AdminRolesHeader;
