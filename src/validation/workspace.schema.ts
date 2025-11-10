import z from "zod";
export const iconOptions = [
  "Layers",
  "Smartphone",
  "LibraryBig",
  "GraduationCap",
  "AppWindow",
  "PanelsTopLeft",
  "Coffee",
  "LeafyGreen",
] as const;
export const workspaceSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  labelColor: z.string().min(3, "Color must be at least 3 characters"),
  icon: z.enum(iconOptions, { required_error: "Icon is required" }),
  description: z.string().optional(),
});
