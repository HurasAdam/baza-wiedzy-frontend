import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import type { IssueStatus, IssueType } from "../admin-issue-reports";

interface IssueReportsFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterType: IssueType;
  filterStatus: IssueStatus;
  setFilterType: (value: IssueType) => void;
  setFilterStatus: (value: IssueStatus) => void;
  foundReportsCount: number;
}

const IssueReportsFilters = ({
  searchTerm,
  setSearchTerm,
  setFilterType,
  filterType,
  filterStatus,
  setFilterStatus,
  foundReportsCount,
}: IssueReportsFiltersProps) => {
  return (
    <div className="flex px-3 py-2 gap-3 items-center flex-wrap">
      {/* Wyszukiwanie */}
      <Input
        placeholder="Wyszukaj zgłoszenie"
        className="w-48 border-ring"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Select
        value={filterType === "" ? "all" : filterType}
        onValueChange={(value) => setFilterType(value === "all" ? "" : (value as IssueType))}
      >
        <SelectTrigger className="w-40 border-ring">
          <SelectValue placeholder="Typ zgłoszenia" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Wszystkie</SelectItem>
          <SelectItem value="bug">Błąd</SelectItem>
          <SelectItem value="proposal">Propozycja</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filterStatus === "" ? "all" : filterStatus}
        onValueChange={(value) => setFilterStatus(value === "all" ? "" : (value as IssueStatus))}
      >
        <SelectTrigger className="w-40 border-ring">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Wszystkie</SelectItem>
          <SelectItem value="open">Otwarte</SelectItem>
          <SelectItem value="resolved">Zrealizowane</SelectItem>
          <SelectItem value="closed">Zamknięte</SelectItem>
        </SelectContent>
      </Select>
      {/* --- Reset Filters Button ----*/}
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setSearchTerm("");
          setFilterType("");
          setFilterStatus("");
        }}
      >
        Resetuj filtry
      </Button>
      <Badge variant="outline" className="ml-auto">
        Znaleziono: {foundReportsCount}
      </Badge>
    </div>
  );
};

export default IssueReportsFilters;
