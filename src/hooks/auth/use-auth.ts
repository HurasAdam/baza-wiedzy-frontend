import { authService } from "@/services/auth.service";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data) =>
      authService.login({ email: data.email, password: data.password }),
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
