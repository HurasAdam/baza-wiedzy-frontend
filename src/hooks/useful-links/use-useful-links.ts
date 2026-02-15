import { useMutation, useQuery } from "@tanstack/react-query";

import { usefulLinksService } from "../../services/useful-links.service";

export const useCreateUsefulLinkMutation = () => {
  return useMutation({
    mutationFn: (data) => usefulLinksService.createUsefulLink(data),
  });
};

export const useDeleteUsefulLinkMutation = () => {
  return useMutation({
    mutationFn: (usefulLinkId: string) => usefulLinksService.deleteOne(usefulLinkId),
  });
};

export const useFindUsefulLinksQuery = () => {
  return useQuery({
    queryKey: ["useful-links"],
    queryFn: () => usefulLinksService.find(),
  });
};
