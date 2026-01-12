import { AlertTriangle, BellRing, Check, Loader, UserPlus, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "info" | "invite" | "warning" | "reminder";
  read: boolean;
  createdAt?: string;
  link?: string;
}

interface Props {
  notification: Notification;
  markAsRead: (notificationId: string) => void;
  deleteNotification: (notificationId: string) => void;
  loadingIds: Set<string>;
  deletingIds: Set<string>;
}

export const NotificationCard = ({ notification, markAsRead, deleteNotification, loadingIds, deletingIds }: Props) => {
  const getTypeIcon = (type: Notification["type"]) => {
    const base = "w-5 h-5";
    switch (type) {
      case "invite":
        return <UserPlus className={`${base} text-green-500`} />;
      case "warning":
        return <AlertTriangle className={`${base} text-yellow-500`} />;
      case "reminder":
        return <BellRing className={`${base} text-indigo-500`} />;
      default:
        return <BellRing className={`${base} text-blue-500`} />;
    }
  };

  const formatTimeAgo = (date?: string) => {
    if (!date) return "";
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000 / 60); // minuty
    if (diff < 1) return "Przed chwilą";
    if (diff < 60) return `${diff} min temu`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h temu`;
    const days = Math.floor(hours / 24);
    return `${days}d temu`;
  };

  return (
    <div
      className={`group flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer shadow-md
        ${
          notification.read ? "bg-card border-border hover:bg-card/90" : "bg-muted/20 border-border hover:bg-muted/40"
        }`}
      onClick={() => {
        if (!notification.read) markAsRead(notification._id);
      }}
    >
      {/* Ikona */}
      <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center border border-border bg-background shadow-sm">
        {loadingIds.has(notification._id) ? (
          <Loader className="w-5 h-5 animate-spin text-muted-foreground" />
        ) : notification.read ? (
          <Check className="w-5 h-5 text-muted-foreground" />
        ) : (
          getTypeIcon(notification.type)
        )}
      </div>

      {/* Treść */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h4 className={`text-sm font-semibold ${notification.read ? "text-muted-foreground" : "text-foreground"}`}>
              {notification.title}
            </h4>
            <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
            {notification.link && (
              <Link
                to={notification.link}
                onClick={(e) => e.stopPropagation()}
                className="text-primary text-sm hover:underline"
              >
                Zobacz artykuł
              </Link>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="p-2 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              deleteNotification(notification._id);
            }}
          >
            {deletingIds.has(notification._id) ? <Loader className="w-4 h-4 animate-spin" /> : <X />}
          </Button>
        </div>

        <div className="flex justify-between items-center mt-3">
          <span className="text-[11px] text-muted-foreground">{formatTimeAgo(notification.createdAt)}</span>
          {!notification.read && <span className="w-2 h-2 rounded-full bg-primary" />}
        </div>
      </div>
    </div>
  );
};
