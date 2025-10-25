import { useMutation, useQuery } from "@tanstack/react-query";
import { flagService } from "../../services/flag.service";

export const useCreateFlagMutation = () => {
  return useMutation({
    mutationFn: (data) => {
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
