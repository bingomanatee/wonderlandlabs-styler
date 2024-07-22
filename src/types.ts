export interface StylerStyleIF {
  attrs: StyleAttrs;
  keysPresentIn(attrs: StyleAttrs): boolean;
  isLessSpecific(attrs: StyleAttrs): boolean;
  isLessSpecificMatch(attrs: StyleAttrs): boolean;
  matches(attrs: StyleAttrs): boolean;
  haveAllKeysOf(attrs: StyleAttrs): boolean;
  specificity: number;
  style: Style;
  toString(): string;
  equals(ss: StylerStyleIF): boolean;
}

export interface StylerIF {
  addMany(data: Nested, attrNames: string[], history?: string[]): void;
  targetStyles: Map<string, StylerStyleIF[]>;
  for(target: string, attrs: StyleAttrs): Style;
}

export type AttrValue = string | boolean | number;
export type Style = Record<string, unknown>;
export type StyleAttrs = {
  variant?: string;
  appearance?: "light" | "dark";
  target?: string;
} & Record<string, AttrValue>;
// @ts-ignore
export type Nested = Record<string, number | string | Nested>;
