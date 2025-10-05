import { useMutation } from "@tanstack/react-query";

import { reportsTopicService } from "../../services/reports-topic.service";

export const useCreateReportTopicMutation = () => {
  return useMutation({
    mutationFn: (data) => reportsTopicService.createTopicReport(data),
  });
};
