import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader } from "lucide-react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import queryClient from "../../../../config/query.client";
import { useUpdateUserMutation } from "../../../../hooks/users/use-users";
import { editUserInfoSchema, type EditUserInfoFormData } from "../../../../validation/edit-user-info.schema";
import type { UserShape } from "./UserInfoTab";

interface UserInfoFormProps {
  user: UserShape;
  onEditSave: () => void;
  onEditCancel: () => void;
}

const UserInfoForm = ({ user, onEditSave, onEditCancel }: UserInfoFormProps) => {
  const form = useForm<EditUserInfoFormData>({
    resolver: zodResolver(editUserInfoSchema),
    defaultValues: {
      name: user.name,
      surname: user.surname,
      bio: user.bio || "",
    },
    mode: "onChange",
  });

  const { control, handleSubmit, formState } = form;
  const { isDirty } = formState;

  const { mutate, isPending } = useUpdateUserMutation();

  const onSubmit = async (data: EditUserInfoFormData) => {
    mutate(
      { userId: user._id, payload: data },
      {
        onSuccess: () => {
          toast.success("Zmiany zostały zapisane");
          queryClient.invalidateQueries({ queryKey: ["user", user._id] });

          onEditSave();
        },
      }
    );
  };

  return (
    <Card className="p-8">
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <label className="flex flex-col text-sm">
                  <span className="text-xs text-muted-foreground uppercase mb-1">Imię</span>
                  <Input className="border-ring bg-input/30" {...field} placeholder="Imię" />
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
                  <Input className="border-ring bg-input/30" {...field} placeholder="Nazwisko" />
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
                <Textarea
                  className="border-ring bg-input/30"
                  {...field}
                  rows={4}
                  placeholder="Krótki opis użytkownika"
                />
              </label>
            )}
          />

          <div className=" flex justify-end items-center gap-4  ">
            <div className="text-xs text-muted-foreground ">{isDirty ? "Masz niezapisane zmiany" : ""}</div>
            <Button type="button" variant="outline" onClick={onEditCancel}>
              Anuluj
            </Button>
            <Button
              type="submit"
              disabled={!isDirty}
              variant="default"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm  hover:brightness-95 disabled:opacity-60 transition"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" /> Zapisz
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4" /> Zapisz
                </span>
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Card>
  );
};

export default UserInfoForm;
