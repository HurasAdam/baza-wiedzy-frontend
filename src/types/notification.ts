export interface NotificationsResponse {
  data: Notification[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
  unreadCount: number;
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "info" | "invite" | "warning" | "reminder";
  read: boolean;
  createdAt?: string;
  link?: string;
}
