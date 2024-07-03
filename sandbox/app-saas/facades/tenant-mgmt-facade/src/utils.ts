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
