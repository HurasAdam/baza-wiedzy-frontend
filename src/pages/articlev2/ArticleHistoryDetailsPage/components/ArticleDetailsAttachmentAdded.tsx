import { Card } from "@/components/ui/card";
import { Calendar, CloudUpload, User2 } from "lucide-react";
import React from "react";

interface AttachmentChange {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
}

interface AttachmentHistoryItem {
  changes?: {
    field: string;
    oldValue: any;
    newValue: AttachmentChange;
  }[];
  createdBy?: {
    _id: string;
    name: string;
    surname: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
  isSystem?: boolean;
  statusChange?: {
    from: string;
    to: string;
  };
}

interface Props {
  item?: AttachmentHistoryItem;
}

export const ArticleDetailsAttachmentAdded: React.FC<Props> = ({ item }) => {
  if (!item) return <div className="text-center text-muted-foreground py-6">Brak danych o tym wpisie historii</div>;

  const attachment = item.changes?.find((c) => c.field === "attachments")?.newValue;
  if (!attachment) return <div className="text-center text-muted-foreground py-6">Brak danych załącznika</div>;

  const actionDate = item.createdAt ? new Date(item.createdAt) : null;
  const uploaderName = item.createdBy ? `${item.createdBy.name} ${item.createdBy.surname}` : "System";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Karta 1: Szczegóły załącznika */}
      <Card className="py-5.5 px-6 bg-card border border-border rounded-xl shadow-sm hover:shadow-lg transition-all flex flex-col gap-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="border w-9 h-9 flex items-center justify-center rounded-lg bg-background">
            <CloudUpload className="w-6 h-6 text-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Szczegóły dodanego załącznika</h2>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            <strong>Nazwa pliku:</strong> {attachment.originalName}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Typ pliku:</strong> {attachment.mimeType}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Rozmiar:</strong> {(attachment.size / 1024).toFixed(2)} KB
          </p>
        </div>
      </Card>

      {/* Karta 2: Info o akcji */}
      <Card className="py-5.5 px-6 bg-card border border-border rounded-xl shadow-sm hover:shadow-lg transition-all flex flex-col gap-4">
        <div className="flex items-center gap-3 mb-4 ">
          <div className="border w-9 h-9 flex items-center justify-center rounded-lg bg-background">
            <User2 className="w-6 h-6 text-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Autor zmian</h2>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            <strong>Dodany przez:</strong> {uploaderName}
          </p>

          {actionDate && (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-foreground" />
              <span>{actionDate.toLocaleString()}</span>
            </p>
          )}

          {item.isSystem && (
            <p className="text-xs text-muted-foreground/80 italic mt-2 border-t border-border pt-2">
              Zmiana wykonana automatycznie przez system
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};
