import { useQuery } from "@tanstack/react-query";
import { networkToolsService } from "../../services/network-tools.service";

export const useSendNetworkQuery = (params?: { domain: string; resolver: string; recordType: string }) => {
  return useQuery({
    queryKey: ["dns-lookup", params],
    queryFn: () => networkToolsService.find(params),
    enabled: !!params?.domain, // fetch tylko jeśli domain istnieje
  });
};
