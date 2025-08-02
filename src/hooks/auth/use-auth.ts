import type { LoginFormData } from "@/pages/auth/login/Login-form";
import { authService } from "@/services/auth.service";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: LoginFormData) =>
      authService.login({ email: data.email, password: data.password }),
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: () => authService.logout(),
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (data) => authService.changePassword(data),
  });
};

export const useAuthQuery = () => {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: authService.verifyMe,
    staleTime: 0,
    retry: false,
  });
};
