import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Loader } from "lucide-react";
import React, { useRef } from "react";
import queryClient from "../../config/query.client";
import {
  useDeleteNotificationMutation,
  useFindMyNotificationsQuery,
  useMarkAllNotificationsAsreadMutation,
  useMarkNotificationAsreadMutation,
} from "../../hooks/notifications/use-notifications";
import { NotificationCard } from "./NotificationCard";

interface NotificationsPanelProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onOpenChange }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useFindMyNotificationsQuery();

  const allNotifications = data?.pages.flatMap((page) => page.data) ?? [];
  const { mutate: markAsReadMutate } = useMarkNotificationAsreadMutation();
  const { mutate: markAllAsReadMutate } = useMarkAllNotificationsAsreadMutation();
  const { mutate: deleteNotificationMutate } = useDeleteNotificationMutation();

  const [loadingIds, setLoadingIds] = React.useState<Set<string>>(new Set());
  const [deletingIds, setDeletingIds] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 50) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="min-w-[480px] p-6 ">
        <SheetHeader>
          <div className="flex justify-between items-center">
            <SheetTitle className="text-xl font-semibold">Powiadomienia</SheetTitle>
            <Button variant="ghost" size="sm" className="text-primary text-sm font-medium">
              Oznacz wszystkie jako przeczytane
            </Button>
          </div>
        </SheetHeader>

        <div
          ref={scrollContainerRef}
          className="mt-6 flex flex-col gap-2.5 overflow-y-auto min-h-[70vh] max-h-[70vh] scrollbar-custom"
        >
          {isLoading && (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <NotificationSkeleton key={i} />
              ))}
            </>
          )}

          {!isLoading && allNotifications.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">Brak powiadomień</p>
          )}

          {allNotifications.map((n) => (
            <NotificationCard
              notification={n}
              markAsRead={markAsRead}
              deleteNotification={deleteNotification}
              loadingIds={loadingIds}
              deletingIds={deletingIds}
            />
          ))}

          {isFetchingNextPage && (
            <div className="flex justify-center py-4">
              <Loader className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}
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
