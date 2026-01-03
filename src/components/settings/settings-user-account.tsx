import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, CalendarCheck, CheckCircle, Mail, ShieldUser, XCircle } from "lucide-react";
import queryClient from "../../config/query.client";
import { iconMap } from "../../constants/role-icons";
import type { AuthUserData } from "../../types/user";
import { formatDate } from "../../utils/format-date";

const SettingsAccountTab = () => {
  const user = queryClient.getQueryData<AuthUserData>(["authUser"]);

  if (!user) {
    return <p className="text-muted-foreground">Ładowanie danych konta...</p>;
  }

  const RoleIcon = iconMap[user.role.iconKey] || null;

  const Field = ({
    icon: Icon,
    label,
    description,
    value,
  }: {
    icon?: React.ElementType;
    label: string;
    description?: string;
    value: React.ReactNode;
  }) => {
    return (
      <div className="flex items-center justify-between p-4 rounded-lg border  bg-input/30 hover:shadow-sm transition">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-muted-foreground" />}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            {description && <span className="text-xs text-muted-foreground mt-0.5">{description}</span>}
          </div>
        </div>
        <div className="ml-4">
          <Badge className="border flex items-center gap-2 px-2 py-1.5" variant="outline">
            {" "}
            {value}
          </Badge>
        </div>
      </div>
    );
  };

  return (
    <Card className="border-none shadow-none bg-transparent py-1">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-header-foreground">
          <ShieldUser className="w-5 h-5 text-muted-foreground" />
          Dane konta
        </CardTitle>
        <p className="text-sm text-muted-foreground">Podstawowe dane powiązane z Twoim kontem</p>
      </CardHeader>

      <CardContent className="space-y-3">
        <Field
          icon={Mail}
          label="Email"
          description="Twój adres e-mail powiązany z kontem"
          value={<span className="font-semibold text-foreground">{user.email}</span>}
        />

        <Field
          icon={BadgeCheck}
          label="Rola"
          description="Twoja aktualna rola w systemie"
          value={
            <div
              className=" flex items-center gap-2 px-2 py-1"
              style={{
                backgroundColor: `${user.role.labelColor}20`,
                color: user.role.labelColor,
              }}
            >
              {RoleIcon && <RoleIcon className="w-4 h-4" />}
              {user.role.name}
            </div>
          }
        />

        <Field
          icon={user.isActive ? CheckCircle : XCircle}
          label="Status"
          description="Czy Twoje konto jest aktywne"
          value={
            <div
              className=""
              style={{
                color: user.isActive ? "#10B981" : "#EF4444",
              }}
            >
              {user.isActive ? "Aktywne" : "Nieaktywne"}
            </div>
          }
        />

        <Field
          icon={CalendarCheck}
          label="Utworzono"
          description="Data utworzenia konta"
          value={<div className="px-2 py-1">{formatDate(user.createdAt)}</div>}
        />
      </CardContent>
    </Card>
  );
};

export default SettingsAccountTab;
