import { Plus, Smile } from "lucide-react";
import { Dropdown } from "../../../components/Dropdown";
import { Button } from "../../../components/ui/button";

interface FunnyMessagesHeaderProps {
  onCreateFunnyMessage: () => void;
  userPermissions: string[];
}

const FunnyMessagesHeader = ({ userPermissions, onCreateFunnyMessage }: FunnyMessagesHeaderProps) => {
  const triggerBtn = (
    <Button size="sm" className="gap-2 shadow-md hover:shadow-lg transition-all">
      <Plus className="w-4 h-4" />
      Dodaj wiadomość
    </Button>
  );

  const dropdownOptions = [
    {
      label: "Dodaj wiadomość",
      icon: <Plus className="w-4 h-4" />,
      actionHandler: onCreateFunnyMessage,
    },
  ];

  return (
    <div className="flex items-center justify-between mb-8">
      {/* Left */}
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
          <Smile className="w-6 h-6 text-primary" />
        </div>

        <div>
          <h1 className="text-3xl font-semibold text-foreground">Zabawne wiadomości</h1>
          <p className="text-sm text-muted-foreground mt-1">Najdziwniejsze pytania, jakie trafiły na helpdesk</p>
        </div>
      </div>

      {/* Right */}
      {userPermissions.includes("ADD_FUN_MESSAGE") && (
        <Dropdown triggerBtn={triggerBtn} options={dropdownOptions} position={{ align: "end" }} />
      )}
    </div>
  );
};

export default FunnyMessagesHeader;
