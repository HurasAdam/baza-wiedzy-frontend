import {
  Box,
  Ellipsis,
  Eye,
  FileIcon,
  Loader,
  Plus,
  XCircleIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "@/components/ui/input";
import { Dropdown } from "@/components/Dropdown";

import { useFindProductsQuery } from "@/hooks/products/use-products";
import { ProductModal } from "@/components/product/product-modal";
import { EditProductModal } from "@/components/product/edit-product-modal";
import { useNavigate } from "react-router-dom";

const triggerBtn = (
  <Button variant="default" className="flex items-center gap-1">
    Dodaj <Plus className="w-4 h-4" />
  </Button>
);

export const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreatingProduct, setIsCreatingProduct] = useState<boolean>(false);
  const navigate = useNavigate();

  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const params = useMemo(() => {
    const searchParams = new URLSearchParams();
    if (searchTerm) searchParams.append("name", searchTerm);
    return searchParams;
  }, [searchTerm]);

  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useFindProductsQuery(params);

  const onCreateProduct = (): void => {
    setIsCreatingProduct(true);
  };

  const onEditProduct = (productId: string): void => {
    setEditingProductId(productId);
    setIsEditingProduct(true);
  };

  const dropdownOptions = [
    {
      label: "Dodaj produkt",
      icon: <Plus className="w-4 h-4" />,
      actionHandler: () => {
        onCreateProduct();
      },
    },
  ];

  return (
    <div className="mx-auto pb-6">
      {/* Header */}
      <div className="bg-background z-10 flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Box className="w-6 h-6 text-muted-foreground" /> Produkty
          </h1>
          <Dropdown
            triggerBtn={triggerBtn}
            options={dropdownOptions}
            position={{ align: "end" }}
          />
        </div>

        {/* Filters */}
        <div className="flex bg-muted/40 rounded-lg px-3 py-2 gap-3 items-center flex-wrap">
          <Input
            placeholder="Szukaj produktu..."
            className="w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="outline" size="sm" onClick={() => setSearchTerm("")}>
            Resetuj
          </Button>
          <Badge variant="outline" className="ml-auto">
            Znaleziono: {products.length}
          </Badge>
        </div>
      </div>

      {/* Products List */}
      <div className="bg-card border rounded-xl overflow-hidden">
        {isLoading && (
          <div className="flex justify-center py-10">
            <Loader className="animate-spin w-6 h-6" />
          </div>
        )}

        {isError && (
          <p className="text-destructive text-center py-10">
            {(error as Error)?.message || "Błąd podczas ładowania produktów"}
          </p>
        )}

        {!isLoading && !isError && products.length === 0 && (
          <p className="text-center py-10">Nie znaleziono produktów</p>
        )}

        {!isLoading && !isError && products.length > 0 && (
          <ul className="divide-y divide-border">
            {products.map((product) => (
              <li
                key={product._id}
                className="flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition group"
              >
                {/* Left */}
                <div className="flex items-center gap-3">
                  {/* Colored Dot */}
                  <span
                    className="inline-block w-5 h-5 rounded-full"
                    style={{ backgroundColor: product.labelColor }}
                  ></span>

                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {product.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Artykuły: {product.articlesCount}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <Dropdown
                  withSeparators
                  triggerBtn={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition"
                    >
                      <Ellipsis className="w-4 h-4" />
                    </Button>
                  }
                  options={[
                    {
                      label: "Wyświetl szczególy",
                      icon: <Eye className="w-4 h-4" />,
                      actionHandler: () =>
                        navigate(`/admin/manage-products/${product._id}`),
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
            ))}
          </ul>
        )}
      </div>
      <ProductModal
        isCreatingProduct={isCreatingProduct}
        setIsCreatingProduct={setIsCreatingProduct}
      />
      {editingProductId && (
        <EditProductModal
          productId={editingProductId}
          isEditingProduct={isEditingProduct}
          setIsEditingProduct={setIsEditingProduct}
        />
      )}
    </div>
  );
};
