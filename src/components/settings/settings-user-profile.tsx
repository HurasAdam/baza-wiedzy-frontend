import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PenTool, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import queryClient from "../../config/query.client";
import { useUpdateMyAvatarMutation, useUpdateMyProfileMutation } from "../../hooks/users/use-users";
import type { AuthUserData } from "../../types/user";

interface FormValues {
  name: string;
  surname: string;
  bio: string;
}

const SettingsUserProfile = () => {
  const user = queryClient.getQueryData<AuthUserData>(["authUser"]);
  const { mutate } = useUpdateMyProfileMutation();
  const { mutate: updateAvatarMutate, isLoading: isUploading } = useUpdateMyAvatarMutation();

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      name: user?.name || "",
      surname: user?.surname || "",
      bio: user?.bio || "",
    },
  });

  const [avatar, setAvatar] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        surname: user.surname,
        bio: user.bio || "",
      });
    }
  }, [user, reset]);

  useEffect(() => {
    if (!avatar) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(avatar);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [avatar]);

  const backendBase = import.meta.env.VITE_BACKEND_BASE_URL ?? "http://localhost:5000";
  const avatarUrl =
    previewUrl ??
    (user?.profilePicture?.path ? `${backendBase}${user.profilePicture.path.replace(/^\/app/, "")}` : null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setAvatar(e.target.files[0]);
  };

  const onAvatarSave = (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);

    updateAvatarMutate(
      { payload: formData },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["authUser"] });
          setAvatar(null);
          setPreviewUrl(null);
        },
        onError: (err) => console.error("Avatar upload failed", err),
      }
    );
  };

  const onSubmit = (data: FormValues) => {
    mutate(
      { payload: data },
      {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
      }
    );
  };

  if (!user) return <p className="text-muted-foreground">Ładowanie danych profilu...</p>;

  const InputField = ({
    label,
    placeholder,
    name,
    Icon,
  }: {
    label: string;
    placeholder: string;
    name: keyof FormValues;
    Icon: React.ComponentType<{ className?: string }>;
  }) => (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="relative">
            <Icon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              {...field}
              placeholder={placeholder}
              className="pl-10 h-10 border-ring bg-input/30 text-muted-foreground"
            />
          </div>
        )}
      />
    </div>
  );

  const getInitials = () => {
    const first = user.name?.[0]?.toUpperCase() || "";
    const second = user.surname?.[0]?.toUpperCase() || "";
    return first + second || "U";
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="border-none shadow-none bg-transparent py-1">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-header-foreground">
            <User className="w-5 h-5 text-muted-foreground" />
            Dane profilu
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Edytuj swoje podstawowe informacje. Zmiany zostaną zapisane po kliknięciu „Zapisz”.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-6 mb-4">
            <Avatar className="w-20 h-20">
              <AvatarImage className="object-cover" src={avatarUrl} alt="Avatar" crossOrigin="anonymous" />

              <AvatarFallback className="bg-muted text-foreground">
                {(user.name?.[0] || "") + (user.surname?.[0] || "U")}
              </AvatarFallback>
            </Avatar>

            <div>
              <label className="cursor-pointer text-sm text-primary hover:underline mr-4">
                Zmień avatar
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>

              {avatar && (
                <Button type="button" onClick={() => onAvatarSave(avatar)} size="sm" disabled={isUploading}>
                  {isUploading ? "Wysyłanie..." : "Zapisz avatar"}
                </Button>
              )}
            </div>
          </div>

          {/* Inputy */}
          <InputField label="Imię" placeholder="Imię" name="name" Icon={User} />
          <InputField label="Nazwisko" placeholder="Nazwisko" name="surname" Icon={User} />
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Bio</label>
            <Controller
              name="bio"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <PenTool className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Textarea
                    {...field}
                    placeholder="Krótki opis"
                    className="pl-10 resize-none h-24 border-ring bg-input/30"
                  />
                </div>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end px-6">
        <Button type="submit">Zapisz zmiany</Button>
      </div>
    </form>
  );
};

export default SettingsUserProfile;
