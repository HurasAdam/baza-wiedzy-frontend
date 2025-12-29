interface Props {
  status: string;
  isVisible: boolean;
}

const STATUS_TEXT_MAP = {
  NEW: {
    label: "Nowy – oczekuje weryfikacji",
    className: "text-cyan-600/85",
  },
  EDITED: {
    label: "Wymaga weryfikacji",
    className: "text-yellow-700",
  },
  PENDING: {
    label: "Wymaga weryfikacji",
    className: "text-yellow-700",
  },
  APPROVED: {
    label: "Zweryfikowany",
    className: "text-emerald-600/95",
  },
  REJECTED: {
    label: "Odrzucony",
    className: "text-rose-700/95",
  },
} as const;

const resolveStatusKey = (status: string, isVisible: boolean) => {
  if (status === "draft" && !isVisible) return "NEW";
  if (status === "draft" && isVisible) return "EDITED";
  if (status === "pending") return "PENDING";
  if (status === "approved") return "APPROVED";
  if (status === "rejected") return "REJECTED";
  return null;
};

export const ArticleStatusLabel = ({ status, isVisible }: Props) => {
  const key = resolveStatusKey(status, isVisible);
  const meta = key ? STATUS_TEXT_MAP[key] : null;

  return <span className={`font-medium ${meta?.className ?? "text-foreground/70"}`}>{meta?.label ?? status}</span>;
};
