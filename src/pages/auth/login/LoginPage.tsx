import { useLoginMutation } from "@/hooks/auth/use-auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSound } from "../../../providers/sound-provider";
import LoginForm, { type LoginFormData } from "./Login-form";

export const LoginPage = () => {
  const { mutate, isPending } = useLoginMutation();
  const navigate = useNavigate();
  const { soundEnabled } = useSound();
  const handleOnSubmit = (values: LoginFormData) => {
    mutate(values, {
      onSuccess: (data) => {
        navigate("/dashboard", { replace: true });

        toast.success("Zalogowano pomyślnie!");
        if (soundEnabled) {
          const audio = new Audio("/login-sound.m4a");
          audio.play().catch(() => console.log("Nie udało się odtworzyć dźwięku"));
        }
        return;
      },
      onError: (data) => {
        const { status } = data;
        if (status === 401) {
          toast.error("Nieprawidłowy email lub hasło.");
          return;
        } else if (status === 403) {
          toast.error("Twoje konto zostało wyłączone. Skontaktuj się z administratorem.");
          return;
        } else {
          toast.error("Wystąpił błąd... spróbuj ponownie");
          return;
        }
      },
    });
  };

  return <LoginForm onSubmit={handleOnSubmit} isLoading={isPending} />;
};
