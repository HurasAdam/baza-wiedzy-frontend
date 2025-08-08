import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import type { AxiosError } from "axios";
import { Check, Loader, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  useCreateRoleMutation,
  useFindPermissions,
} from "../../hooks/users/use-users";
import RoleForm from "./components/role-form";

const colorOptions = [
  { name: "Blue", value: "blue" },
  { name: "Green", value: "green" },
  { name: "Orange", value: "orange" },
  { name: "Rose", value: "rose" },
  { name: "Gray", value: "gray" },
  { name: "Purple", value: "purple" },
  { name: "Teal", value: "teal" },
];

const colorClassMap: Record<string, string> = {
  blue: "bg-blue-800 border-blue-700",
  green: "bg-green-800 border-green-700",
  orange: "bg-orange-800 border-orange-700",
  rose: "bg-rose-800 border-rose-700",
  gray: "bg-gray-800 border-gray-700",
  purple: "bg-purple-800 border-purple-700",
  teal: "bg-teal-800 border-teal-700",
};

type Permission = {
  key: string;
  label: string;
  category: string;
};

function groupPermissionsByCategory(permissions: Permission[]) {
  return permissions.reduce<Record<string, Permission[]>>((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {});
}

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

  const { mutate, isPending } = useCreateRoleMutation();
  const { data: permissions, isLoading: isPermissionsLoading } =
    useFindPermissions();

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
            <RoleForm
              isPermissionsLoading={isPermissionsLoading}
              permissions={permissions}
            />
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};
