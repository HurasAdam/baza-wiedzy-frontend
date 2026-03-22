import { useAuthQuery, useChangePasswordMutation } from "@/hooks/auth/use-auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResetPasswordStep } from "@/layouts/account-onboarding/components/reset-password-step";
import { ThemeStep } from "@/layouts/account-onboarding/components/themes-step";
import type { AxiosError } from "axios";
import { Lock, Monitor } from "lucide-react";

export const OnboardingPage = () => {
  const { data: authData, isLoading } = useAuthQuery();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [themeData, setThemeData] = useState(null);
  const [passwordData, setPasswordData] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  const { mutate, isPending } = useChangePasswordMutation();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-muted-foreground">Ładowanie...</div>;
  }

  if (!authData) return null;

  // Krok 1 → wybór motywu
  const onNextTheme = (data) => {
    setThemeData(data);
    setStep(2);
  };

  // Krok 2 → zmiana hasła
  const onFinishPassword = (data) => {
    setPasswordData(data);
    if (!data) return;
    setSubmitError("");

    mutate(
      {
        password: data.password,
        confirmPassword: data.passwordConfirm,
      },
      {
        onSuccess: () => {
          setIsCompleted(true);
          toast.success("Konto zostało skonfigurowane.");
          navigate("/", { replace: true });
        },
        onError: (error: AxiosError) => {
          const { status } = error;
          if (status === 409) {
            toast.error("Podane hasło jest takie samo jak aktualne. Wprowadź nowe, unikalne hasło.", {
              duration: 7000,
              position: "bottom-right",
            });
            return;
          }

          toast.error("Wystąpił błąd, spróbuj ponownie.");
          setSubmitError("Coś poszło nie tak, spróbuj ponownie.");
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className=" min-w-xl max-w-lg w-full shadow-lg rounded-lg">
        <CardHeader>
          {step === 1 && (
            <>
              <div className="flex items-center gap-3 mb-2">
                <Monitor className="w-6 h-6 text-primary" />
                <CardTitle className="text-2xl font-semibold text-foreground">Motyw interfejsu</CardTitle>
              </div>
              <p className="text-muted-foreground text-sm mt-1">
                Wybierz motyw interfejsu, który najlepiej pasuje do Twoich preferencji wizualnych.
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex items-center gap-3 mb-2">
                <Lock className="w-6 h-6 text-primary" />
                <CardTitle className="text-2xl font-semibold text-foreground">Zmiana hasła</CardTitle>
              </div>
              <p className="text-muted-foreground text-sm mt-1">
                Wprowadź swoje nowe hasło i potwierdź je, aby zakończyć konfigurację konta.
              </p>
            </>
          )}

          {isCompleted && (
            <>
              <CardTitle className="text-2xl font-semibold text-foreground">Gotowe!</CardTitle>
              <p className="text-muted-foreground text-sm mt-1">Twoje konto zostało pomyślnie skonfigurowane.</p>
            </>
          )}
        </CardHeader>

        <CardContent>
          {isPending ? (
            <div className="flex flex-col items-center justify-center py-10 min-h-[60vh]">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mb-3"></div>
              <p className="text-muted-foreground">Zapisywanie danych...</p>
            </div>
          ) : isCompleted ? (
            <div className="flex flex-col items-center justify-center py-10 min-h-[60vh]">
              <svg
                className="w-12 h-12 text-green-500 mb-3"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-600 font-medium">Konto zostało skonfigurowane!</p>
            </div>
          ) : (
            <div className="min-h-[60vh] flex flex-col justify-between">
              {step === 1 && <ThemeStep onFinish={onNextTheme} isPending={isPending} />}
              {step === 2 && (
                <ResetPasswordStep onNext={onFinishPassword} isPending={isPending} onBack={() => setStep(1)} />
              )}
              {submitError && <p className="text-destructive text-sm text-center mt-2">{submitError}</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
