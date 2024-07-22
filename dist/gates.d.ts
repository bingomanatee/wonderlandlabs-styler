import { Style } from './types';

export declare function isObj(a: unknown): a is object;
type Light = {
    light: string;
};
type Dark = {
    dark: string;
};
export type LightDark = Light | Dark | Light & Dark;
/**
 *  is a "flat object" - every value is a scalar
 *
 */
declare function isStyle(aa: unknown): aa is Style;
export declare const isFlatObj: typeof isStyle;
export {};
