export interface StylerStyleIF {
  attrs: StyleAttrs;
  includesKeys(attrs: StyleAttrs) : boolean;
  isLessSpecific(attrs: StyleAttrs): boolean;
  isLessSpecificMatch(attrs: StyleAttrs): boolean;
  matches(attrs: StyleAttrs): boolean;
  noExtraKeys(attrs: StyleAttrs): boolean,
  specificity: number;
  style: Style;
  toString(): string;
  equals(ss: StylerStyleIF) : boolean;
}

export interface StylerIF {
  addMany(data: Nested, attrNames: string[], history?: string[]) : void;
  targetStyles: Map<string, StylerStyleIF[]>;
  for(target: string, attrs: StyleAttrs): Style;
}

export type Style = Record<string, unknown>;
export type StyleAttrs = {
  variant?: string,
  appearance?: 'light' | 'darn',
  target?: string
} & Record<string, string | number>;
export type Nested = Record<string, number | string | Nested>;