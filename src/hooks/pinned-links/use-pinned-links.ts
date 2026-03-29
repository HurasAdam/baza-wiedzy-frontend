import { useMutation, useQuery } from "@tanstack/react-query";
import { pinnedLinksService } from "../../services/pinned-links.service";

export const useCreatePinnedLinkMutation = () => {
  return useMutation({
    mutationFn: (payload) => {
      return pinnedLinksService.create(payload);
    },
  });
};

export const useUpdateOnePinnedLinkMutation = () => {
  return useMutation({
    mutationFn: ({ pinnedLinkId, payload }: { pinnedLinkId: string; payload: unknown }) => {
      return pinnedLinksService.updateOne(pinnedLinkId, payload);
    },
  });
};

export const useDeletePinnedLinkMutation = () => {
  return useMutation({
    mutationFn: (pinnedLinkId: string) => {
      return pinnedLinksService.deleteOne(pinnedLinkId);
    },
  });
};

export const useFindUserPinnedLinksQuery = (userId: string) => {
  return useQuery({
    queryKey: ["pinned-links", userId],
    queryFn: () => {
      return pinnedLinksService.find();
    },
  });
};

export const useFindOneUserPinnedLinkQuery = (pinnedLinkId: string, userId: string) => {
  return useQuery({
    queryKey: ["pinned-link", userId],
    queryFn: () => {
      return pinnedLinksService.findOne(pinnedLinkId);
    },
  });
};
