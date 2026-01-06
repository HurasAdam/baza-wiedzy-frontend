export const statusConfig = {
  open: {
    label: "Otwarte",
    badge: "bg-sky-600/90 text-blue-50",
  },
  resolved: {
    label: "Ukończone",
    badge: "bg-green-600/90 text-green-700",
  },
  rejected: {
    label: "Zamknięte",
    badge: "bg-red-100 text-red-700",
  },
} as const;

export type ReportStatus = keyof typeof statusConfig;
