import {
  Ellipsis,
  FileIcon,
  ListChecks,
  Loader,
  Pin,
  Plus,
  XCircleIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Dropdown } from "@/components/Dropdown";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFindTopicsQuery } from "@/hooks/topics/use-topics";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFindProductsQuery } from "@/hooks/products/use-products";
import { TopicModal } from "@/components/topic/topic-modal";

const triggerBtn = (
  <Button variant="default" className="flex items-center gap-1">
    Dodaj <Plus className="w-4 h-4" />
  </Button>
);

export const AdminTopicsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [productFilter, setProductFilter] = useState("");

  const [isCreatingTopic, setIsCreatingTopic] = useState(false);

  const params = useMemo(() => {
    const searchParams = new URLSearchParams();
    if (searchTerm) searchParams.append("title", searchTerm);
    if (productFilter) searchParams.append("product", productFilter);
    return searchParams;
  }, [searchTerm, productFilter]);

  const { data: products = [] } = useFindProductsQuery(null);

  const {
    data: topics = [],
    isLoading,
    isError,
    error,
  } = useFindTopicsQuery(params);

  const onResetAllFilters = () => {
    setSearchTerm("");
    setProductFilter("");
  };

  const onCreateTopic = (): void => {
    setIsCreatingTopic(true);
  };

  const dropdownOptions = [
    {
      label: "Dodaj temat",
      icon: <Plus className="w-4 h-4" />,
      actionHandler: () => onCreateTopic(),
    },
  ];

  return (
    <div className="mx-auto pb-6">
      {/* Header */}
      <div className="bg-background z-10 flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <ListChecks className="w-6 h-6 text-muted-foreground" /> Tematy
            rozmów i wiadomości
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
            placeholder="Wyszukaj temat..."
            className="w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            value={productFilter === "" ? "all" : productFilter}
            onValueChange={(value) =>
              setProductFilter(value === "all" ? "" : (value as IssueType))
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Produkt" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie</SelectItem>
              {products.map(({ _id, name }) => (
                <SelectItem key={_id} value={_id}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={onResetAllFilters}>
            Resetuj
          </Button>
          <Badge variant="outline" className="ml-auto">
            Znaleziono: {topics && topics.length}
          </Badge>
        </div>
      </div>

      {/* Tags List */}
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

        {!isLoading && !isError && topics.length === 0 && (
          <p className="text-center py-10">Nie znaleziono produktów</p>
        )}

        {!isLoading && !isError && topics.length > 0 && (
          <ul className="divide-y divide-border">
            {topics.map((topic) => (
              <li
                key={topic._id}
                className="flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition group"
              >
                {/* Left */}

                <div className="flex items-center gap-3">
                  {/* Colored Dot */}
                  <span className="inline-block w-5 h-5 rounded-full">
                    <Pin className="w-5 h-5 text-muted-foreground" />
                  </span>

                  <div className="flex flex-col space-y-0.5">
                    <span className="text-sm font-medium text-foreground">
                      {topic.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Produkt: {topic.product.name}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-40 items-center">
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
                        label: "Edytuj",
                        icon: <FileIcon className="w-4 h-4" />,
                        actionHandler: () =>
                          toast.info(`Edytuj ${topic.title}`),
                      },
                      {
                        label: "Usuń",
                        icon: <XCircleIcon className="w-4 h-4 text-red-500" />,
                        actionHandler: () => toast.error(`Usuń ${topic.title}`),
                      },
                    ]}
                    position={{ align: "end" }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <TopicModal
        products={products}
        isCreatingTopic={isCreatingTopic}
        setIsCreatingTopic={setIsCreatingTopic}
      />
    </div>
  );
};
