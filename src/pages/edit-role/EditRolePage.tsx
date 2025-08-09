import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { AxiosError } from "axios";
import { Check, Loader, Pencil, X } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  useFindPermissions,
  useFindRole,
  useUpdateRoleMutation,
} from "../../hooks/users/use-users";
import { assertDefined } from "../../utils/asserts";
import RoleForm from "../create-role/components/role-form";

export const EditRolePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: role } = useFindRole(id ?? "");

  const form = useForm({
    defaultValues: {
      name: role ? role.name : "",
      labelColor: role ? role.labelColor : "blue",
      iconKey: role ? role.iconKey : "User",
      permissions: role ? role.permissions : ([] as string[]),
    },
  });

  const { reset, formState } = form;
  const { isDirty } = formState;

  useEffect(() => {
    if (role) {
      reset({
        name: role.name,
        labelColor: role.labelColor,
        iconKey: role.iconKey,
        permissions: role.permissions,
      });
    }
  }, [role, reset]);

  console.log(form.getValues());

  const { mutate, isPending } = useUpdateRoleMutation();
  const { data: permissions, isLoading: isPermissionsLoading } =
    useFindPermissions();

  const onSubmit = form.handleSubmit((data) => {
    assertDefined(id, "Missing roleId, roleId is required");
    mutate(
      { roleId: id, data },
      {
        onSuccess: () => {
          toast.success("Zmiany zostały zapisane");
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
      }
    );
  });

  return (
    <div className="mx-auto  ">
      <Card className="shadow-sm border border-border bg-card">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div
              className="rounded-md p-2"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--color-primary) 12%, transparent)",
                color: "var(--color-primary)",
              }}
            >
              <Pencil className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Edytuj rolę
              </h1>
              <p className="text-sm text-muted-foreground">
                Edytuj wybraną role oraz zarządzej jej uprawnienami
              </p>
            </div>
          </div>
          <div className="space-x-3">
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
              Zapisz
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
          {role ? (
            <FormProvider {...form}>
              <RoleForm
                isPermissionsLoading={isPermissionsLoading}
                permissions={permissions ?? []}
              />
            </FormProvider>
          ) : (
            <div>Ładowanie...</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
