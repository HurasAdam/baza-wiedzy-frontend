import { EditProductModal } from "@/components/product/edit-product-modal";
import { ProductModal } from "@/components/product/product-modal";
import { useFindProductsQuery } from "@/hooks/products/use-products";
import { useMemo, useState } from "react";
import ProductsHeader from "./components/ProductsHeader";
import ProductsList from "./components/ProductsList";

export const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreatingProduct, setIsCreatingProduct] = useState<boolean>(false);

  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const params = useMemo(() => {
    const searchParams = new URLSearchParams();
    if (searchTerm) searchParams.append("name", searchTerm);
    return searchParams;
  }, [searchTerm]);

  const { data: products = [], isLoading, isError, error } = useFindProductsQuery(params);

  const onCreateProduct = (): void => {
    setIsCreatingProduct(true);
  };

  const onEditProduct = (productId: string): void => {
    setEditingProductId(productId);
    setIsEditingProduct(true);
  };

  return (
    <div className="mx-auto pb-6">
      <ProductsHeader
        onCreateProduct={onCreateProduct}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        foundProductsValue={products.length}
        isLoading={isLoading}
      />

      <ProductsList
        products={products}
        onEditProduct={onEditProduct}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />

      <ProductModal isCreatingProduct={isCreatingProduct} setIsCreatingProduct={setIsCreatingProduct} />
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
