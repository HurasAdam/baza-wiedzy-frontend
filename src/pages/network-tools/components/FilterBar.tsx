import { Loader, Search } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

export type DNSFormValues = {
  domain: string;
  resolver: string;
  recordType: string;
};

interface Props {
  onSubmit: (values: DNSFormValues) => void;
  isLoading: boolean;
}

const FilterBar = ({ onSubmit, isLoading }: Props) => {
  const { control, handleSubmit, watch } = useForm<DNSFormValues>({
    defaultValues: {
      domain: "",
      resolver: "",
      recordType: "ALL",
    },
  });

  const watchedFields = watch();
  const isFormValid =
    watchedFields.domain.trim() !== "" &&
    watchedFields.resolver.trim() !== "" &&
    watchedFields.recordType.trim() !== "";

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-wrap items-center gap-3 px-3.5 py-4 border border-border/65 rounded-lg bg-gradient-to-br from-card/70 to-card/40"
      >
        <Controller
          name="domain"
          control={control}
          render={({ field }) => <Input placeholder="example.com" {...field} className="w-56 border-input" />}
        />

        <Controller
          name="resolver"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-52 border-input">
                <SelectValue placeholder="Wybierz server DNS" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google">Google (8.8.8.8)</SelectItem>
                <SelectItem value="edupage">EduPage</SelectItem>
                <SelectItem value="cloudflare">Cloudflare (1.1.1.1)</SelectItem>
                <SelectItem value="OpenDNS">OpenDNS</SelectItem>
                <SelectItem value="quad9">Quad9 (9.9.9.9)</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        <Controller
          name="recordType"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-52 border-input">
                <SelectValue placeholder="Typ rekordu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Wszystkie</SelectItem>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="CNAME">CNAME</SelectItem>
                <SelectItem value="MX">MX</SelectItem>
                <SelectItem value="NS">NS</SelectItem>
                <SelectItem value="SOA">SOA</SelectItem>
                <SelectItem value="TXT">TXT</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading || !isFormValid}
          size="sm"
          className="ml-auto flex items-center gap-2"
        >
          {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {isLoading ? "Sprawdzam..." : "Sprawdź"}
        </Button>
      </form>
    </>
  );
};

export default FilterBar;
