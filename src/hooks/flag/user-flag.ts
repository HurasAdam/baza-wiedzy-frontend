import { useMutation, useQuery } from "@tanstack/react-query";
import type { FlagForm } from "../../components/flag/flag-modal";
import { flagService } from "../../services/flag.service";

export const useCreateFlagMutation = () => {
  return useMutation({
    mutationFn: (data: FlagForm) => {
      return flagService.create(data);
    },
  });
};

export const useFindMyFlags = (enabled: boolean) => {
  return useQuery({
    queryKey: ["my-flags"],
    queryFn: () => flagService.find(),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};

export const useFindMyFlagsWithStats = (enabled: boolean) => {
  return useQuery({
    queryKey: ["my-flags-with-stats"],
    queryFn: () => flagService.findWithStats(),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};
