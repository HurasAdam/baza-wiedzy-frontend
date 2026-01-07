export const statusConfig = {
  open: {
    label: "Otwarte",
    badge: "bg-blue-500/15 text-sky-500 w-[90px]",
  },
  resolved: {
    label: "Zrealizowane",
    badge: "bg-green-500/15 text-green-500 w-[90px]",
  },
  closed: {
    label: "Zamknięte",
    badge: "bg-gray-600/15 text-gray-400 w-[90px]",
  },
} as const;

export type ReportStatus = keyof typeof statusConfig;
