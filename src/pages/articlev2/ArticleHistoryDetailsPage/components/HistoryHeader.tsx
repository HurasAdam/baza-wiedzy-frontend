import { ArrowLeft, Loader, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button";

interface Props {
  article: {
    title: string;
    product: {
      name: string;
    };
    category: {
      name: string;
    };
  };
  onRefresh?: () => void;
  isRefetching: boolean;
}

export const HistoryHeader = ({ article, onRefresh, isRefetching }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
      <div className="flex items-center gap-4 min-w-0">
        <Button
          variant="outline"
          className="w-16 h-16 hover:bg-muted/30 flex items-center justify-center rounded-lg bg-background"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-8 h-8" />
        </Button>

        <div className="flex flex-col gap-1 min-w-0">
          <h1 className="text-xl font-semibold max-w-[840px] break-words">{article.title}</h1>

          <p className="text-sm text-muted-foreground">
            {article.product.name} • {article.category.name}
          </p>
        </div>
      </div>

      <Button
        onClick={onRefresh}
        variant="outline"
        className="p-3 rounded transition mr-2 flex items-center gap-2"
        title="Odśwież"
      >
        {isRefetching ? <Loader className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
        Odśwież
      </Button>
    </div>
  );
};
