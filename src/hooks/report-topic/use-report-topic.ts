import { useMutation } from "@tanstack/react-query";
import type { reportTopicForm } from "../../pages/TopicRegister/forms/register-topic-form";
import { reportsTopicService } from "../../services/reports-topic.service";

export const useCreateReportTopicMutation = () => {
  return useMutation({
    mutationFn: (data: reportTopicForm) =>
      reportsTopicService.createTopicReport(data),
  });
};
