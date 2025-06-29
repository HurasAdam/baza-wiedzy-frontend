import type { ReactNode } from "react";

import { PackageSearch } from "lucide-react";
import { Button } from "../ui/button";

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  onReset?: () => void;
  resetLabel?: string;
}

const EmptyState = ({
  icon,
  title = "Brak wyników",
  description = "Nie znaleziono wyników spełniających krteria wybranego wyszukiwania.",
  onReset,
  resetLabel = "Wyczyść filtry",
}: EmptyStateProps) => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center mt-44 text-center text-muted-foreground">
      {icon ?? <PackageSearch className="w-10 h-10 text-muted" />}
      <h3 className="text-lg font-semibold  mb-1 text-muted-foreground">
        {title}
      </h3>
      <p className="text-sm mb-4 max-w-[350px] text-muted-foreground">
        {description}
      </p>
      {onReset && (
        <Button variant="outline" className="text-sm" onClick={onReset}>
          {resetLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
