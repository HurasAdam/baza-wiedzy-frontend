interface FormatDateOptions {
  weekday?: boolean;
  hours?: boolean;
}

/**
 * Formats a date string to a human-readable Polish format.
 *
 * @param dateString - date as ISO string or any format compatible with `Date`
 * @param options - optional formatting settings:
 *  - `weekday` – include full weekday name (e.g., "poniedziałek")
 *  - `hours` – include hours and minutes in 2-digit format (e.g., "14:30")
 * @returns formatted date as string, e.g., "poniedziałek, 15 sierpnia 2025, 14:30"
 */

export const formatDate = (dateString: string, options?: FormatDateOptions) => {
  const date = new Date(dateString);

  return date.toLocaleString("pl-PL", {
    ...(options?.weekday ? { weekday: "long" } : {}),
    year: "numeric",
    month: "long",
    day: "numeric",
    ...(options?.hours ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
};
