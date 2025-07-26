import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type DropdownPosition = {
  align?: "start" | "center" | "end";
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  alignOffset?: number;
};

type DropdownOption = {
  label?: string | React.ReactNode;
  icon?: React.ReactNode;
  actionHandler: () => void;
  disabled?: boolean;
};

export function Dropdown({
  triggerBtn,
  options = [],
  position = { align: "center" },
  withSeparators = false, // nowy prop
}: {
  triggerBtn: React.ReactNode;
  options: DropdownOption[];
  position: DropdownPosition;
  withSeparators?: boolean; // opcjonalny prop
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{triggerBtn}</DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-52"
        side={position?.side || "bottom"}
        align={position?.align || "center"}
        sideOffset={position?.sideOffset || 1}
        alignOffset={position?.alignOffset || 0}
      >
        <DropdownMenuGroup>
          {options.map(({ icon, label, actionHandler }, index) => (
            <div key={index}>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => actionHandler()}
              >
                <div className="mr-2 w-4 h-4 flex items-center">{icon}</div>
                <span>{label}</span>
              </DropdownMenuItem>

              {withSeparators && index < options.length - 1 && (
                <DropdownMenuSeparator />
              )}
            </div>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
