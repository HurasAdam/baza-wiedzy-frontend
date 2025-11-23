import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const VariantsShortcutTooltip = () => (
  <div className="relative">
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="p-1.5 bg-muted/20 rounded-full cursor-pointer hover:bg-muted/40 border border-border transition-all shadow-sm hover:shadow-md">
          <Info className="w-4 h-4 text-muted-foreground" />
        </div>
      </TooltipTrigger>

      <TooltipContent className="bg-popover text-popover-foreground shadow-lg border rounded-lg max-w-xs p-3">
        <h4 className="text-sm font-semibold text-foreground mb-2">Skróty klawiszowe</h4>

        <div className="flex items-center gap-2 mb-1">
          <kbd className="px-2 py-1 bg-muted rounded border text-sm font-medium">1–6</kbd>
          <span className="text-xs text-muted-foreground">Przełączanie wariantów odpowiedzi</span>
        </div>

        <div className="border-t border-border my-2" />

        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-muted rounded border text-sm font-medium">C</kbd>
          <span className="text-xs text-muted-foreground">Kopiuj treść aktualnego wariantu do schowka</span>
        </div>
      </TooltipContent>
    </Tooltip>
  </div>
);

export default VariantsShortcutTooltip;
