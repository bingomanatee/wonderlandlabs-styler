export interface StylerStyleIF {
  similarity(attrs: StyleAttrs): number;
  matches(attrs: StyleAttrs): boolean;
  specificity: number;
  attrs: StyleAttrs,
  style: Style
}

export interface StylerIF {
  targetStyles: Map<string, StylerStyleIF[]>;
  for(target: string, attrs: StyleAttrs): Style;
}

export type Style = Record<string, unknown>;
export type StyleAttrs = {
  variant?: string,
  appearance?: 'light' | 'darn',
  target?: string
} & Record<string, string>;
export type Nested = Record<string, number | string | Nested>;