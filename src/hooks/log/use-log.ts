import { useQuery } from "@tanstack/react-query";
import { logService } from "../../services/log.service";

export const useFindLogsQuery = () => {
  return useQuery({
    queryKey: ["logs"],
    queryFn: () => {
      return logService.find();
    },
  });
};
