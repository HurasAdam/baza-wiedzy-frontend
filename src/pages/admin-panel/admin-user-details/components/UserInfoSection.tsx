import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import type { UserShape } from "./UserInfoTab";

interface UserInfoSectionProps {
  user: UserShape;
  onEditUser: () => void;
}

const UserInfoSection = ({ user, onEditUser }: UserInfoSectionProps) => {
  return (
    <Card className="p-8">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col text-sm">
            <span className="text-xs text-muted-foreground uppercase mb-1">Imię</span>
            <Input disabled={true} value={user.name} readOnly />
          </div>
          <div className="flex flex-col text-sm">
            <span className="text-xs text-muted-foreground uppercase mb-1">Nazwisko</span>
            <Input disabled={true} value={user.surname} readOnly />
          </div>
        </div>

        <div className="flex flex-col text-sm">
          <span className="text-xs text-muted-foreground uppercase mb-1">Bio</span>
          <Textarea disabled={true} value={user.bio || ""} readOnly rows={4} />
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onEditUser}>
            Edytuj
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default UserInfoSection;
