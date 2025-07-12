import z from "zod";

export const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 1024 * 1024 * 4, {
    message: "Maksymalny rozmiar pliku to 4 MB.",
  })
  .refine((file) => allowedFormats.includes(file.type), {
    message: "Obsługiwane formaty plików: SVG, PNG, JPG, GIF.",
  });

export const allowedFormats = [
  "image/svg+xml",
  "image/png",
  "image/jpeg",
  "image/gif",
];
