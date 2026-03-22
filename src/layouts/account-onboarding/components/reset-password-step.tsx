import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader } from "lucide-react";

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Hasło musi mieć minimum 8 znaków")
      .refine((val) => /[A-Z]/.test(val), {
        message: "Dodaj przynajmniej jedną dużą literę",
      })
      .refine((val) => /\d/.test(val), {
        message: "Dodaj przynajmniej jedną cyfrę",
      }),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Hasła muszą być zgodne",
    path: ["passwordConfirm"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

interface PasswordStepProps {
  onNext: (data: PasswordFormData) => void;
  onBack?: () => void;
  isPending: boolean;
}

export const ResetPasswordStep: React.FC<PasswordStepProps> = ({ onNext, onBack, isPending }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const passwordValue = watch("password", "");
  const passwordRequirements = [
    { label: "Min. 8 znaków", test: (p: string) => p.length >= 8 },
    { label: "Przynajmniej jedna duża litera", test: (p: string) => /[A-Z]/.test(p) },
    { label: "Przynajmniej jedna cyfra", test: (p: string) => /\d/.test(p) },
  ];

  return (
    <form onSubmit={handleSubmit(onNext)} className="flex flex-col justify-between min-h-[60vh]">
      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-foreground">
            Nowe hasło
          </label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            autoFocus
            placeholder="Minimum 8 znaków"
            className="focus:ring-primary/50 focus:ring-2 transition"
          />
          {errors.password && <p className="text-destructive text-sm mt-1">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="passwordConfirm" className="block text-sm font-medium text-foreground">
            Potwierdź hasło
          </label>
          <Input
            id="passwordConfirm"
            type="password"
            {...register("passwordConfirm")}
            placeholder="Powtórz nowe hasło"
            className="focus:ring-primary/50 focus:ring-2 transition"
          />
          {errors.passwordConfirm && <p className="text-destructive text-sm mt-1">{errors.passwordConfirm.message}</p>}
        </div>
      </div>

      {/* PASSWORD REQUIREMENTS STATUS */}
      <div className="mt-2 p-5 border border-muted rounded-xl bg-muted/10">
        <h3 className="text-sm font-semibold text-foreground mb-6">Twoje hasło powinno spełniać poniższe warunki:</h3>
        <ul className="space-y-3 text-sm leading-relaxed">
          {passwordRequirements.map((r) => (
            <li
              key={r.label}
              className={`flex items-center gap-3 ${
                r.test(passwordValue) ? "text-green-600 font-medium" : "text-muted-foreground"
              }`}
            >
              <span className="w-5 h-5 flex-shrink-0 rounded-full border border-current flex items-center justify-center">
                {r.test(passwordValue) && (
                  <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M6 10.793l-3.146-3.147-.708.708L6 12.207l8-8-.708-.708L6 10.793z" />
                  </svg>
                )}
              </span>
              {r.label}
            </li>
          ))}

          <li
            className={`flex items-center gap-3 mt-2 ${
              watch("passwordConfirm") === passwordValue && passwordValue.length > 0
                ? "text-green-600 font-medium"
                : "text-muted-foreground"
            }`}
          >
            <span className="w-5 h-5 flex-shrink-0 rounded-full border border-current flex items-center justify-center">
              {watch("passwordConfirm") === passwordValue && passwordValue.length > 0 && (
                <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M6 10.793l-3.146-3.147-.708.708L6 12.207l8-8-.708-.708L6 10.793z" />
                </svg>
              )}
            </span>
            Hasła się zgadzają
          </li>
        </ul>
      </div>

      <div className="flex items-center justify-between gap-4 mt-6">
        {onBack && (
          <Button
            variant="ghost"
            type="button"
            onClick={onBack}
            className="flex-1 flex items-center justify-center gap-2 hover:bg-primary/75"
          >
            <ArrowLeft className="w-4 h-4" /> Wstecz
          </Button>
        )}
        <Button
          type="submit"
          variant="outline"
          className="flex-1 flex items-center justify-center gap-2"
          disabled={isPending}
        >
          {isPending ? <Loader className="animate-spin h-5 w-5" /> : "Potwierdź"}
        </Button>
      </div>
    </form>
  );
};
