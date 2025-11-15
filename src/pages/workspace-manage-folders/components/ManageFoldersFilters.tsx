import { Grid, List, Search, X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Input } from "../../../components/ui/input";

export interface Folder {
  _id: string;
  workspaceId: string;
  name: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  articlesCount: number;
}

interface ManageFoldersFiltersProps {
  query: string;
  setQuery: (value: string) => void;
  resetFilters: () => void;
  view: "grid" | "list";
  setView: (view: "grid" | "list") => void;
  folders: Folder[];
  sort: "newest" | "oldest";
  changeSortHandler: (sort: "newest" | "oldest") => void;
}

const ManageFoldersFilters = ({
  query,
  setQuery,
  sort,
  changeSortHandler,
  resetFilters,
  view,
  setView,
}: ManageFoldersFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2 w-full sm:w-1/2">
        <div className="relative w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Szukaj folderów..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8"
          />
          {query && (
            <button
              onClick={resetFilters}
              className="absolute right-2 top-2.5 h-4 w-4 text-primary hover:bg-primary rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant={view === "list" ? "default" : "ghost"}
          size="icon"
          onClick={() => setView("list")}
          title="Widok listy"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          variant={view === "grid" ? "default" : "ghost"}
          size="icon"
          onClick={() => setView("grid")}
          title="Widok siatki"
        >
          <Grid className="w-4 h-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Sortuj: {sort === "newest" ? "Najnowsze" : "Najstarsze"}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => changeSortHandler("newest")}>Najnowsze</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => changeSortHandler("oldest")}>Najstarsze</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ManageFoldersFilters;
