import {Style} from "./types";

export function isObj(a: unknown): a is object {
  return !!(a && typeof a === 'object');
}

type Light = { light: string };
type Dark = { dark: string };
export type LightDark = Light | Dark | Light & Dark;

function isLightDark(aa: unknown): aa is LightDark {
  if (!isObj(aa)) return false;
  const a = aa as object;
  return !!(
     ('light' in a && a.light)
    || ('dark' in a && a.dark)
  );
}

/**
 *  is a "flat object" - every value is a scalar
 *
 */
function isStyle(aa: unknown): aa is Style {
  if (!isObj(aa)) return false;

  const a = aa as Record<string, unknown>

  return Array.from(Object.keys(a)).every((key: string) => (
    (typeof a[key] === 'string') || (typeof a[key] === 'number') || isLightDark(a[key])
  ))
}

export const isFlatObj = isStyle;