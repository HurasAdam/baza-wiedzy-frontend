import { useQuery } from "@tanstack/react-query";
import { serverStorageService } from "../../services/server-storage.service";

export const useCheckServerStorageQuery = () => {
  return useQuery({
    queryKey: ["server-storage"],
    queryFn: () => {
      return serverStorageService.find();
    },
  });
};
