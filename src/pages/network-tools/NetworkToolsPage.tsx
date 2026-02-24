import { motion } from "framer-motion";
import { Loader, Network, Search } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import * as animation from "../../constants/animations";
import { useSendNetworkQuery } from "../../hooks/network-tools/use.network-tools";

type FormValues = {
  domain: string;
  resolver: string;
  recordType: string;
};

export const NetworkToolsPage = () => {
  const { control, handleSubmit, watch } = useForm<FormValues>({
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

  const [queryParams, setQueryParams] = useState<FormValues | null>(null);
  const { data, isFetching, error, refetch } = useSendNetworkQuery(queryParams ?? undefined);

  const onSubmit = (values: FormValues) => {
    setQueryParams(values);
    refetch();
  };

  const recordsToDisplay =
    data && queryParams && queryParams?.recordType.toUpperCase() !== "ALL"
      ? { [queryParams.recordType]: data[queryParams.recordType] }
      : data;

  return (
    <motion.div
      variants={animation.pageFadePremium}
      initial="init"
      animate="visible"
      exit="exit"
      className="flex flex-col gap-6 h-full w-full py-6 px-10 max-w-6xl mx-auto "
    >
      {/* --- HEADER PREMIUM Z IKONĄ --- */}
      <div className="flex items-center gap-3 mb-4">
        <Network className="w-6 h-6 text-foreground" />
        <h1 className="text-2xl font-semibold">Narzędzia sieciowe</h1>
      </div>

      {/* --- FILTRY --- */}
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
          disabled={isFetching || !isFormValid}
          size="sm"
          className="ml-auto flex items-center gap-2"
        >
          {isFetching ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {isFetching ? "Sprawdzam..." : "Sprawdź"}
        </Button>
      </form>

      {/* --- BŁĘDY --- */}

      {error && (
        <div className="mt-10 flex flex-col items-center justify-center text-center py-14 px-6 border border-destructive/10 rounded-2xl bg-muted/20">
          <div className="mb-4 p-4 rounded-full bg-destructive/5 shadow-sm">
            <Network className="w-8 h-8 text-destructive/70" />
          </div>

          <h3 className="text-lg font-semibold mb-2 text-foreground/95">Nie udało się pobrać rekordów DNS</h3>

          <p className="text-sm text-muted-foreground max-w-md mb-6">
            Wystąpił problem podczas komunikacji z serwerem DNS. Sprawdź poprawność domeny lub wybierz inny resolver.
          </p>

          <Button variant="outline" onClick={() => refetch()} className="h-9 px-5">
            Spróbuj ponownie
          </Button>
        </div>
      )}

      {/* --- EMPTY STATE --- */}
      {!queryParams && !error && (
        <div className="mt-10 flex flex-col items-center justify-center text-center py-16 border border-dashed border-border/60 rounded-2xl bg-muted/20">
          <div className="mb-4 p-4 rounded-full bg-background shadow-sm">
            <Network className="w-8 h-8 text-muted-foreground" />
          </div>

          <h3 className="text-lg font-semibold mb-2 text-foreground/95">Wyszukaj rekordy DNS</h3>

          <p className="text-sm text-muted-foreground max-w-md">
            Wprowadź domenę, wybierz server DNS oraz typ rekordu, aby rozpocząć analizę. Wyniki pojawią się tutaj.
          </p>
        </div>
      )}

      {/* --- WYNIKI DNS --- */}
      {recordsToDisplay && (
        <div className="mt-6 space-y-6 font-mono pb-6">
          {Object.entries(recordsToDisplay).map(([type, records]) => (
            <div key={type} className="bg-card rounded-xl shadow-md border border-border p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-foreground">{type}</h3>
                <span className="text-sm text-muted-foreground">
                  {Array.isArray(records) ? records.length : 1} rekordów
                </span>
              </div>

              {Array.isArray(records) && records.length === 0 && (
                <div className="text-muted-foreground bg-background/95 p-3 rounded-lg text-sm">Brak rekordów</div>
              )}

              {Array.isArray(records) && records.length > 0 && (
                <ul className="space-y-2">
                  {records.map((record, index) => (
                    <li key={index} className="bg-background/95 rounded-lg p-3 text-sm text-foreground">
                      {typeof record === "object" && !Array.isArray(record)
                        ? Object.entries(record)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(", ")
                        : Array.isArray(record)
                          ? record.join(" ")
                          : record}
                    </li>
                  ))}
                </ul>
              )}

              {!Array.isArray(records) && (
                <div className="bg-background/95 rounded-lg p-3 text-sm text-foreground">
                  {Object.entries(records)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(", ")}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
