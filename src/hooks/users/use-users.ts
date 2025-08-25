import { useMutation, useQuery } from "@tanstack/react-query";
import type { UserAccountFormData } from "../../components/user-account/user-account-modal";
import { usersService } from "../../services/users.service";
import type { RoleFormData } from "../../types/roles";
import type { EditUserInfoFormData } from "../../validation/edit-user-info.schema";

export const useFindUser = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => {
      return usersService.findUser(userId);
    },

    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};

export const useFindUsers = (params?: URLSearchParams) => {
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

export const useFindRole = (roleId: string) => {
  return useQuery({
    queryKey: ["role", roleId],
    queryFn: () => {
      return usersService.findRole(roleId);
    },
    enabled: !!roleId,
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

export const useFindPermissions = () => {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: () => {
      return usersService.findPermissions();
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

export const useCreateUserAccountMutation = () => {
  return useMutation({
    mutationFn: (data: UserAccountFormData) => {
      return usersService.createUserAccout(data);
    },
  });
};

export const useCreateRoleMutation = () => {
  return useMutation({
    mutationFn: ({
      permissions,
      name,
      labelColor,
      iconKey,
    }: {
      permissions: string[];
      name: string;
      labelColor: string;
      iconKey: string;
    }) => {
      return usersService.createRole(permissions, name, iconKey, labelColor);
    },
  });
};

export const useUpdateUserMutation = () => {
  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: EditUserInfoFormData }) => {
      return usersService.updateOneUser(userId, payload);
    },
  });
};

export const useUpdateMyProfileMutation = () => {
  return useMutation({
    mutationFn: ({ payload }: { userId: string; payload: EditUserInfoFormData }) => {
      return usersService.updateMyProfile(payload);
    },
  });
};

export const useUpdateRoleMutation = () => {
  return useMutation({
    mutationFn: ({ roleId, data }: { roleId: string; data: RoleFormData }) => {
      return usersService.updateRole({
        roleId,
        payload: data,
      });
    },
  });
};

export const useChangeUserRoleMutation = () => {
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: {} }) => {
      return usersService.changeUserRole(userId, data);
    },
  });
};
