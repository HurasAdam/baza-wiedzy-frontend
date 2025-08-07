import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

import type { AxiosError } from "axios";
import { Check, Loader, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { iconOptions } from "../../constants/role-icons";
import { useCreateRoleMutation } from "../../hooks/users/use-users";

const colorOptions = [
  { name: "Blue", value: "blue" },
  { name: "Green", value: "green" },
  { name: "Orange", value: "orange" },
  { name: "Rose", value: "rose" },
  { name: "Gray", value: "gray" },
  { name: "Purple", value: "purple" },
  { name: "Teal", value: "teal" },
];

const PERMISSION_LABELS: Record<string, string> = {
  ADD_ARTICLE: "Dodawanie artykułów",
  EDIT_ARTICLE: "Edycja artykułów",
  VERIFY_ARTICLE: "Zatwierdzanie artykułów",
  UNVERIFY_ARTICLE: "Cofanie zatwierdzenia",
  TRASH_ARTICLE: "Przenoszenie do kosza",
  RESTORE_ARTICLE: "Przywracanie z kosza",
  DELETE_ARTICLE: "Usuwanie artykułów",
  VIEW_ARTICLE_HISTORY: "Przeglądanie historii",
  REPORT_BUG: "Zgłaszanie błędów",
  REPORT_PROPOSAL: "Zgłaszanie propozycji",
  ADD_TAG: "Dodawanie tagów",
  EDIT_TAG: "Edycja tagów",
  DELETE_TAG: "Usuwanie tagów",
  ADD_PRODUCT: "Dodawanie produktów",
  EDIT_PRODUCT: "Edycja produktów",
  DELETE_PRODUCT: "Usuwanie produktów",
  ADD_CATEGORY: "Dodawanie kategorii",
  EDIT_CATEGORY: "Edycja kategorii",
  DELETE_CATEGORY: "Usuwanie kategorii",
  ADD_TOPIC: "Dodawanie tematów",
  EDIT_TOPIC: "Edycja tematów",
  DELETE_TOPIC: "Usuwanie tematów",
  READ_ONLY: "Tylko odczyt",
};

const colorClassMap: Record<string, string> = {
  blue: "bg-blue-800 border-blue-700",
  green: "bg-green-800 border-green-700",
  orange: "bg-orange-800 border-orange-700",
  rose: "bg-rose-800 border-rose-700",
  gray: "bg-gray-800 border-gray-700",
  purple: "bg-purple-800 border-purple-700",
  teal: "bg-teal-800 border-teal-700",
};

const availablePermissions = Object.keys(PERMISSION_LABELS);

export const CreateRolePage = () => {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      name: "",
      labelColor: "blue",
      iconKey: "User",
      permissions: [] as string[],
    },
  });

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { isDirty },
  } = form;

  const selectedColor = watch("labelColor");
  const selectedIcon = watch("iconKey");
  const selectedPermissions = watch("permissions");

  const togglePermission = (perm: string) => {
    const updated = selectedPermissions.includes(perm)
      ? selectedPermissions.filter((p) => p !== perm)
      : [...selectedPermissions, perm];
    setValue("permissions", updated, { shouldDirty: true });
  };

  const { mutate, isPending } = useCreateRoleMutation();

  const onSubmit = handleSubmit((data) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Dodano nową rolę");
        navigate("/admin/manage-roles");
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
                <div style={{ fontWeight: 600, marginBottom: 2 }}>
                  Błąd: Duplikat Roli
                </div>
                <div style={{ opacity: 0.8 }}>
                  Rola o podanej nazwie już istnieje. Nazwa roli musi być
                  unikalna
                </div>
              </div>
            </div>,
            { duration: 7000 }
          );
          return;
        }

        toast.error("Wystapił błąd, spróbuj ponownie");
      },
    });
  });

  return (
    <div className="mx-auto ">
      <Card className="shadow-sm border border-border bg-card">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <PlusCircle className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Dodaj nową rolę
              </h1>
              <p className="text-sm text-muted-foreground">
                Utwórz niestandardową rolę i przypisz jej odpowiednie
                uprawnienia
              </p>
            </div>
          </div>
          <Button
            size="default"
            className="gap-2 whitespace-nowrap"
            onClick={onSubmit}
            disabled={!isDirty || isPending}
          >
            {isPending ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Check className="w-5 h-5" />
            )}
            Zapisz rolę
          </Button>
        </CardHeader>

        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={onSubmit} className="space-y-6 pt-1">
              {/* Nazwa roli */}
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Nazwa roli
                </p>
                <Input
                  {...register("name", { required: true })}
                  placeholder="Np. Moderator"
                  className="h-9"
                />
              </div>

              {/* Ikona roli */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Ikona roli
                </p>
                <input type="hidden" {...register("iconKey")} />
                <div className="flex flex-wrap gap-2">
                  {iconOptions.map(({ name, icon: Icon }) => (
                    <button
                      type="button"
                      key={name}
                      onClick={() =>
                        setValue("iconKey", name, { shouldDirty: true })
                      }
                      className={`w-11 h-11 flex items-center justify-center rounded border transition ${
                        selectedIcon === name
                          ? "border-ring ring-2 ring-ring ring-offset-1"
                          : "border-border hover:bg-muted"
                      }`}
                      title={name}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Kolor etykiety */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Kolor etykiety
                </p>
                <input
                  type="hidden"
                  {...register("labelColor", { required: true })}
                  value={selectedColor}
                />
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map(({ name, value }) => {
                    const isSelected = selectedColor === value;
                    const colorClasses =
                      colorClassMap[value] || "bg-muted border-border";
                    return (
                      <span
                        key={name}
                        onClick={() =>
                          setValue("labelColor", value, { shouldDirty: true })
                        }
                        className={`w-8 h-8 rounded-full border cursor-pointer transition-all duration-200 
          ${isSelected ? "ring-2 ring-ring ring-offset-2" : "hover:scale-105"} 
          ${colorClasses}`}
                        title={name}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Uprawnienia  */}
              <div className="space-y-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Uprawnienia
                </p>
                <input type="hidden" {...register("permissions")} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availablePermissions.map((perm) => (
                    <label
                      key={perm}
                      className="flex items-center justify-between cursor-pointer rounded-md border border-border p-3 hover:bg-muted transition"
                    >
                      <span className="text-sm font-medium">
                        {PERMISSION_LABELS[perm] || perm}
                      </span>
                      <Switch
                        checked={selectedPermissions.includes(perm)}
                        onCheckedChange={() => togglePermission(perm)}
                        aria-label={`Przełącznik uprawnienia ${perm}`}
                      />
                    </label>
                  ))}
                </div>
              </div>

              <Separator />

              <p className="text-sm text-muted-foreground leading-relaxed">
                Po zapisaniu rola będzie dostępna do przypisania użytkownikom.
              </p>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};
