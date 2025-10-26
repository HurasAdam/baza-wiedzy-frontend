import { Box, Plus } from "lucide-react";
import { Dropdown } from "../../../../components/Dropdown";
import { Button } from "../../../../components/ui/button";
import ProductsFilter from "./ProductsFilter";

const ProductsHeader = ({ onCreateProduct, foundProductsValue, searchTerm, setSearchTerm, isLoading }) => {
  const dropdownOptions = [
    {
      label: "Dodaj produkt",
      icon: <Plus className="w-4 h-4" />,
      actionHandler: () => {
        onCreateProduct();
      },
    },
  ];

  const triggerBtn = (
    <Button variant="default" className="flex items-center gap-1">
      Dodaj <Plus className="w-4 h-4" />
    </Button>
  );

  return (
    <div className="bg-background z-10 flex flex-col gap-4 mb-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <Box className="w-6 h-6 text-muted-foreground" /> Produkty
        </h1>
        <Dropdown triggerBtn={triggerBtn} options={dropdownOptions} position={{ align: "end" }} />
      </div>

      <ProductsFilter
        foundProductsValue={foundProductsValue}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProductsHeader;
