import { Loader } from "lucide-react";

interface SkeletonArticleCardProps {
  withSpinner?: boolean;
}
const SkeletonArticleCard = ({ withSpinner = false }: SkeletonArticleCardProps) => (
  <li className="relative flex items-center justify-between px-6 py-4 animate-pulse bg-muted/15 rounded-md">
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-8 h-8 bg-muted/60 rounded-md" />
      <div className="flex flex-col min-w-0 gap-1">
        <div className="h-3 bg-muted/60 rounded w-44" />
        <div className="h-2 bg-muted/60 rounded w-24" />
      </div>
    </div>
    <div className="flex gap-4">
      <div className="h-6 w-20 bg-muted/20 rounded" />
      <div className="h-6 w-16 bg-muted/20 rounded" />
    </div>

    {withSpinner && (
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )}
  </li>
);

export default SkeletonArticleCard;
