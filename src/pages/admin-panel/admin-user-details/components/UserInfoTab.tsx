import { Check, CircleCheckBig, CircleX, EllipsisVertical, KeyRound } from "lucide-react";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Dropdown } from "../../../../components/Dropdown";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { iconMap } from "../../../../constants/role-icons";
import { formatDate } from "../../../../utils/format-date";

type Role = {
  _id: string;
  name: string;
  iconKey: string;
  labelColor: string;
};

type UserShape = {
  _id: string;
  name: string;
  surname: string;
  email: string;
  bio?: string | null;
  mustChangePassword: boolean;
  verified: boolean;
  isActive: boolean;
  lastLogin: string;
  role: Role;
  createdAt: string;
  updatedAt?: string | null;
  favourites?: any[];
};

export function UserInfoTab({ user, onSave }: { user: UserShape; onSave?: (payload: any) => Promise<void> | void }) {
  const form = useForm({
    defaultValues: {
      name: user.name,
      surname: user.surname,
      bio: user.bio || "",
    },
    mode: "onChange",
  });

  const { control, handleSubmit, reset, formState } = form;
  const { isDirty } = formState;

  const RoleIcon = iconMap[user.role.iconKey] || null;

  const [status, setStatus] = useState<"active" | "inactive" | "mustChangePassword">(
    user.mustChangePassword ? "mustChangePassword" : user.isActive ? "active" : "inactive"
  );

  const roleBadge = (role: Role) => (
    <div
      className="px-3 flex-col py-1 rounded-full text-xs font-medium flex items-center gap-2"
      style={{ backgroundColor: `${role.labelColor}20`, color: role.labelColor }}
    >
      {RoleIcon && <RoleIcon className="w-10 h-10" />}
      <span className="text-xs"> {role.name}</span>
    </div>
  );

  const submit = async (data: any) => {
    try {
      await Promise.resolve(onSave?.({ ...data, status }));
      toast.success("Zapisano dane użytkownika");
      reset(data);
    } catch (err) {
      console.error(err);
      toast.error("Błąd podczas zapisu danych");
    }
  };

  const triggerBtn = (
    <Button variant="ghost" size="icon">
      <EllipsisVertical className="w-4 h-4" />
    </Button>
  );

  return (
    <div className="space-y-7">
      {/* -------------------- Górna sekcja użytkownika -------------------- */}
      <Card className="rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Lewa część: badge + dane */}
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {roleBadge(user.role)}
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {user.name} {user.surname}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">{user.email}</p>
          </div>
        </div>

        {/* Prawa część: status + dropdown */}
        <div className="flex items-center gap-20">
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left px-4 py-2">
            <span className="text-xs text-muted-foreground uppercase mb-1">Ostatnie logowanie</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {user.lastLogin ? formatDate(user.lastLogin) : "Brak logowania"}
            </span>
          </div>

          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <MoreVertical className="w-5 h-5 text-gray-500 dark:text-gray-300" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatus("active")}>
                <Check className="w-4 h-4 text-green-600 mr-2" /> Aktywny
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatus("inactive")}>
                <X className="w-4 h-4 text-red-600 mr-2" /> Nieaktywny
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatus("mustChangePassword")}>
                <X className="w-4 h-4 text-yellow-600 mr-2" /> Wymuś zmianę hasła
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
          <Dropdown
            triggerBtn={triggerBtn}
            options={[
              {
                label: "Zresetuj hasło",
                icon: <KeyRound className="w-4 h-4" />,
                actionHandler: () => {},
              },
              {
                label: user.isActive ? "Wyłącz konto" : "Włącz konto",
                icon: user.isActive ? (
                  <CircleX className="w-4 h-4 text-destructive" />
                ) : (
                  <CircleCheckBig className="w-4 h-4 text-green-600" />
                ),
                actionHandler: () => {},
              },
            ]}
            position={{ align: "end" }}
          />
        </div>
      </Card>

      {/* -------------------- Informacje dodatkowe -------------------- */}
      <Card className="rounded-2xl  p-6 flex flex-col md:flex-row md:divide-x md:divide-gray-200 dark:md:divide-gray-700 gap-4">
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left px-4 py-2">
          <span className="text-xs text-muted-foreground uppercase mb-1">Status konta</span>
          <span className="text-sm text-foreground">
            {user.isActive ? (
              <span className="flex items-center gap-2">
                <span className="block w-4 h-4 bg-green-700/75 border border-green-500/70 rounded-full" />
                Aktywne
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="block w-4 h-4 bg-rose-700/65 border border-rose-600/60 rounded-full" />
                Dezaktywowane
              </span>
            )}
          </span>
        </div>
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left px-4 py-2">
          <span className="text-xs text-muted-foreground uppercase mb-1">Wymagana zmiana hasła</span>
          <span className="text-sm text-foreground">{user.mustChangePassword ? "Tak" : "Nie"}</span>
        </div>
      </Card>

      {/* -------------------- Formularz edycji -------------------- */}
      <Card className="p-8">
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(submit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                name="name"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <label className="flex flex-col text-sm">
                    <span className="text-xs text-muted-foreground uppercase mb-1">Imię</span>
                    <Input {...field} placeholder="Imię" />
                  </label>
                )}
              />
              <Controller
                name="surname"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <label className="flex flex-col text-sm">
                    <span className="text-xs text-muted-foreground uppercase mb-1">Nazwisko</span>
                    <Input {...field} placeholder="Nazwisko" />
                  </label>
                )}
              />
            </div>

            <Controller
              name="bio"
              control={control}
              render={({ field }) => (
                <label className="flex flex-col text-sm">
                  <span className="text-xs text-muted-foreground uppercase mb-1">Bio</span>
                  <Textarea {...field} rows={4} placeholder="Krótki opis użytkownika" />
                </label>
              )}
            />

            <div className="flex justify-between  items-center gap-4">
              <div className="text-xs text-muted-foreground ">{isDirty ? "Masz niezapisane zmiany" : ""}</div>

              <Button
                type="submit"
                disabled={!isDirty}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 text-white text-sm  hover:brightness-95 disabled:opacity-60 transition"
              >
                <Check className="w-4 h-4" /> Zapisz zmiany
              </Button>
            </div>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
}
