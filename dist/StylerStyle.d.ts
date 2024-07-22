import { AttrValue, Style, StyleAttrs, StylerStyleIF } from './types';
import { LightDark } from './gates';

/**
 * this is a single directive: for any style containing these attributes with the same keys and values
 * (but NOT necessarily vice versa) apply all of these styles.
 */
export declare class StylerStyle implements StylerStyleIF {
    style: Style;
    attrs: StyleAttrs;
    constructor(style: Style, attrs: StyleAttrs);
    /**
     *
     * returns true if every key in the input is contained by this definitions' attrs.
     * that is - there is no attribute in the input that is not an attribute of this.attrs.
     * it _DOES NOT EXAMINE THE VALUES_ of the attrs, just the keys.
     *
     * i.e., -- the argument has no keys that aren't in this.attrs.
     * this however MAY have keys that are not in the argument.
     *
     * @param attrs {StyleAttrs}
     * @returns {boolean}
     */
    haveAllKeysOf(attrs: StyleAttrs): boolean;
    get attrCount(): number;
    isLessSpecific(attrs: StyleAttrs): boolean;
    isLessSpecificMatch(attrs: StyleAttrs): boolean;
    /**
     * how tightly specified this style is;
     * the more keys, the higher the score.
     */
    get specificity(): number;
    /**
     * this is the inverse of `noExtraProps`; it ensures that
     * this.attrs keys are all in attrs. But attrs may be more specific than.
     *
     * @param attrs {StyleAttrs}
     * @returns
     */
    keysPresentIn(attrs: StyleAttrs): boolean;
    /**
     * returns true if the attrs parameter is equal to the attrs of this style exactly
     * -- same keys and values.
     * -- no extra keys in this.attrs or attrs.
     * this is a VERY STRICT test - the values must be in the same format (number, string)
     * and equal to each other.
     *
     * @param attrs {StyleAttrs}
     * @returns
     */
    matches(attrs: StyleAttrs): boolean;
    toJSON(): {
        style: Record<string, string | LightDark>;
        attrs: Record<string, AttrValue>;
    };
    toString(): string;
    equals(ss: StylerStyleIF): boolean;
}
