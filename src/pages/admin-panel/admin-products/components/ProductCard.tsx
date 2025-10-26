import { Ellipsis, Eye, FileIcon, XCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { Dropdown } from "../../../../components/Dropdown";
import { Button } from "../../../../components/ui/button";
import type { Product } from "./ProductsList";

interface ProductCardProps {
  product: Product;
  navigate: (url: string) => void;
  onEditProduct: (productId: string) => void;
}

const ProductCard = ({ product, navigate, onEditProduct }: ProductCardProps) => {
  return (
    <li key={product._id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition group">
      <div className="flex items-center gap-3">
        <span className="inline-block w-5 h-5 rounded-full" style={{ backgroundColor: product.labelColor }}></span>

        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">{product.name}</span>
          <span className="text-xs text-muted-foreground">Artykuły: {product.articlesCount}</span>
        </div>
      </div>

      {/* Actions */}
      <Dropdown
        withSeparators
        triggerBtn={
          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition">
            <Ellipsis className="w-4 h-4" />
          </Button>
        }
        options={[
          {
            label: "Wyświetl szczególy",
            icon: <Eye className="w-4 h-4" />,
            actionHandler: () => navigate(`/admin/manage-products/${product._id}`),
          },
          {
            label: "Edytuj",
            icon: <FileIcon className="w-4 h-4" />,
            actionHandler: () => onEditProduct(product._id),
          },
          {
            label: "Usuń",
            icon: <XCircleIcon className="w-4 h-4 text-red-500" />,
            actionHandler: () => toast.error(`Usuń ${product.name}`),
          },
        ]}
        position={{ align: "end" }}
      />
    </li>
  );
};

export default ProductCard;
