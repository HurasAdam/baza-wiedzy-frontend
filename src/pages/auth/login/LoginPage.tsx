import { useLoginMutation } from "@/hooks/auth/use-auth";
import LoginForm, { type LoginFormData } from "./Login-form";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const { mutate, isPending } = useLoginMutation();
  const navigate = useNavigate();

  const handleOnSubmit = (values: LoginFormData) => {
    mutate(values, {
      onSuccess: (data) => navigate("/dashboard", { replace: true }),
    });
  };

  return <LoginForm onSubmit={handleOnSubmit} />;
};
