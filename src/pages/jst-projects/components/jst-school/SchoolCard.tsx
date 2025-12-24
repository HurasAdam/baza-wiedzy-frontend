import { ChevronsUp, Copy, Mail, MapPin, Phone, School } from "lucide-react";
import { toast } from "sonner";
import { Card } from "../../../../components/ui/card";
import type { IJstSchool } from "../../../../types";

interface Props {
  school: IJstSchool;
}

const copyToClipboardWithToast = (value: string, label: string = "Wartość") => {
  navigator.clipboard.writeText(value);
  toast.success(`${label} skopiowane do schowka`, { position: "bottom-right" });
};

const SchoolCard = ({ school }: Props) => {
  return (
    <Card
      key={school._id}
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border border-border
        bg-gradient-to-br from-card/70 to-card/40
        shadow-md
        hover:bg-muted/90
       
        transition-all
        duration-300
        p-6
        cursor-pointer
      "
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6">
        <div className="flex-1 space-y-4">
          <h3 className="flex items-center gap-3 text-base font-bold text-muted-foreground leading-snug">
            <School className="w-5 h-5 text-foreground/70" />
            {school.name}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <ChevronsUp className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">SzID: {school.szId}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground truncate">{school.adres}</span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground truncate">{school.phone}</span>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground truncate">{school.email}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-start items-end gap-2">
          <button
            onClick={() => copyToClipboardWithToast(school.szId, "SzID")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-foreground border border-border rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors shadow-sm"
          >
            <Copy className="w-4 h-4 text-foreground/70" /> Kopiuj SzID
          </button>
        </div>
      </div>
    </Card>
  );
};

export default SchoolCard;
