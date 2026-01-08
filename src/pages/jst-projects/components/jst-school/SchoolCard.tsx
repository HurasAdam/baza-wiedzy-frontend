import { Copy, Mail, MapPin, Phone, School } from "lucide-react";
import { toast } from "sonner";
import { Card } from "../../../../components/ui/card";
import type { IJstSchool } from "../../../../types";

interface Props {
  school: IJstSchool;
}

const copy = (value: string, label: string) => {
  navigator.clipboard.writeText(value);
  toast.success(`${label} skopiowane`, { position: "bottom-right" });
};

const SchoolCard = ({ school }: Props) => {
  return (
    <Card
      className="
        group
        rounded-2xl border border-border
        bg-card hover:bg-muted/40
        transition-colors
        p-5
      "
    >
      <div className="grid grid-cols-[1fr_220px] gap-6 items-stretch">
        {/* LEFT */}
        <div className="min-w-0 space-y-2">
          <h3 className="flex items-center gap-2 text-sm font-semibold truncate">
            <School className="w-4 h-4 text-muted-foreground" />
            {school.name}
          </h3>

          <div className="flex items-center gap-2 text-sm text-muted-foreground truncate">
            <MapPin className="w-4 h-4 shrink-0" />
            {school.adres}
          </div>

          <div className="flex gap-4 text-sm text-muted-foreground">
            {school.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {school.phone}
              </span>
            )}
            {school.email && (
              <span className="flex items-center gap-1 truncate max-w-[260px]">
                <Mail className="w-4 h-4" />
                {school.email}
              </span>
            )}
          </div>
        </div>

        <div
          className="
            flex flex-col justify-center gap-3
            border-l pl-4
          "
        >
          <div
            onClick={() => copy(school.szId, "SzID")}
            className="
              group/id
              flex items-center justify-between gap-2
              cursor-pointer
              rounded-lg
              px-3 py-2
              hover:bg-muted/60
              transition
            "
          >
            <span className="font-mono text-sm font-semibold">SzID {school.szId}</span>
            <Copy className="w-4 h-4 text-muted-foreground opacity-0 group-hover/id:opacity-100 transition" />
          </div>

          <div
            onClick={() => copy(school.libId, "LibID")}
            className="
              group/id
              flex items-center justify-between gap-2
              cursor-pointer
              rounded-lg
              px-3 py-2
              hover:bg-muted/60
              transition
              
            "
          >
            <span className="font-mono text-sm text-muted-foreground">LibID {school.libId}</span>
            <Copy className="w-4 h-4 text-muted-foreground opacity-0 group-hover/id:opacity-100 transition" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SchoolCard;
