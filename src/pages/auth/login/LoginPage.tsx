import { useLoginMutation } from "@/hooks/auth/use-auth";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSocket } from "../../../providers/socket-provider";
import { useSound } from "../../../providers/sound-provider";
import LoginForm, { type LoginFormData } from "./Login-form";

export const LoginPage = () => {
  const { socket } = useSocket(); // <- pobierasz socket z contextu
  const { mutate, isPending } = useLoginMutation();
  const navigate = useNavigate();
  const { soundEnabled } = useSound();
  const handleOnSubmit = (values: LoginFormData) => {
    mutate(values, {
      onSuccess: (data) => {
        navigate("/dashboard", { replace: true });

        toast.success("Zalogowano pomyślnie!", { position: "bottom-right" });
        if (soundEnabled) {
          const audio = new Audio("/login-sound.m4a");
          audio.play().catch(() => console.log("Nie udało się odtworzyć dźwięku"));
        }
        if (socket) {
          socket.emit("user-login", { userId: data._id });
        }
        return;
      },
      onError: (data) => {
        const { status } = data;

        if (status === 401) {
          toast.custom(
            (t) => (
              <div
                className={`
        
        max-w-sm w-full bg-card/80 backdrop-blur-md border border-border rounded-lg shadow-md
        flex items-center gap-3 p-4 text-sm text-foreground
      `}
              >
                <AlertCircle className="w-5 h-5 text-destructive" />
                <div>
                  <p className="font-semibold">Nieprawidłowy email lub hasło</p>
                  <p className="text-[13px] text-muted-foreground">Sprawdź dane logowania i spróbuj ponownie.</p>
                </div>
              </div>
            ),
            {
              position: "bottom-right", // <--- tu ustawiasz pozycję
              duration: 4000, // opcjonalnie czas trwania
            },
          );
          return;
        }

        // reszta errorów
        else if (status === 403) {
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
