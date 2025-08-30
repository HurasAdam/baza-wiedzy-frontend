// fileHelpers.ts

import type { Attachment } from "../types/attachment";

export type FileType = "pdf" | "ppt" | "img" | "txt" | "xls" | "other";

/**
 * Maps a MIME type string to a simplified file type.
 *
 * @param mimeType - The MIME type of the file (e.g. "image/png", "application/pdf").
 * @returns The simplified file type used for icons and display.
 */
export function mapMimeTypeToFileType(mimeType: string): FileType {
  if (mimeType.startsWith("image/")) return "img";
  if (mimeType.startsWith("text/")) return "txt";
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.includes("presentation") || mimeType.includes("ppt")) return "ppt";
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) return "xls";
  return "other";
}

/**
 * Generates a full URL to an attachment served by the backend.
 * Automatically strips `/app` from the path because Express serves `/uploads`.
 *
 * @param file - The attachment object containing the `path`.
 * @returns Full URL string to access the attachment.
 */
export function getAttachmentUrl(file: Attachment): string {
  const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
  const relativePath = file.path.replace("/app", ""); // Express serves from /uploads
  return `${BASE_URL}${relativePath}`;
}

/**
 * Copies the URL of an attachment to the clipboard.
 *
 * @param file - The attachment object.
 * @param callback - A function called after the URL is copied (e.g. to show a toast).
 */
export const copyAttachmnentUrl = (file: Attachment, callback: () => void): void => {
  const url = getAttachmentUrl(file);
  navigator.clipboard.writeText(url);
  callback();
};

/**
 * Converts a file size in bytes to a human-readable string.
 *
 * @param bytes - Size in bytes.
 * @returns Human-readable string (e.g. "154 B", "1.3 KB", "2.4 MB").
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(1)} GB`;
}
