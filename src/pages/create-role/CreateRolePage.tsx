import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { AxiosError } from "axios";
import { Check, Loader, PlusCircle, X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCreateRoleMutation, useFindPermissions } from "../../hooks/users/use-users";
import RoleForm from "./components/role-form";

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
    handleSubmit,
    formState: { isDirty },
  } = form;

  const { mutate, isPending } = useCreateRoleMutation();
  const { data: permissions, isLoading: isPermissionsLoading } = useFindPermissions();

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
                <div style={{ fontWeight: 600, marginBottom: 2 }}>Błąd: Duplikat Roli</div>
                <div style={{ opacity: 0.8 }}>Rola o podanej nazwie już istnieje. Nazwa roli musi być unikalna</div>
              </div>
            </div>,
            { duration: 7000 },
          );
          return;
        }

        toast.error("Wystapił błąd, spróbuj ponownie");
      },
    });
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-1 space-y-6 pb-10 ">
      <Card className="shadow-sm border border-border bg-card">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div
              className="rounded-md p-2"
              style={{
                backgroundColor: "color-mix(in srgb, var(--color-primary) 12%, transparent)",
                color: "var(--color-primary)",
              }}
            >
              <PlusCircle className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Dodaj nową rolę</h1>
              <p className="text-sm text-muted-foreground">Utwórz własną rolę i przypisz jej odpowiednie uprawnienia</p>
            </div>
          </div>
          <div className="space-x-3">
            <Button
              size="default"
              className="gap-2 whitespace-nowrap"
              onClick={onSubmit}
              disabled={!isDirty || isPending}
            >
              {isPending ? <Loader className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
              Zapisz rolę
            </Button>
            <Button
              size="default"
              variant="outline"
              className="gap-2 whitespace-nowrap"
              onClick={() => navigate("/admin/manage-roles")}
              disabled={isPending}
            >
              <X className="w-5 h-5" />
              Anuluj
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <FormProvider {...form}>
            <RoleForm isPermissionsLoading={isPermissionsLoading} permissions={permissions} />
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};
