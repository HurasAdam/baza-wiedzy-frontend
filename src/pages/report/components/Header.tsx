import { Badge } from "@/components/ui/badge";
import type { AxiosError } from "axios";
import { ArrowLeft, Calendar, MoreVertical } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Alert } from "../../../components/shared/alert-modal";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import queryClient from "../../../config/query.client";
import {
  useDeleteIssueReportMutation,
  useUpdateReportStatusMutation,
} from "../../../hooks/issue-report/use-issue-report";
import { cn } from "../../../lib/utils";
import type { Report } from "../../admin-panel/admin-issue-reports/components/IssueReportsList";

interface Props {
  report: Report;
  canManageReportStatus: boolean;
}

const statusConfig: Record<
  string,
  {
    label: string;
    dotColor: string;
    badgeColor: string;
  }
> = {
  open: {
    label: "Otwarte",
    dotColor: "bg-sky-600/90",
    badgeColor: "bg-sky-600/70  text-blue-100",
  },
  resolved: {
    label: "Zrealizowane",
    dotColor: "bg-green-600/90",
    badgeColor: "bg-green-600/85 text-green-100",
  },
  closed: {
    label: "Zamknięte",
    dotColor: "bg-gray-500",
    badgeColor: "bg-gray-100 text-gray-800",
  },
};

export const Header = ({ report, canManageReportStatus }: Props) => {
  const navigate = useNavigate();
  const formattedDate = new Date(report.createdAt).toLocaleString("pl-PL");
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState<boolean>(false);
  const { mutate: updateReportStatusMutate } = useUpdateReportStatusMutation();
  const { mutate: deleteReportMutate, isPending: isDeleteReportLoading } = useDeleteIssueReportMutation();

  const onRequestDelete = () => {
    setIsDeleteAlertOpen(true);
  };

  const onStatusChange = (reportId: string, status: string) => {
    updateReportStatusMutate(
      { reportId, payload: status },
      {
        onSuccess: () => {
          toast.success("Zmiany zostały zapisane", {
            position: "bottom-right",
            description: "Status zgłoszenia został zmieniony",
          });
          queryClient.invalidateQueries({ queryKey: ["issue-report", reportId] });
        },
        onError: (error) => {
          const { status } = error as AxiosError;

          if (status === 403) {
            toast.error("Brak uprawnień", {
              description: "Nie posiadasz wymaganych uprawnień do wykonania tej operacji.",
              position: "bottom-right",
              duration: 7000,
            });
            return;
          }

          toast.error("Wystapił błąd, spróbuj ponownie");
        },
      },
    );
  };

  const onDeleteConfirm = (reportId: string) => {
    deleteReportMutate(reportId, {
      onSuccess: () => {
        navigate("/reports");
        toast.success("Zmiany zostały zapisane", {
          position: "bottom-right",
          description: "Zgłoszenie zostało usunięte",
        });
      },
      onError: (error) => {
        const { status } = error as AxiosError;

        if (status === 403) {
          toast.error("Brak uprawnień", {
            description: "Nie posiadasz wymaganych uprawnień do wykonania tej operacji.",
            position: "bottom-right",
            duration: 7000,
          });
          return;
        }

        toast.error("Wystapił błąd, spróbuj ponownie");
      },
    });
  };

  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-border pb-4 mb-6 gap-4">
      <div className="flex items-start md:items-center gap-4 w-full md:w-auto">
        <Button
          variant="outline"
          className="w-14 h-14 flex items-center justify-center rounded-lg bg-background hover:bg-muted/30"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>

        <div className="space-y-1">
          <h1 className="text-xl md:text-lg font-semibold max-w-[740px] break-words text-foreground/95">
            {report.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <div className="flex gap-1.5 items-center">
              <div className={cn("w-3 h-3 rounded-full", statusConfig[report.status]?.dotColor)} />
              <span className="font-medium">{statusConfig[report.status]?.label}</span>
            </div>

            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formattedDate}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto">
        {canManageReportStatus && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Badge className={statusConfig[report.status]?.badgeColor}>{statusConfig[report.status]?.label}</Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {Object.entries(statusConfig).map(([status, config]) => (
                <DropdownMenuItem onSelect={() => onStatusChange(report._id, status)} key={status}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${config.dotColor}`} />
                    {config.label}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {canManageReportStatus && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edytuj</DropdownMenuItem>
              <DropdownMenuItem onClick={onRequestDelete} className="text-red-600">
                Usuń
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <Alert
        isOpen={isDeleteAlertOpen}
        isLoading={isDeleteReportLoading}
        type="warning"
        title="Usunięcie zgłoszenia"
        onCancel={() => setIsDeleteAlertOpen(false)}
        onConfirm={() => onDeleteConfirm(report._id)}
        requireConfirmation={true}
        isConfirmEnabled={true}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-base text-foreground">Czy na pewno chcesz usunąć to zgłoszenie?</span>
            <span className="text-sm text-muted-foreground leading-relaxed">
              Po zatwierdzeniu zgłoszenie zostanie trwale usunięte wraz ze wszystkimi komentarzami powiązanymi z tym
              zgłoszeniem.
            </span>
          </div>

          <div className="flex items-start gap-2 pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground font-medium leading-snug">
              Operacja jest nieodwracalna. Usuń zgłoszenie tylko wtedy, gdy jesteś pewien, że nie jest już potrzebne.
            </span>
          </div>
        </div>
      </Alert>
    </header>
  );
};
