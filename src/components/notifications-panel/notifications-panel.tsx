import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AlertTriangle, BellRing, Check, Loader, UserPlus, X } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import queryClient from "../../config/query.client";
import {
  useDeleteNotificationMutation,
  useFindMyNotificationsQuery,
  useMarkAllNotificationsAsreadMutation,
  useMarkNotificationAsreadMutation,
} from "../../hooks/notifications/use-notifications";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "invite" | "warning" | "reminder";
  read: boolean;
  createdAt?: string;
  link?: string;
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onOpenChange }) => {
  const { data: notifications, isLoading } = useFindMyNotificationsQuery();
  const { mutate: markAsReadMutate } = useMarkNotificationAsreadMutation();
  const { mutate: markAllAsReadMutate } = useMarkAllNotificationsAsreadMutation();
  const { mutate: deleteNotificationMutate } = useDeleteNotificationMutation();

  const [loadingIds, setLoadingIds] = React.useState<Set<string>>(new Set());
  const [deletingIds, setDeletingIds] = React.useState<Set<string>>(new Set());

  const markAsRead = (id: string) => {
    setLoadingIds((prev) => new Set(prev).add(id));

    markAsReadMutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
        queryClient.invalidateQueries({ queryKey: ["my-summary-notifications"] });
        setLoadingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      },
      onError: () => {
        setLoadingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      },
    });
  };

  const markAllAsRead = () => {
    markAllAsReadMutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
        queryClient.invalidateQueries({ queryKey: ["my-summary-notifications"] });
      },
    });
  };
  const deleteNotification = (id: string) => {
    setDeletingIds((prev) => new Set(prev).add(id));

    deleteNotificationMutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
        queryClient.invalidateQueries({ queryKey: ["my-summary-notifications"] });
        setDeletingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      },
      onError: () => {
        setDeletingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      },
    });
  };

  const getTypeIcon = (type: Notification["type"]) => {
    const base = "w-4 h-4";
    switch (type) {
      case "invite":
        return <UserPlus className={`${base} text-emerald-500`} />;
      case "warning":
        return <AlertTriangle className={`${base} text-amber-500`} />;
      case "reminder":
        return <BellRing className={`${base} text-indigo-500`} />;
      default:
        return <BellRing className={`${base} text-primary`} />;
    }
  };

  const formatTimeAgo = (date?: string) => {
    if (!date) return "";
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000 / 60 / 60);
    return diff < 1 ? "Przed chwilą" : `${diff}h temu`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="min-w-[480px] p-6">
        <SheetHeader>
          <div className="flex justify-between items-center">
            <SheetTitle className="text-xl font-semibold">Powiadomienia</SheetTitle>
            <Button variant="ghost" size="sm" className="text-primary text-sm font-medium">
              Oznacz wszystkie jako przeczytane
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-2.5 overflow-y-auto max-h-[70vh] scrollbar-custom">
          {isLoading && (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <NotificationSkeleton key={i} />
              ))}
            </>
          )}

          {notifications?.data?.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">Brak powiadomień</p>
          )}

          {notifications?.data?.map((n) => (
            <div
              key={n.id}
              className="group relative flex items-start gap-3 rounded-lg border border-border/70 px-3.5 py-3.5 transition-all duration-200 cursor-pointer bg-muted/30 hover:bg-muted/50"
            >
              <div
                onClick={() => {
                  if (!n.read) markAsRead(n._id);
                }}
                className="flex-shrink-0 flex items-center justify-center bg-background rounded-lg p-3 border border-border/60 group"
              >
                {loadingIds.has(n._id) ? (
                  <Loader className="w-3 h-3 animate-spin" />
                ) : n.read ? (
                  <Check className="w-3 h-3 text-muted-foreground" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                )}
              </div>

              <div className="flex-1 flex flex-col gap-1 justify-between">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(n.type)}
                    <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{n.title}</span>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-3 text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(n._id);
                    }}
                  >
                    {deletingIds.has(n._id) ? <Loader className="w-3 h-3  animate-spin" /> : <X className="" />}
                  </Button>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground leading-tight mt-0.5 line-clamp-2">{n.message}</p>

                  {n.link && (
                    <Link
                      to={n.link}
                      className="text-primary text-sm mt-1 hover:underline inline-block"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Zobacz artykuł
                    </Link>
                  )}
                </div>

                <div className="flex justify-end mt-1">
                  <span className="text-[11px] text-muted-foreground">{formatTimeAgo(n.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-between items-center border-t pt-4">
          <Button onClick={markAllAsRead} variant="link" size="sm" className="text-primary">
            Zobacz wszystkie powiadomienia
          </Button>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Zamknij
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const NotificationSkeleton: React.FC = () => (
  <div className="flex items-start gap-3 rounded-lg border border-border/70 px-3.5 py-3.5 animate-pulse bg-muted/30">
    <div className="w-6 h-6 rounded-lg bg-background border border-border/60" />
    <div className="flex-1 flex flex-col gap-2">
      <div className="h-3 w-1/2 bg-background rounded" />
      <div className="h-3 w-full bg-background rounded" />
      <div className="h-3 w-2/3 bg-background rounded" />
    </div>
  </div>
);
