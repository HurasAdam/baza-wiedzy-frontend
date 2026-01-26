import { ChevronsUp, Filter, Mail, MapPin } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import type { FilterField } from "../JstProjectsPage";

interface JstSchoolFiltersProps {
  filterField: FilterField;
  setFilterField: (field: FilterField) => void;
  filterQuery: string;
  setFilterQuery: (query: string) => void;
}

const placeholderMap: Record<FilterField, string> = {
  name: "Wyszukaj po nazwie szkoły…",
  adres: "Wyszukaj po adresie…",
  email: "Wyszukaj po e-mailu…",
};

const JstSchoolFilters = ({ filterField, setFilterField, filterQuery, setFilterQuery }: JstSchoolFiltersProps) => {
  const filterOptions = [
    { value: "name", label: "Nazwa", icon: <ChevronsUp className="w-4 h-4 mr-2" /> },
    { value: "adres", label: "Adres", icon: <MapPin className="w-4 h-4 mr-2" /> },
    { value: "email", label: "E-mail", icon: <Mail className="w-4 h-4 mr-2" /> },
  ];

  return (
    <div className="mb-8 p-4 bg-gradient-to-br from-card/90 to-card/70 border border-border rounded-xl shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium min-w-[100px]">
          <Filter className="w-4 h-4" /> Wyszukaj szkołę
        </div>
        <Select value={filterField} onValueChange={setFilterField}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Kryterium" />
          </SelectTrigger>
          <SelectContent className="bg-card">
            {filterOptions.map(({ value, label, icon }) => (
              <SelectItem key={value} value={value} className="bg-card">
                <div className="flex items-center py-0.5 hover:text-primary-foreground">
                  {icon}
                  {label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          className="flex-1 outline-none"
          placeholder={placeholderMap[filterField]}
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
        />
        <Button
          variant={filterQuery || filterField !== "name" ? "default" : "outline"}
          disabled={!filterQuery && filterField === "name"}
          onClick={() => {
            setFilterField("name");
            setFilterQuery("");
          }}
          className="ml-2 text-primary-foreground"
        >
          Resetuj
        </Button>
      </div>
    </div>
  );
};

export default JstSchoolFilters;
