import { ClipboardList, Plus } from "lucide-react";
import { Dropdown } from "../../../components/Dropdown";
import { Button } from "../../../components/ui/button";
import type { Product } from "../../articles/components/ArticlesList";
import TopicRegisterFilters from "./TopicRegisterFilters";

interface TopicRegisterHeaderProps {
  products: (Product & { articlesCount: number })[];
  title: string;
  product: string;
  foundTopicsCount: number;
  titleHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  productHandler: (value: string) => void;
  onCreateProduct: () => void;
  onCreateTopic: () => void;
  onResetAllFilters: () => void;
}

const TopicRegisterHeader = ({
  products,
  title,
  product,
  foundTopicsCount,
  titleHandler,
  productHandler,
  onCreateProduct,
  onCreateTopic,
  onResetAllFilters,
}: TopicRegisterHeaderProps) => {
  const hasFilters = Boolean(product || title);

  const triggerBtn = (
    <Button variant="default" className="flex items-center gap-1 cursor-pointer">
      Dodaj <Plus className="w-4 h-4" />
    </Button>
  );

  const dropdownOptions = [
    {
      label: "Dodaj produkt",
      icon: <Plus className="w-4 h-4" />,
      actionHandler: () => {
        onCreateProduct();
      },
    },
    {
      label: "Dodaj temat",
      icon: <Plus className="w-4 h-4" />,
      actionHandler: () => {
        onCreateTopic();
      },
    },
  ];

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-1.5">
          <ClipboardList className="w-6 h-6" /> Rejestr tematów
        </h1>

        <Dropdown triggerBtn={triggerBtn} options={dropdownOptions} position={{ align: "end" }} />
        {/* Tabs */}
      </div>

      <TopicRegisterFilters
        title={title}
        product={product}
        foundTopicsCount={foundTopicsCount}
        products={products}
        hasFilters={hasFilters}
        titleHandler={titleHandler}
        productHandler={productHandler}
        onResetAllFilters={onResetAllFilters}
      />
    </>
  );
};

export default TopicRegisterHeader;
