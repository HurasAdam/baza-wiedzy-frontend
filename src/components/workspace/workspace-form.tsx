import { zodResolver } from "@hookform/resolvers/zod";
import {
  AppWindow,
  Coffee,
  GraduationCap,
  Layers,
  LeafyGreen,
  LibraryBig,
  Loader,
  PanelsTopLeft,
  Save,
  Smartphone,
} from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import type { Workspace } from "../../layouts/workspace/components/WorkspaceSidebar";
import { cn } from "../../lib/utils";
import { workspaceSchema, type WorkspaceDataForm } from "../../validation/workspace.schema";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export type WorkspaceForm = z.infer<typeof workspaceSchema>;

// Define 8 predefined colors
export const colorOptions = [
  "#FF5733", // Red-Orange
  "#33C1FF", // Blue
  "#28A745", // Green
  "#FFC300", // Yellow
  "#8E44AD", // Purple
  "#E67E22", // Orange
  "#2ECC71", // Light Green
  "#34495E", // Navy
];

export const WORKSPACE_ICONS = {
  Layers,
  Smartphone,
  LibraryBig,
  GraduationCap,
  AppWindow,
  PanelsTopLeft,
  Coffee,
  LeafyGreen,
};
export const iconOptions = Object.keys(WORKSPACE_ICONS); // ["Layers", "Grid", "Box", "Package", "Cpu"]

interface WorkspaceFormProps {
  onSubmit: (data: WorkspaceDataForm) => void;
  workspace?: Workspace;
  isLoading: boolean;
  permissions?: Record<string, boolean>;
}

const WorkspaceForm = ({ onSubmit, workspace, isLoading, permissions }: WorkspaceFormProps) => {
  const form = useForm<WorkspaceForm>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: workspace ? workspace.name : "",
      labelColor: workspace ? workspace.labelColor : colorOptions[0],
      description: workspace ? workspace.description : "",
      icon: workspace ? workspace.icon : "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-8 py-4">
          <FormField
            disabled={permissions && !permissions?.editWorkspace}
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwa</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nazwa kolekcji" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={permissions && !permissions?.editWorkspace}
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opis</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Opis kolekcji" rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={permissions && !permissions?.editWorkspace}
            control={form.control}
            name="labelColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kolor</FormLabel>
                <FormControl>
                  <div className="flex gap-3 flex-wrap">
                    {colorOptions.map((color) => (
                      <div
                        key={color}
                        onClick={() => {
                          // if (!permissions?.editWorkspace) return;
                          field.onChange(color);
                        }}
                        className={cn(
                          "w-6 h-6 rounded-full transition-all duration-300",
                          permissions?.editWorkspace ? "cursor-pointer hover:opacity-80" : "",
                          field.value === color && "ring-2 ring-offset-2 ring-blue-500"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ICONS */}
          <FormField
            control={form.control}
            disabled={permissions && !permissions?.editWorkspace}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ikona</FormLabel>
                <FormControl>
                  <div className="flex gap-3 flex-wrap">
                    {iconOptions.map((iconName) => {
                      const IconComponent = WORKSPACE_ICONS[iconName];
                      return (
                        <div
                          key={iconName}
                          onClick={() => {
                            field.onChange(iconName);
                          }}
                          className={cn(
                            "w-10 h-10 flex items-center justify-center rounded-md border transition-all duration-300",
                            permissions?.editWorkspace ? "cursor-pointer hover:opacity-80" : "",
                            field.value === iconName && "ring-2 ring-offset-2 ring-blue-500"
                          )}
                        >
                          <IconComponent className="w-6 h-6" />
                        </div>
                      );
                    })}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <Button
            type="submit"
            disabled={isLoading || (permissions && !permissions?.editWorkspace)}
            className={cn(
              "flex items-center gap-2",
              permissions && !permissions?.editWorkspace && "opacity-50 cursor-not-allowed"
            )}
          >
            {isLoading ? <Loader className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
            {workspace ? "Zapisz" : "Utwórz"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default WorkspaceForm;
