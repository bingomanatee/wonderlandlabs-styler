export function isObj(a): a is object {
  return a && typeof a === 'object';
}

/**
 *  is a "flat object" - every value is a scalar
 *
 * @param a
 */
function isStyle(a: unknown): a is Style {
  if (!isObj(a)) return false;

  return Array.from(Object.keys(a)).every((key: string) => (
    (typeof a[key] === 'string') || (typeof a[key] === 'number')
  ))
}

export const isFlatObj = isStyle;