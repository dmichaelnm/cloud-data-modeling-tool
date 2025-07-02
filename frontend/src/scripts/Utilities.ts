/**
 * Converts the provided value to a number if possible.
 *
 * @param {any} value - The input value to be converted to a number.
 *
 * @return {number | null} Returns the converted number if successful, or null if the conversion is not possible.
 */
export function toNumber(value: any): number | null {
  if (typeof value === 'boolean') {
    return value ? 1 : 0;
  } else {
    const nmbr = parseFloat(value);
    if (!isNaN(nmbr) && isFinite(nmbr)) {
      return nmbr;
    }
    return null;
  }
}

/**
 * Converts a given value to a boolean representation.
 *
 * @param {any} value - The value to be converted to a boolean. Can be of any type.
 *                      Strings like 'true', '1', and any positive number are considered true.
 *                      Other values (e.g., false, 'false', 0, null) are considered false.
 * @return {boolean} Returns the boolean equivalent of the input value.
 */
export function toBoolean(value: any): boolean {
  if (typeof value === 'boolean') {
    return value;
  } else if (typeof value === 'string') {
    const str = value.trim().toLowerCase();
    return str === 'true' || str === 'yes' || str === '1';
  } else if (typeof value === 'number') {
    return value > 0;
  } else {
    return false;
  }
}
