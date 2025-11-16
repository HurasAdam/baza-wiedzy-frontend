import { zodResolver } from "@hookform/resolvers/zod";
import { LayoutDashboard, Loader, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

export const InviteCodeSchema = z.object({
  inviteCode: z.string().min(3, "Wprowadź kod zaproszenia"),
});

export type WorkspaceInviteFormData = z.infer<typeof InviteCodeSchema>;

interface WorkspaceInviteModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSave: (data: WorkspaceInviteFormData) => void;
  isLoading: boolean;
}

export const WorkspaceInviteModal = ({ isOpen, setIsOpen, onSave, isLoading }: WorkspaceInviteModalProps) => {
  const form = useForm<WorkspaceInviteFormData>({
    resolver: zodResolver(InviteCodeSchema),
    defaultValues: {
      inviteCode: "",
    },
  });

  const onSubmit = (data: WorkspaceInviteFormData) => {
    onSave(data);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
      <DialogContent className="sm:max-w-md w-full max-h-[80vh] overflow-y-auto rounded-lg shadow-lg p-6">
        <DialogHeader className="text-center">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5. h-5.5 text-primary" />
            <DialogTitle className="text-xl font-semibold text-foreground">Dołącz do kolekcji</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Wprowadź kod zaproszenia, aby dołączyć do istniejącej kolekcji.
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
            <FormField
              control={form.control}
              name="inviteCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kod zaproszenia</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      placeholder="Wpisz kod kolekcji..."
                      className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-muted-foreground transition"
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-destructive mt-1" />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                Anuluj
              </Button>
              <Button type="submit" className="flex items-center justify-center gap-2" disabled={isLoading}>
                {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
                Dołącz
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
