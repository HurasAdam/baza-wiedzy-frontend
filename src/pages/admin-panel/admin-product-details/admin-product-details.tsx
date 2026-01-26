import { Button } from "@/components/ui/button";
import { useFindProductQuery } from "@/hooks/products/use-products";
import { ArrowLeft, Loader, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProductCategoriesTab } from "./components/ProductCategoriesTab";
import { ProductDetailsTab } from "./components/ProductDetailtsTab";
import ProductTabCard from "./components/ProductTabCard";
import { ProductTopicsTab } from "./components/ProductTopicsTab";

export const AdminProductDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: product, isLoading: isProductLoading } = useFindProductQuery(id!, {
    enabled: true,
  });

  const [activeTab, setActiveTab] = useState<"details" | "categories" | "topics">("details");

  const tabs: { key: "details" | "categories" | "topics"; label: string }[] = [
    { key: "details", label: "Szczegóły" },
    { key: "categories", label: "Kategorie" },
    { key: "topics", label: "Tematy rozmów" },
  ];

  if (isProductLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader className="animate-spin w-6 h-6 text-muted-foreground" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full h-full flex justify-center items-center text-muted-foreground">
        Produkt nie został znaleziony.
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-1 space-y-6 pb-10">
      <div className="sticky top-0 z-20 bg-background border-b">
        {/* Back button */}
        <div className="px-2 pt-0">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted px-2 py-1 rounded-md transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Powrót</span>
          </Button>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-4 gap-4">
          <div className="flex items-center gap-3">
            <span
              className="inline-block w-5.5 h-5.5 rounded-full border"
              style={{ backgroundColor: product.labelColor }}
            />
            <h1 className="text-2xl font-bold">{product.name}</h1>
          </div>

          <div className="flex gap-3">
            <Button variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" /> Usuń produkt
            </Button>
          </div>
        </div>

        {/* Tab options */}
        <div className="w-full md:w-3/4   lg:w-[46%] grid grid-cols-3 border-b">
          {tabs.map((tab, index) => (
            <ProductTabCard
              key={index}
              onClick={() => setActiveTab(tab.key)}
              isActive={activeTab === tab.key}
              name={tab.label}
            />
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 py-6 min-h-[400px]">
        {activeTab === "details" && <ProductDetailsTab product={product} />}
        {activeTab === "categories" && <ProductCategoriesTab productId={product._id} />}
        {activeTab === "topics" && <ProductTopicsTab productId={product._id} />}
      </div>
    </div>
  );
};
