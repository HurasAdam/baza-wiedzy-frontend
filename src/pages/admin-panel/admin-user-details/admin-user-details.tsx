import { Button } from "@/components/ui/button";
import { ArrowLeft, CircleCheckBig, CircleX, EllipsisVertical, KeyRound, Loader, UserCog } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Dropdown } from "../../../components/Dropdown";
import { Alert } from "../../../components/shared/alert-modal";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { UpdateUserRoleModal } from "../../../components/user-role/update-user-role-modal";
import queryClient from "../../../config/query.client";
import {
  useDisableUserAccountMutation,
  useEnableUserAccountMutation,
  useFindUser,
  useResetUserPasswordMutation,
} from "../../../hooks/users/use-users";
import ProductTabCard from "../admin-product-details/components/ProductTabCard";
import { UserArticlesTab } from "./components/UserArticlesTab";
import { UserInfoTab } from "./components/UserInfoTab";

type Role = {
  _id: string;
  name: string;
  iconKey: string;
  labelColor: string;
};

export type UserShape = {
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
  favourites?: string[];
};

export type ActionType = "RESET_PASSWORD" | "TOGGLE_ACCOUNT" | "CHANGE_ROLE";
export interface PendingAction {
  type: ActionType;
  user: UserShape;
}

export const AdminUserDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const backendBase = import.meta.env.VITE_BACKEND_BASE_URL ?? "http://localhost:5000";
  //   const { data: faq, isLoading: isProductLoading } = useFindFaqQuery(id!);
  const { data: faq, isLoading: isProductLoading } = useFindUser(id!);
  const { mutate: resetUserPasswordMutation, isPending: isResetPasswordLoading } = useResetUserPasswordMutation();
  const { mutate: disableUserAccountMutation, isPending: isDisableAccountLoading } = useDisableUserAccountMutation();
  const { mutate: enableUserAccountMutation, isPending: isEnableAccountLoading } = useEnableUserAccountMutation();

  const [activeTab, setActiveTab] = useState<"account" | "questionsAndAnswers" | "topics">("account");
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  const tabs: { key: "account" | "questionsAndAnswers" | "topics"; label: string }[] = [
    { key: "account", label: "Dane konta" },
    { key: "questionsAndAnswers", label: "Pytania i odpowiedzi" },
  ];

  const onConfirm = () => {
    if (!pendingAction) return;
    const { type, user } = pendingAction;

    if (type === "RESET_PASSWORD") {
      resetUserPasswordMutation(user._id, {
        onSuccess: () => toast.success(`Hasło użytkownika ${user.name} ${user.surname} zostało zresetowane`),
        onError: () => toast.error("Podczas resetowania hasła wystąpił błąd, spróbuj ponownie"),
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ["user", user._id] });
          setPendingAction(null);
        },
      });
    } else {
      const fn = user.isActive ? disableUserAccountMutation : enableUserAccountMutation;
      fn(user._id, {
        onSuccess: () =>
          toast.success(
            `Konto użytkownika ${user.name} ${user.surname} zostało ${user.isActive ? "wyłączone" : "włączone"}`
          ),
        onError: () => toast.error("Podczas zmiany statusu konta wystąpił błąd, spróbuj ponownie."),
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ["user", user._id] });
          setPendingAction(null);
        },
      });
    }
  };

  // --- open reset password alert ---
  const onRequestReset = (user: UserShape) => setPendingAction({ type: "RESET_PASSWORD", user });
  // --- open emable/disable account alert ---
  const onRequestToggle = (user: UserShape) => setPendingAction({ type: "TOGGLE_ACCOUNT", user });
  // -- open change user role modal ---
  const onRequestRoleChange = (user: UserShape) => setPendingAction({ type: "CHANGE_ROLE", user });

  const triggerBtn = (
    <Button variant="ghost" size="icon">
      <EllipsisVertical className="w-4 h-4" />
    </Button>
  );

  if (isProductLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader className="animate-spin w-6 h-6 text-muted-foreground" />
      </div>
    );
  }

  if (!faq) {
    return (
      <div className="w-full h-full flex justify-center items-center text-muted-foreground">
        Produkt nie został znaleziony.
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-20 bg-background border-b">
        {/* Back button */}
        <div className="px-2 pt-0">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted px-2 py-1 rounded-md transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Powrót</span>
          </Button>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-4 gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-18 h-18  ">
              <AvatarImage
                className="object-cover"
                src={
                  faq.profilePicture?.path
                    ? `${backendBase}${faq.profilePicture.path.replace(/^\/app/, "")}`
                    : undefined
                }
                alt={`${faq.name} ${faq.surname}`}
                crossOrigin="anonymous"
              />
              <AvatarFallback>{(faq.name?.[0] || "") + (faq.surname?.[0] || "U")}</AvatarFallback>
            </Avatar>

            <h1 className="text-2xl font-bold">
              {faq.name} {faq.surname}
            </h1>
          </div>

          <div className="flex gap-3">
            {/* <Button variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" /> Usuń
            </Button> */}
            <Dropdown
              triggerBtn={triggerBtn}
              options={[
                {
                  label: "Zmień role",
                  icon: <UserCog className="w-4 h-4 hover:text-admin-sidebar-primary-foreground" />,
                  actionHandler: () => {
                    onRequestRoleChange(faq);
                  },
                },
                {
                  label: "Zresetuj hasło",
                  icon: <KeyRound className="w-4 h-4 hover:text-admin-sidebar-primary-foreground" />,
                  actionHandler: () => {
                    onRequestReset(faq);
                  },
                },
                {
                  label: faq.isActive ? "Wyłącz konto" : "Włącz konto",
                  icon: faq.isActive ? (
                    <CircleX className="w-4 h-4 text-destructive hover:text-admin-sidebar-primary-foreground" />
                  ) : (
                    <CircleCheckBig className="w-4 h-4 text-green-600 hover:text-admin-sidebar-primary-foreground" />
                  ),
                  actionHandler: () => {
                    onRequestToggle(faq);
                  },
                },
              ]}
              position={{ align: "end" }}
            />
          </div>
        </div>

        {/* Tab options */}
        <div className="w-full md:w-3/4   lg:w-[46%] grid grid-cols-3 border-b">
          {tabs.map((tab, index) => (
            <ProductTabCard
              key={index}
              onClick={() => setActiveTab(tab.key)}
              isActive={activeTab === tab.key}
              name={tab.label}
            />
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 py-6 min-h-[400px]">
        {activeTab === "account" && <UserInfoTab user={faq} />}

        {activeTab === "questionsAndAnswers" && faq && <UserArticlesTab faqId={faq._id} questions={[]} />}
      </div>
      {pendingAction && (
        <Alert
          isOpen={!!pendingAction}
          isLoading={isResetPasswordLoading || isDisableAccountLoading || isEnableAccountLoading}
          type="warning"
          title={
            pendingAction?.type === "RESET_PASSWORD"
              ? "Resetowanie hasła użytkownika"
              : pendingAction.user.isActive
              ? "Dezaktywacja konta użytkownika"
              : "Aktywacja konta użytkownika"
          }
          onCancel={() => setPendingAction(null)}
          onConfirm={onConfirm}
        >
          {pendingAction?.type === "RESET_PASSWORD" ? (
            <>
              Czy na pewno chcesz zresetować hasło użytkownika&nbsp;
              <strong>
                {pendingAction.user.name} {pendingAction.user.surname}
              </strong>
              ?<br />
              Reset przywróci hasło do domyślnej wartości z konfiguracji i wymusi na użytkowniku ustawienie nowego hasła
              przy następnym logowaniu.
            </>
          ) : (
            <>
              Czy na pewno chcesz {pendingAction.user.isActive ? "zdezaktywować" : "aktywować"} konto użytkownika&nbsp;
              <strong>
                {pendingAction.user.name} {pendingAction.user.surname}
              </strong>
              ?<br />
              {pendingAction.user.isActive
                ? "Użytkownik straci dostęp do systemu."
                : "Dostęp użytkownika do systemu zostanie przywrócony."}
            </>
          )}
        </Alert>
      )}
      {pendingAction && pendingAction.type === "CHANGE_ROLE" && (
        <UpdateUserRoleModal
          userData={pendingAction?.user}
          isUpdatingUserRole={pendingAction?.type === "CHANGE_ROLE"}
          setIsUpdatingUserRole={() => setPendingAction(null)}
        />
      )}
    </div>
  );
};
