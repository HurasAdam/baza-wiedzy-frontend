/**
 * Łączy segmenty URL ze slashem, np. "api/users/42".
 * Przyjmuje ciągi znaków lub liczby.
 *
 * @example
 * buildUrl ("api", "users", 42) => "api/users/42"
 */
export function buildUrl(...args: (string | number)[]): string {
  return args.join("/");
}
