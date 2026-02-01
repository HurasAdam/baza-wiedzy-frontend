import clsx from "clsx";
import { Card } from "../../../components/ui/card";

export function DescriptionCard({
  title,
  icon,
  children,
  className, // teraz wszystko sterujesz tylko przez className
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={clsx("p-5 shadow-sm bg-card/80", className)}>
      <div className="flex items-center gap-3 mb-2.5 pb-2 border-b border-border">
        {icon && <div className="p-2 rounded-md border bg-background text-muted-foreground">{icon}</div>}
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <div className="whitespace-pre-wrap text-foreground leading-relaxed">{children}</div>
    </Card>
  );
}
