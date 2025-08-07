import { useMutation, useQuery } from "@tanstack/react-query";
import { usersService } from "../../services/users.service";

export const useFindUsers = (params?: URLSearchParams) => {
  console.log("PARAMSY", params);
  return useQuery({
    queryKey: ["users", params?.toString()],
    queryFn: () => {
      return usersService.findUsers(params);
    },

    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};

export const useFindRoles = (params?: URLSearchParams) => {
  return useQuery({
    queryKey: ["roles", params?.toString()],
    queryFn: () => {
      return usersService.findRoles(params);
    },

    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};

export const useFindAdmins = (params?: URLSearchParams) => {
  return useQuery({
    queryKey: ["admins", params?.toString()],
    queryFn: () => {
      return usersService.findAdmins(params);
    },

    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};

export const useFindUserFavoritesArticlesQuery = (params?: URLSearchParams) => {
  return useQuery({
    queryKey: ["favorite-articles", params?.toString()],
    queryFn: () => {
      return usersService.findMyFavorites(params);
    },

    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};

export const useResetUserPasswordMutation = () => {
  return useMutation({
    mutationFn: (userId: string) => {
      return usersService.resetUserPassword(userId);
    },
  });
};

export const useDisableUserAccountMutation = () => {
  return useMutation({
    mutationFn: (userId: string) => {
      return usersService.disableUserAccount(userId);
    },
  });
};

export const useEnableUserAccountMutation = () => {
  return useMutation({
    mutationFn: (userId: string) => {
      return usersService.enableUserAccount(userId);
    },
  });
};

export const useCreateRoleMutation = () => {
  return useMutation({
    mutationFn: ({ permissions, name, labelColor, iconKey }) => {
      return usersService.createRole(permissions, name, iconKey, labelColor);
    },
  });
};
