import { Dropdown } from "@/components/Dropdown";
import { Input } from "@/components/ui/input";
import { BookOpen, Ellipsis, Eye, FlagTriangleRight, Loader, Plus, XCircleIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import queryClient from "../../../config/query.client";
import { useFindFaqsQuery, useSetDefaultFaqMutaton } from "../../../hooks/faq/use-faq";

export const AdminFaqsListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const params = useMemo(() => {
    const searchParams = new URLSearchParams();
    if (searchTerm) searchParams.append("title", searchTerm);
    return searchParams;
  }, [searchTerm]);

  const { data: faqs = [], isLoading, isError, error } = useFindFaqsQuery(params);
  const { mutate } = useSetDefaultFaqMutaton();

  const onSetFaqAsDefault = (faqId: string) => {
    mutate(faqId, {
      onSuccess: () => {
        toast.success("Ustawiono nowe domyślne FAQ");
        queryClient.invalidateQueries({ queryKey: ["faq"] });
      },
    });
  };

  const dropdownOptions = [
    {
      label: "Dodaj FAQ",
      icon: <Plus className="w-4 h-4" />,
      actionHandler: () => {
        navigate("/admin/manage-faqs/create");
      },
    },
  ];

  return (
    <div className="mx-auto pb-6">
      {/* Header */}
      <div className="bg-background z-10 flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-muted-foreground" /> Lista FAQ
          </h1>
          <Dropdown
            triggerBtn={
              <Button variant="default" className="flex items-center gap-1">
                Dodaj <Plus className="w-4 h-4" />
              </Button>
            }
            options={dropdownOptions}
            position={{ align: "end" }}
          />
        </div>

        {/* Filters */}
        <div className="flex bg-muted/40 rounded-lg px-3 py-2 gap-3 items-center flex-wrap">
          <Input
            placeholder="Wyszukaj FAQ..."
            className="w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="outline" size="sm" onClick={() => setSearchTerm("")}>
            Resetuj
          </Button>
          <Badge variant="outline" className="ml-auto">
            Znaleziono: {faqs.length}
          </Badge>
        </div>
      </div>

      {/* Projects List */}
      <div className="bg-card border rounded-xl overflow-hidden">
        {isLoading && (
          <div className="flex justify-center py-10">
            <Loader className="animate-spin w-6 h-6" />
          </div>
        )}

        {isError && (
          <p className="text-destructive text-center py-10">
            {(error as Error)?.message || "Błąd podczas ładowania projektów"}
          </p>
        )}

        {!isLoading && !isError && faqs.length === 0 && <p className="text-center py-10">Nie znaleziono projektów</p>}

        {!isLoading && !isError && faqs.length > 0 && (
          <ul className="divide-y divide-border">
            {faqs.map((faq) => (
              <li
                key={faq._id}
                className="flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition group"
              >
                {/* Left */}
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-muted-foreground" />

                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">{faq.title}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      Liczba pytań: {faq.items ?? 0}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-20">
                  {faq.isDefault && (
                    <div className="flex items-center gap-1">
                      <FlagTriangleRight className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  {/* Actions */}
                  <Dropdown
                    withSeparators
                    triggerBtn={
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition">
                        <Ellipsis className="w-4 h-4" />
                      </Button>
                    }
                    options={[
                      {
                        label: "Wyświetl szczególy",
                        icon: <Eye className="w-4 h-4" />,
                        actionHandler: () => navigate(`/admin/manage-faqs/${faq._id}`),
                      },

                      {
                        label: "Usuń",
                        icon: <XCircleIcon className="w-4 h-4 text-red-500" />,
                        actionHandler: () => toast.error(`Usuń ${project.name}`),
                      },
                      ...(faq.isDefault
                        ? []
                        : [
                            {
                              label: "Ustaw jako domyślne",
                              icon: <FlagTriangleRight className="w-4 h-4 text-yellow-500" />,
                              actionHandler: () => onSetFaqAsDefault(faq._id),
                            },
                          ]),
                    ]}
                    position={{ align: "end" }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
