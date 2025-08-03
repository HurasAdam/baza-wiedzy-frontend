/**
 * Assercja, która rzuca błąd, jeśli przekazana wartość jest `undefined`.
 *
 * @template T Typ wartości, która jest asercjonowana (np. `string`, `number`, interfejs własny).
 * @param {T | undefined} value Sprawdzana wartość.
 * @param {string} message Komunikat błędu rzucanego, gdy `value` jest `undefined`.
 * @throws {Error} Gdy `value === undefined`.
 * @asserts value is T Po wywołaniu tej funkcji, TS wie, że `value` nie jest już `undefined`.
 */

export function assertDefined<T>(
  value: T | undefined,
  message: string
): asserts value is T {
  if (value === undefined) {
    throw new Error(message);
  }
}
