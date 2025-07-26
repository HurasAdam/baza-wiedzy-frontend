import {
  CheckCircleIcon,
  Ellipsis,
  EyeIcon,
  FileIcon,
  FileImageIcon,
  FileTextIcon,
  KeyRound,
  Loader,
  Plus,
  User,
  Users,
  X,
  XCircleIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Alert } from "../../components/shared/alert-modal";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

import queryClient from "../../config/query.client";
import {
  useAproveArticleMutation,
  useRejectArticleMutation,
} from "../../hooks/articles/use-articles";

import { useFindUsers } from "@/hooks/users/use-users";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dropdown } from "@/components/Dropdown";

const getUserDropdownOptions = (user) => [
  {
    label: "Pokaż więcej",
    icon: <EyeIcon className="w-4 h-4" />,
    actionHandler: () => {
      console.log("Więcej dla", user.name);
    },
  },
  {
    label: "Zresetuj hasło",
    icon: <KeyRound className="w-4 h-4" />,
    actionHandler: () => {
      console.log("Reset hasła dla", user.name);
    },
  },
  {
    label: user.isActive ? "Wyłącz konto" : "Włącz konto",
    icon: user.isActive ? (
      <XCircleIcon className="w-4 h-4 text-red-500" />
    ) : (
      <CheckCircleIcon className="w-4 h-4 text-green-500" />
    ),
    actionHandler: () => {
      console.log(
        user.isActive ? "Wyłączam konto" : "Włączam konto",
        user.name
      );
      // TODO: Wywołaj API do zmiany statusu
    },
  },
];

const dropdownOptions = [
  {
    label: "Dodaj użytkownika",
    icon: <Plus className="w-4 h-4" />,
    actionHandler: () => {},
  },
  {
    label: "Dodaj admina",
    icon: <Plus className="w-4 h-4" />,
    actionHandler: () => {},
  },
];

const triggerBtn = (
  <Button variant="default" className="flex items-center gap-1 cursor-pointer">
    Dodaj <Plus className="w-4 h-4" />
  </Button>
);

