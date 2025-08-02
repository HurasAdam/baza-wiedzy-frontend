import React, { useState } from "react";
import { useAuthQuery, useChangePasswordMutation } from "@/hooks/auth/use-auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResetPasswordStep } from "@/layouts/account-onboarding/components/reset-password-step";
import { ThemeStep } from "@/layouts/account-onboarding/components/themes-step";

export const OnboardingPage = () => {
  const { data: authData, isLoading } = useAuthQuery();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [passwordData, setPasswordData] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  const { mutate, isPending } = useChangePasswordMutation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-muted-foreground">
        Ładowanie...
      </div>
    );
  }

  if (!authData) return null;

  const onNextPassword = (data) => {
    setPasswordData(data);
    setStep(2);
  };

  const onFinishTheme = (data) => {
    if (!passwordData) return;
    setSubmitError("");

    mutate(
      {
        password: passwordData.password,
        confirmPassword: passwordData.passwordConfirm,
      },
      {
        onSuccess: () => {
          setIsCompleted(true);
          toast.success("Konto zostało skonfigurowane.");
          navigate("/", { replace: true });
        },
        onError: () => {
          toast.error("Wystąpił błąd, spróbuj ponownie.");
          setSubmitError("Coś poszło nie tak, spróbuj ponownie.");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="max-w-md w-full shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-foreground">
            {isCompleted
              ? "Gotowe!"
              : step === 1
              ? "Zmiana hasła"
              : "Wybór motywu"}
          </CardTitle>
          <p className="text-muted-foreground text-sm mt-1">
            {isCompleted
              ? "Twoje konto zostało pomyślnie skonfigurowane."
              : step === 1
              ? "Dla bezpieczeństwa ustaw nowe hasło."
              : "Wybierz motyw, który będzie Ci odpowiadał."}
          </p>
        </CardHeader>

        <CardContent>
          {isPending ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mb-3"></div>
              <p className="text-muted-foreground">Zapisywanie danych...</p>
            </div>
          ) : isCompleted ? (
            <div className="flex flex-col items-center justify-center py-10">
              <svg
                className="w-12 h-12 text-green-500 mb-3"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-green-600 font-medium">
                Konto zostało skonfigurowane!
              </p>
            </div>
          ) : (
            <>
              {step === 1 && (
                <ResetPasswordStep
                  onNext={onNextPassword}
                  isPending={isPending}
                />
              )}
              {step === 2 && (
                <ThemeStep
                  onBack={() => setStep(1)}
                  onFinish={onFinishTheme}
                  isPending={isPending}
                />
              )}
              {submitError && (
                <p className="text-destructive text-sm text-center mt-2">
                  {submitError}
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
