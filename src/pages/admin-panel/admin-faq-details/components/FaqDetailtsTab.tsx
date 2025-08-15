import type { ProductForm } from "@/components/product/product-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import queryClient from "@/config/query.client";
import type { AxiosError } from "axios";
import { CalendarDays, Check, Loader, Pencil, X } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { ICONS } from "../../../../constants/faq-icons";
import { useUpdateFaqMutation } from "../../../../hooks/faq/use-faq";
import { formatDate } from "../../../../utils/format-date";
import { FaqDetailsForm } from "./FaqDetailsForm";

interface ProductDetailsTabProps {
  faq: {
    _id: string;
    title: string;
    description?: string; // <- dodałem opcjonalne description w typach
    slug?: string;
    isDefault: boolean;
    iconKey: string;
    labelColor: string;
    status: string;
    createdBy: { _id: string; name: string; surname: string };
    createdAt: string;
    updatedAt?: string;
    items: [];
  };
}

export const FaqDetailtsTab = ({ faq }: ProductDetailsTabProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const { mutate, isPending } = useUpdateFaqMutation();

  const form = useForm({
    defaultValues: {
      title: faq && faq.title,
      labelColor: faq && faq.labelColor,
      iconKey: faq && faq.iconKey,
      description: faq && faq.description, // <- domyślna wartość opisu
      slug: faq && faq.slug,
    },
  });

  const onEdit = () => {
    form.reset({
      title: faq.title,
      labelColor: faq.labelColor,
      iconKey: faq?.iconKey || Object.keys(ICONS)[0],
      description: faq.description || "",
      slug: faq.slug || "",
    });
    setIsEditing(true);
  };

  const handleSave = (data: ProductForm) => onSave({ faqId: faq._id, data });

  const { isDirty } = form.formState;

  const onSave = ({ faqId, data }: { faqId: string; data: ProductForm }) => {
    mutate(
      { faqId, data },
      {
        onSuccess: () => {
          toast.success("Produkt został zaktualizowany");
          queryClient.invalidateQueries({ queryKey: ["faq", faqId] });
          form.reset();
          setIsEditing(false);
        },
        onError: (error) => {
          const { status } = error as AxiosError;

          if (status === 409) {
            toast.error(
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontFamily: "Inter, sans-serif",
                  color: "#991b1b",
                  fontSize: "14px",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>Błąd: Duplikat produktu</div>
                  <div style={{ opacity: 0.8 }}>
                    Produktu o tej nazwie już istnieje, nazwa produktu musi być unikalna
                  </div>
                </div>
              </div>,
              { duration: 7000 }
            );
            return;
          }

          toast.error("Wystąpił błąd serwera");
        },
      }
    );
  };

  const handleSubmit = form.handleSubmit(handleSave);

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Informacje o FAQ</CardTitle>
          {isEditing ? (
            <div className="flex gap-2">
              <Button size="sm" className="gap-2" onClick={handleSubmit} disabled={!isDirty || isPending}>
                {isPending ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Zapisz
              </Button>
              <Button size="sm" variant="outline" className="gap-2" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4" /> Anuluj
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="outline" className="gap-2" onClick={onEdit}>
              <Pencil className="w-4 h-4" /> Edytuj
            </Button>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {isEditing && faq ? (
            <FormProvider {...form}>
              <FaqDetailsForm />
            </FormProvider>
          ) : (
            <>
              <div>
                <p className=" text-muted-foreground block text-sm font-medium mb-1">Tytuł:</p>

                <div className="h-10 flex items-center">
                  <p className="text-sm font-medium">{faq?.title}</p>
                </div>
              </div>
              <Separator />
              {/* --- Opis FAQ ---*/}
              <div>
                <p className="text-muted-foreground block text-sm font-medium mb-1.5 ">Opis:</p>
                <div className="text-sm text-forground whitespace-pre-wrap">
                  {faq?.description && faq.description.trim() ? faq?.description : "Brak opisu"}
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground block text-sm font-medium mb-1">Kolor etykiety:</p>
                <div className="h-10 flex items-center gap-2">
                  <span className="inline-block w-8 h-8 rounded-full" style={{ backgroundColor: faq?.labelColor }} />
                  <span className="text-sm">{faq?.labelColor}</span>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground block text-sm font-medium mb-1">Ikona:</p>
                <div className="h-10 flex items-center gap-2">
                  {(() => {
                    const Icon = ICONS[faq?.iconKey || "HelpCircle"] || (ICONS.HelpCircle as any);
                    return (
                      <div className="border p-2 rounded-lg text-white  " style={{ backgroundColor: faq?.labelColor }}>
                        <Icon className="w-6 h-6" />
                      </div>
                    );
                  })()}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* --- Author Section --- */}
          <div className="flex items-center gap-3  py-2 bg-muted/10 rounded-lg">
            {/* Initials Circle */}
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold text-primary">
              {(() => {
                const name = `${faq?.createdBy?.name || ""} ${faq?.createdBy?.surname || ""}`.trim();
                return name
                  ? name
                      .split(" ")
                      .map((n) => n[0]?.toUpperCase())
                      .join("")
                  : "?";
              })()}
            </div>

            {/* Author Info */}
            <div className="flex flex-col">
              <span className="font-semibold text-foreground text-sm">
                {faq?.createdBy?.name || ""} {faq?.createdBy?.surname || ""}
              </span>

              {/* Created At Section */}
              <span className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <CalendarDays className="w-3 h-3" />
                {faq?.createdAt && formatDate(faq.createdAt, { weekday: true, hours: true })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