export const UsersPage = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const params = useMemo(() => {
    const searchParams = new URLSearchParams();
    if (selectedRole) searchParams.append("role", selectedRole);

    if (selectedStatus) {
      const isActive = selectedStatus === "active" ? "true" : "false";
      searchParams.append("isActive", isActive);
    }

    if (searchTerm) searchParams.append("name", searchTerm);
    return searchParams;
  }, [selectedRole, selectedStatus, searchTerm]);

  const { data: users = [], isLoading, isError, error } = useFindUsers(params);

  const { mutate: approveMutate, isPending: isApproveLoading } =
    useAproveArticleMutation();
  const { mutate: rejectionMutate } = useRejectArticleMutation();

  const onEditCancel = () => {
    setActiveTab("main");
  };

  const onArticleAproveConfirm = () => {
    if (!article) return;
    approveMutate(article._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["article", article._id] });
        toast.success("Artykuł został zatwierdzony.");
      },
      onSettled: () => {
        setIsCreatingArticleApprove(false);
      },
    });
  };

  const onArticleRejectConfirm = ({
    rejectionReason,
  }: {
    rejectionReason: string;
  }) => {
    if (article) {
      rejectionMutate(
        { articleId: article._id, rejectionReason },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["articles"] });
            toast.success(
              "Artykuł został odrzucony, uwagi zostały wysłane do autora artykułu"
            );
          },
          onSettled: () => {
            setIsCreatingArticleRejection(false);
          },
        }
      );
    }

    setIsCreatingArticleRejection(false);
  };

  return (
    <div className="mx-auto pb-6">
      <div className="bg-background z-10 flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <Users className="text-muted-foreground" /> Użytkownicy
            </h1>
            <div className="flex gap-2 pt-2.5 flex-wrap px-2 h-6 mb-3">
              {selectedRole && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedRole === "admin" && "Administrator"}
                  {selectedRole === "editor" && "Redaktor"}
                  {selectedRole === "user" && "Użytkownik"}

                  <button
                    onClick={() => setSelectedRole(null)}
                    className="hover:text-destructive"
                    aria-label="Usuń filtr roli"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </Badge>
              )}

              {selectedStatus && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedStatus === "active" && "Aktywni"}
                  {selectedStatus === "inactive" && "Nieaktywni"}

                  <button
                    onClick={() => setSelectedStatus(null)}
                    className="hover:text-destructive"
                    aria-label="Usuń filtr statusu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </Badge>
              )}
            </div>
          </div>

          <Dropdown
            triggerBtn={triggerBtn}
            options={dropdownOptions}
            position={{ align: "end" }}
          />
        </div>
      </div>

      <div className="flex bg-muted/40 rounded-lg px-3 py-2 gap-3 items-center flex-wrap mb-4">
        {/* Wyszukiwanie */}
        <Input
          placeholder="Szukaj użytkownika..."
          className="w-48"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* --- Role Filter ---- */}
        <Select
          value={selectedRole ?? "all"}
          onValueChange={(value) =>
            setSelectedRole(value === "all" ? null : value)
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filtruj rolę" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Wszystkie role</SelectItem>
            <SelectItem value="admin">Administrator</SelectItem>
            <SelectItem value="editor">Redaktor</SelectItem>
            <SelectItem value="user">Użytkownik</SelectItem>
          </SelectContent>
        </Select>

        {/* --- Status Filter ----*/}
        <Select
          value={selectedStatus ?? "all"}
          onValueChange={(value) =>
            setSelectedStatus(value === "all" ? null : value)
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Wszyscy</SelectItem>
            <SelectItem value="active">Aktywni</SelectItem>
            <SelectItem value="inactive">Nieaktywni</SelectItem>
          </SelectContent>
        </Select>
        {/* --- Reset Filters Button ----*/}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedRole(null);
            setSelectedStatus(null);
            setSearchTerm("");
          }}
        >
          Resetuj filtry
        </Button>
        <Badge variant="outline" className="ml-auto">
          Znaleziono: {users.length}
        </Badge>
      </div>

      <Card className=" bg-transparent shadow-none pr-4">
        <CardContent className="p-0">
          {isLoading && (
            <div className="flex justify-center py-10">
              <Loader className="animate-spin w-6 h-6 " />
            </div>
          )}

          {isError && (
            <p className="text-destructive text-center mt-10">
              {(error as Error)?.message ||
                "Błąd podczas ładowania użytkowników"}
            </p>
          )}

          {!isLoading && !isError && users.length === 0 && (
            <p className="text-center mt-10">Nie znaleziono użytkowników</p>
          )}

          {!isLoading && !isError && users.length > 0 && (
            <ul className="space-y-4">
              {users.map((user) => (
                <li
                  key={user._id} // upewnij się, że id to _id
                  className={`flex items-start gap-4 border-l-2 pl-4 ${
                    user.isActive ? "border-green-500" : "border-border"
                  }`}
                >
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-md flex items-center justify-center bg-muted shadow-md">
                    <User className="w-6 h-6 text-foreground" />
                  </div>

                  {/* Card */}
                  <div className="flex-1 bg-card p-4 rounded-2xl shadow hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-foreground space-x-1.5">
                          <span>{user.name}</span>
                          <span>{user.surname}</span>
                        </div>

                        <span className="mt-1 text-xs text-muted-foreground">
                          {user?.role?.name}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <time className="text-xs text-muted-foreground">
                          {user.date}
                        </time>
                        <Dropdown
                          withSeparators={true}
                          triggerBtn={
                            <Button
                              className="cursor-pointer"
                              variant="ghost"
                              size="icon"
                            >
                              <Ellipsis />
                            </Button>
                          }
                          options={getUserDropdownOptions(user)}
                          position={{ align: "end" }}
                        />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
