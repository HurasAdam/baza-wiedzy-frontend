import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";

export interface Product {
  _id: string;
  name: string;
  labelColor: string;
  banner: string;
  articlesCount: number;
}

interface ProductsListProps {
  products: Product[];
  onEditProduct: (productId: string) => void;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}
const ProductsList = ({ products, onEditProduct, isLoading, isError, error }: ProductsListProps) => {
  const navigate = useNavigate();
  return (
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

      {!isLoading && !isError && products.length === 0 && <p className="text-center py-10">Nie znaleziono produktów</p>}

      {!isLoading && !isError && products.length > 0 && (
        <ul className="divide-y divide-border">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} navigate={navigate} onEditProduct={onEditProduct} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductsList;
