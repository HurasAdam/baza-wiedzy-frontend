import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import queryClient from "../../config/query.client";
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { CardTitle } from "../ui/card";
import { Input } from "../ui/input";

interface FormValues {
  name: string;
  surname: string;
  profilePicture?: string | null;
}

const SettingsUserAccount = () => {
  const user = queryClient.getQueryData<any>(["authUser"]);

  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(user?.profilePicture || undefined);

  const { control, handleSubmit, reset, setValue } = useForm<FormValues>({
    defaultValues: {
      name: user?.name || "",
      surname: user?.surname || "",
      profilePicture: user?.profilePicture || null,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        surname: user.surname,
        profilePicture: user.profilePicture,
      });
      setAvatarPreview(user.profilePicture || undefined);
    }
  }, [user, reset]);

  const onSubmit = (data: FormValues) => {
    console.log("Zaktualizowane dane użytkownika:", data);

    toast({
      title: "Zapisano dane",
      description: "Twoje dane konta zostały zaktualizowane.",
    });

    // Aktualizacja cache
    queryClient.setQueryData(["authUser"], { ...user, ...data });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
      setValue("profilePicture", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  if (!user) return <p className="text-muted-foreground">Ładowanie danych użytkownika...</p>;

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <CardTitle>Konto</CardTitle>

      <div className="flex items-center gap-6">
        <div className="relative">
          <Avatar src={avatarPreview} alt={`${user.name} ${user.surname}`} size={50} />
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="absolute inset-0 opacity-0 cursor-pointer rounded-full"
          />
        </div>

        <div className="flex flex-col flex-1 gap-3">
          <Controller name="name" control={control} render={({ field }) => <Input {...field} placeholder="Imię" />} />
          <Controller
            name="surname"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Nazwisko" />}
          />
        </div>
      </div>

      <div className="text-sm text-muted-foreground">Email: {user.email}</div>
      <div className="text-xs text-muted-foreground">
        Rola: {user.role?.name} | Ostatnie logowanie: {new Date(user.lastLogin).toLocaleString()}
      </div>

      <div className="flex justify-end">
        <Button type="submit">Zapisz zmiany</Button>
      </div>
    </form>
  );
};

export default SettingsUserAccount;
