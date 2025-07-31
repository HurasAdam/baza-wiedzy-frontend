import { useLoginMutation } from "@/hooks/auth/use-auth";
import LoginForm, { type LoginFormData } from "./Login-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const LoginPage = () => {
  const { mutate, isPending } = useLoginMutation();
  const navigate = useNavigate();

  const handleOnSubmit = (values: LoginFormData) => {
    mutate(values, {
      onSuccess: (data) => {
        navigate("/dashboard", { replace: true });
        console.log(data);
        toast.success("Zalogowano pomyślnie!");
        return;
      },
      onError: (data) => {
        const { status } = data;
        if (status === 401) {
          toast.error("Nieprawidłowy email lub hasło.");
          return;
        } else if (status === 403) {
          toast.error(
            "Twoje konto zostało wyłączone. Skontaktuj się z administratorem."
          );
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
