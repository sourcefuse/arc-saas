/**
 * Returns the numeric values of an enum.
 * @param enumType - The enum to get the numeric values from.
 * @returns The numeric values of the enum.
 */
export function numericEnumValues(enumType: Object) {
  return Object.keys(enumType)
    .map(key => Number(key))
    .filter(value => !isNaN(value));
}

/**
 * The default header for the signature.
 */
export const DEFAULT_SIGNATURE_HEADER = 'x-signature';

/**
 * The default header for the timestamp.
 */
export const DEFAULT_TIMESTAMP_HEADER = 'x-timestamp';

/**
 * The default tolerance for the timestamp.
 */
export const DEFAULT_TIMESTAMP_TOLERANCE = 5000;

export const FIVE_SECONDS = 5;
export const ONE_HOUR = 60 * 60;

export function weakEqual<T>(
  value1: T | null | undefined,
  value2: T | null | undefined,
): boolean {
  if (value1 === null) {
    value1 = undefined;
  }
  if (value2 === null) {
    value2 = undefined;
  }
  return value1 === value2;
}

export function hasAnyOf<T>(ob: T, keys: (keyof T)[]): boolean {
  return keys.some(k => ob[k] !== undefined);
}
