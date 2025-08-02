import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";

const passwordSchema = z
  .object({
    password: z.string().min(8, "Hasło musi mieć minimum 8 znaków"),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Hasła muszą być takie same",
    path: ["passwordConfirm"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

interface PasswordStepProps {
  onNext: (data: PasswordFormData) => void;
  isPending: boolean;
}

export const ResetPasswordStep: React.FC<PasswordStepProps> = ({
  onNext,
  isPending,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      <div>
        <label
          htmlFor="password"
          className="block mb-1 text-sm font-medium text-foreground"
        >
          Nowe hasło
        </label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          autoFocus
          placeholder="Minimum 8 znaków"
        />
        {errors.password && (
          <p className="text-destructive text-sm mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="passwordConfirm"
          className="block mb-1 text-sm font-medium text-foreground"
        >
          Potwierdź hasło
        </label>
        <Input
          id="passwordConfirm"
          type="password"
          {...register("passwordConfirm")}
          placeholder="Powtórz nowe hasło"
        />
        {errors.passwordConfirm && (
          <p className="text-destructive text-sm mt-1">
            {errors.passwordConfirm.message}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="w-full flex items-center justify-center gap-2"
          variant="primary"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader className="animate-spin h-5 w-5" />
              Proszę czekać...
            </>
          ) : (
            "Dalej"
          )}
        </Button>
      </div>
    </form>
  );
};
