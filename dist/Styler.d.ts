import { Nested, Style, StyleAttrs, StylerIF } from './types';
import { StylerStyle } from './StylerStyle';

/**
 * a "style manager"
 */
export declare class Styler implements StylerIF {
    targetStyles: Map<string, StylerStyle[]>;
    static Singleton: Styler;
    add(target: string, style: Style, attrs: StyleAttrs): void;
    perfectMatches(target: string, attrs: StyleAttrs): StylerStyle[];
    lessSpecificStyles(target: string, attrs: StyleAttrs): StylerStyle[];
    /**
     * compresses all styles that are not more specific than the attrs into a single style.
     *  -- enforces any perfect match as the dominant style.
     *  -- supplies defaults from any less specific styles as supplemental definitions,
     *     in order of specificity.
     *
     * there are two "known edge cases" that need to be resolved manually:
     *
     * 1. redundant "perfect match" definitions.
     * 2. conflicting "equally non-specific" attrs;
     *    -- e.g., a button style with {depressed: true}
     *       and one with {disabled: true} with different styles.
     *
     * the fix for case two is to ensure all less specific style definitions have the sane properties.
     * as in, define  attrs {disabled: true, depressed: false} and {disabled: false, despresed: true},
     * not attrs {disabled: false} and {depressed: true}
     *
     * @param target
     * @param attrs
     */
    for(target: string, attrs: StyleAttrs): Style;
    /**
     * add a cluster of style definitions in an arbitrary JSON tree of definitions.
     * All properties at the same depth are defined by the attrNames array.
     *
     * @param data {Nested}
     * @param attrNames {String[]}
     * @param history {String[]}
     */
    addMany(data: Nested, attrNames: string[], history?: never[]): void;
}
