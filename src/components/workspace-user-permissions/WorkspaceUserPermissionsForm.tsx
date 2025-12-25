import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader, Save } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

interface WorkspaceUserPermissionsFormProps {
  defaultPermissions: Record<string, boolean>;
  labels: Record<string, string>;
  onSubmit: (permissions: Record<string, boolean>) => void;
  onCancel: () => void;
  isSaving?: boolean;
  isOwner: boolean;
}

export function WorkspaceUserPermissionsForm({
  defaultPermissions,
  labels,
  onSubmit,
  onCancel,
  isSaving,
  isOwner,
}: WorkspaceUserPermissionsFormProps) {
  const { control, handleSubmit } = useForm<Record<string, boolean>>({
    defaultValues: defaultPermissions,
  });

  const handleFormSubmit = (data: Record<string, boolean>) => {
    onSubmit(data);
  };
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        {Object.keys(defaultPermissions).map((key) => (
          <div key={key} className="flex items-center justify-between rounded-lg border p-3">
            <span className="text-sm font-medium">{labels[key] ?? key}</span>

            <Controller
              name={key}
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} disabled={isOwner} onCheckedChange={field.onChange} />
              )}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button onClick={onCancel} type="button" variant="ghost">
          Anuluj
        </Button>
        <Button type="submit" disabled={isOwner || isSaving} className="flex items-center gap-2">
          {isSaving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? "Zapisywanie..." : "Zapisz zmiany"}
        </Button>
      </div>
    </form>
  );
}
