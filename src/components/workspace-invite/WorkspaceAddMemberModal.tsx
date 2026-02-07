import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, ChevronsUpDownIcon, LayoutDashboard, Loader, UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useFindWorkspaceInviteCandidatesQuery } from "../../hooks/workspace-members/use-workspace-member";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export const AddSingleMemberSchema = z.object({
  userId: z.string().min(1, "Wybierz użytkownika"),
});

export type WorkspaceAddMemberFormData = z.infer<typeof AddSingleMemberSchema>;

interface WorkspaceInviteModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isLoading: boolean;
  workspaceId: string;
  onSave: (data: WorkspaceAddMemberFormData) => void;
}

export const WorkspaceAddMemberModal = ({
  isOpen,
  setIsOpen,
  onSave,
  isLoading,
  workspaceId,
}: WorkspaceInviteModalProps) => {
  const { data: workspaceInviteCandidates = [] } = useFindWorkspaceInviteCandidatesQuery(workspaceId!);

  const form = useForm<WorkspaceAddMemberFormData>({
    resolver: zodResolver(AddSingleMemberSchema),
    defaultValues: { userId: "" },
  });

  const [open, setOpen] = useState(false);

  const onSubmit = (data: WorkspaceAddMemberFormData) => {
    onSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
      <DialogContent className="sm:max-w-md w-full rounded-lg shadow-lg p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            <DialogTitle className="text-xl font-semibold text-foreground">Dodaj użytkownika</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Wybierz użytkownika, którego chcesz dodać do kolekcji</p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-6">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Użytkownik</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <FormControl>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-full justify-between bg-transparent"
                        >
                          {workspaceInviteCandidates.find((u) => u._id === field.value)
                            ? `${workspaceInviteCandidates.find((u) => u._id === field.value)?.name} ${workspaceInviteCandidates.find((u) => u._id === field.value)?.surname}`
                            : "Wybierz użytkownika..."}
                          <ChevronsUpDownIcon className="ml-2 opacity-50 w-4 h-4" />
                        </Button>
                      </PopoverTrigger>
                    </FormControl>

                    <PopoverContent
                      className="w-[396px] p-0 overflow-visible"
                      side="bottom"
                      align="start"
                      avoidCollisions={false}
                    >
                      <Command>
                        <CommandInput placeholder="Wyszukaj użytkownika..." />
                        <CommandList
                          className="max-h-60 overflow-y-auto scrollbar-custom"
                          onWheel={(e) => e.stopPropagation()}
                        >
                          <CommandEmpty>Brak wyników</CommandEmpty>
                          <CommandGroup>
                            {workspaceInviteCandidates.map((user) => (
                              <CommandItem
                                key={user._id}
                                onSelect={() => {
                                  field.onChange(user._id);
                                  setOpen(false);
                                }}
                                className={cn(
                                  "flex items-center justify-between px-3 py-2 cursor-pointer rounded-md transition-all duration-150",
                                  "hover:bg-accent/20",
                                  field.value === user._id ? "bg-accent/30 shadow-md" : "",
                                )}
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium text-foreground">
                                    {user.name} {user.surname}
                                  </span>
                                  <span className="text-sm text-muted-foreground">{user.email}</span>
                                </div>
                                {field.value === user._id && <CheckIcon className="w-4 h-4 text-primary" />}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                Anuluj
              </Button>
              <Button type="submit" className="flex items-center justify-center gap-2" disabled={isLoading}>
                {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
                Dodaj
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
