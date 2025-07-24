import { CheckCircleIcon, FilePlus, SquarePen, Trash2 } from "lucide-react";

// generator mocków
export const generateMockHistory = (count: number) => {
  const users = [
    "Anna Kowalska",
    "Urszula Lubas",
    "Adam Nowak",
    "Kazik Nowakowski",
  ];
  const types: Array<"creation" | "edit" | "status" | "trash"> = [
    "creation",
    "edit",
    "status",
    "trash",
  ];
  return Array.from({ length: count }).map((_, i) => {
    const type = types[i % types.length];
    const labels = {
      creation: "Utworzenie artykułu",
      edit: "Edycja artykułu",
      status: "Zmiana statusu",
      trash: "Przeniesienie do kosza",
    };
    return {
      id: i + 1,
      date: new Date(Date.now() - Math.random() * 1e10).toLocaleString("pl-PL"),
      user: users[Math.floor(Math.random() * users.length)],
      type,
      action: labels[type],
      description: `Szczegóły zmiany #${i + 1}`,
    };
  });
};

const eventTypeConfig: Record<
  string,
  { Icon: React.ComponentType<{ className?: string }>; bgClass: string }
> = {
  creation: { Icon: FilePlus, bgClass: "bg-primary" },
  edit: { Icon: SquarePen, bgClass: "bg-secondary" },
  status: { Icon: CheckCircleIcon, bgClass: "bg-accent" },
  trash: { Icon: Trash2, bgClass: "bg-destructive" },
};

export const getEventConfig = (type: string) =>
  eventTypeConfig[type] || { Icon: FilePlus, bgClass: "bg-muted" };
