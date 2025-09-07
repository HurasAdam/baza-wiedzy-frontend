import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import { Check, Loader } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import queryClient from "../../config/query.client";
import { iconMap } from "../../constants/role-icons"; // dopasuj ścieżkę jeśli trzeba
import { useCreateUserAccountMutation } from "../../hooks/users/use-users";
import { createUserAccountSchema } from "../../validation/create-user-account.schema";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface RoleItem {
  _id: string;
  name: string;
  iconKey?: string;
  labelColor?: string;
}

interface CreateWorkspaceProps {
  roles: RoleItem[];
  isCreatingUserAccount: boolean;
  setIsCreatingUserAccount: (isCreatingWorkspace: boolean) => void;
  closeOnOutsideClick: boolean;
}

export type UserAccountFormData = z.infer<typeof createUserAccountSchema> & { password?: string };

export const UserAccountModal = ({
  roles,
  isCreatingUserAccount,
  setIsCreatingUserAccount,
  closeOnOutsideClick,
}: CreateWorkspaceProps) => {
  const [generatedPassword, setGeneratedPassword] = useState("");

  const form = useForm({
    resolver: zodResolver(createUserAccountSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
      phone: "",
      role: "",
    },
  });

  const { mutate, isPending: isCreateUserAccountPending } = useCreateUserAccountMutation();

  // rozbuduj mapę jeśli chcesz konkretne hexy zamiast CSS vars
  const colorMap: Record<string, string> = {
    blue: "#3b82f6",
    green: "#10b981",
    rose: "#fb7185",
    orange: "#fb923c",
    purple: "#8b5cf6",
    gray: "#9ca3af",
    red: "#ef4444",
    yellow: "#f59e0b",
    pink: "#ec4899",
  };

  const resolveColor = (label?: string) => {
    if (!label) return undefined;
    const key = label.toLowerCase();
    if (colorMap[key]) return colorMap[key];
    // spróbuj zmiennych css (pasuje do Twoich tematów jeśli masz --color-<name> albo --<name>)
    return `var(--color-${key}), var(--${key})`;
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let pass = "";
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(pass);
    form.setValue("password", pass);
  };

  const onSubmit = (data: UserAccountFormData) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Konto zostało utworzone");
        form.reset();
        setIsCreatingUserAccount(false);
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
      onError: (error) => {
        const { status } = error as AxiosError;
        if (status === 409) {
          toast.error(
            <div className="flex gap-3 text-sm text-red-700 font-medium">
              <div>
                <div className="font-semibold mb-1">Błąd: Duplikat szId</div>
                <div className="opacity-80">Podany szId już istnieje w bazie danych. Proszę wybrać inny.</div>
              </div>
            </div>,
            { duration: 7000 }
          );
          return;
        }
        toast.error("Wystąpił błąd, spróbuj ponownie");
      },
    });
  };

  return (
    <Dialog open={isCreatingUserAccount} onOpenChange={setIsCreatingUserAccount} modal>
      <DialogContent
        {...(!closeOnOutsideClick ? { onInteractOutside: (e) => e.preventDefault() } : {})}
        className="max-h-[85vh] min-w-[29vw] w-full max-w-md rounded-2xl shadow-xl overflow-y-auto p-6 text-card-foreground"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-foreground">Utwórz konto użytkownika</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Imię</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Wprowadź imię" className=" border-ring bg-input/30 " />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Nazwisko</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Wprowadź nazwisko"
                      className="text-input-foreground border-ring bg-input/30"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    Email <span className="text-xs text-muted-foreground">(login)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Wprowadź pełen adres email"
                      className="text-input-foreground border-ring bg-input/30 "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Hasło</FormLabel>
                  <div className="flex items-center gap-3">
                    <FormControl className="flex-1">
                      <Input
                        type="text"
                        {...field}
                        placeholder="Kliknij generuj, aby ustawić hasło"
                        className="text-foreground border-ring bg-input/30"
                      />
                    </FormControl>
                    <Button type="button" variant="default" onClick={generatePassword}>
                      Generuj
                    </Button>
                  </div>
                  {generatedPassword && (
                    <p className="text-xs text-muted-foreground mt-1">Wygenerowane hasło: {generatedPassword}</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    Telefon kontaktowy <span className="text-xs text-muted-foreground">(opcjonalnie)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Wprowadź telefon kontaktowy"
                      className="text-input-foreground border-ring bg-input/30"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Rola</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full  text-input-foreground border-ring bg-input/30">
                        <SelectValue placeholder="-- Wybierz rolę --" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => {
                          const IconComp = role.iconKey ? (iconMap as any)[role.iconKey] : undefined;
                          const bgColor = resolveColor(role.labelColor);
                          return (
                            <SelectItem key={role._id} value={role._id}>
                              <div className="flex items-center gap-3 ">
                                {/* kolorowy krąg z ikoną w środku */}
                                <span
                                  aria-hidden
                                  className="inline-flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
                                  style={{
                                    background: bgColor ?? "transparent",
                                  }}
                                >
                                  {IconComp ? <IconComp className="w-4 h-4 text-white" /> : null}
                                </span>

                                <span className="ml-1 text-sm">{role.name}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isCreateUserAccountPending} className="w-full">
                {isCreateUserAccountPending ? (
                  <>
                    <Loader className="animate-spin" />
                    Utwórz
                  </>
                ) : (
                  <>
                    <Check />
                    Utwórz
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
