import { useMutation, useQuery } from "@tanstack/react-query";
import { articleUserFlagService } from "../../services/article-user-flag.service";

export const useFindOneArticleUserFlagQuery = (articleId: string) => {
  return useQuery({
    queryKey: ["article-user-flag", articleId],
    queryFn: () => articleUserFlagService.findOne(articleId),
    enabled: !!articleId, // <- query wykona się tylko, jeśli articleId jest prawdziwe
  });
};

export const useCreateArticleUserFlagMutation = () => {
  return useMutation({
    mutationFn: (payload) => {
      return articleUserFlagService.create(payload);
    },
  });
};

export const useUnflagArticleUserFlagMutation = () => {
  return useMutation({
    mutationFn: (articleId: string) => {
      return articleUserFlagService.unflagOne(articleId);
    },
  });
};
