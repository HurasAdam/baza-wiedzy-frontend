export const statusConfig = {
  open: {
    label: "Otwarte",
    badge: "bg-sky-600/70 text-blue-100 w-[90px]",
  },
  resolved: {
    label: "Zrealizowane",
    badge: "bg-green-600/85 text-green-100 w-[90px]",
  },
  closed: {
    label: "Zamknięte",
    badge: "bg-gray-300 text-gray-800 w-[90px]",
  },
} as const;

export type ReportStatus = keyof typeof statusConfig;
