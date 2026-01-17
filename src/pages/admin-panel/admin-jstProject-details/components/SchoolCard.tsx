import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IdCard, Mail, Pencil, Phone, Trash2 } from "lucide-react";

interface SchoolCardProps {
  school: {
    _id: string;
    name: string;
    adres: string;
    email?: string;
    phone?: string;
    szId?: string;
    libId?: string;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SchoolCard({ school, onEdit, onDelete }: SchoolCardProps) {
  return (
    <li className="flex items-start justify-between gap-4 px-6 py-4 hover:bg-muted/50 transition">
      {/* LEFT */}
      <div className="space-y-1">
        <p className="font-medium text-sm">{school.name}</p>
        <p className="text-xs text-muted-foreground">{school.adres}</p>

        {/* Contact */}
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          {school.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {school.email}
            </span>
          )}
          {school.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {school.phone}
            </span>
          )}
        </div>

        {/* IDs */}
        <div className="flex flex-wrap gap-2 pt-1">
          {school.szId && (
            <Badge variant="secondary" className="flex items-center gap-1 text-xs">
              <IdCard className="w-3 h-3" />
              szID: {school.szId}
            </Badge>
          )}
          {school.libId && (
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              <IdCard className="w-3 h-3" />
              libID: {school.libId}
            </Badge>
          )}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex shrink-0 gap-1">
        <Button size="icon" variant="ghost" title="Edytuj szkołę" onClick={() => onEdit(school._id)}>
          <Pencil className="w-4 h-4" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          className="text-destructive"
          title="Usuń szkołę"
          onClick={() => onDelete(school._id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </li>
  );
}
