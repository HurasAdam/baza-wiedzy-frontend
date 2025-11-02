import { Plus, Smile } from "lucide-react";
import { Dropdown } from "../../../components/Dropdown";
import { Button } from "../../../components/ui/button";

interface FunnyMessagesHeaderProps {
  onCreateFunnyMessage: () => void;
  userPermissions: string[];
}

const FunnyMessagesHeader = ({ userPermissions, onCreateFunnyMessage }: FunnyMessagesHeaderProps) => {
  const triggerBtn = (
    <Button variant="default" className="flex items-center gap-1 cursor-pointer">
      Dodaj <Plus className="w-4 h-4" />
    </Button>
  );

  const dropdownOptions = [
    {
      label: "Dodaj wiadomość",
      icon: <Plus className="w-4 h-4" />,
      actionHandler: () => {
        onCreateFunnyMessage();
      },
    },
  ];

  return (
    <div className="flex justify-between mb-2">
      <div className="flex items-center gap-4">
        <div className="rounded-xl bg-primary/10">
          <Smile className="w-6 h-6 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-semibold text-foreground flex items-center">Zabawne wiadomości</h1>
      </div>
      {userPermissions.includes("ADD_FUN_MESSAGE") && (
        <Dropdown triggerBtn={triggerBtn} options={dropdownOptions} position={{ align: "end" }} />
      )}
    </div>
  );
};

export default FunnyMessagesHeader;
