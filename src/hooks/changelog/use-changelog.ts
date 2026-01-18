import { useQuery } from "@tanstack/react-query";
import { changelogService } from "../../services/changelog.service";

export const useFindChangelogQuery = () => {
  return useQuery({
    queryKey: ["change-log"],
    queryFn: () => {
      return changelogService.find();
    },
  });
};
