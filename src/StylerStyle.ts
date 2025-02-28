import { AttrValue, Style, StyleAttrs, StylerStyleIF } from "./types";
import { LightDark } from "./gates";

const scoreValue: Map<string, number> = new Map([
  ["appearance", 8],
  ["variant", 4],
]);

function keyCount(a: Record<string, unknown>) {
  return Array.from(Object.keys(a)).length;
}

/**
 * this is a single directive: for any style containing these attributes with the same keys and values
 * (but NOT necessarily vice versa) apply all of these styles.
 */
export class StylerStyle implements StylerStyleIF {
  constructor(public style: Style, public attrs: StyleAttrs) {}

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
  haveAllKeysOf(attrs: StyleAttrs): boolean {
    return Array.from(Object.keys(attrs)).every((key) => key in this.attrs);
  }

  get attrCount() {
    return keyCount(this.attrs);
  }

  isLessSpecific(attrs: StyleAttrs): boolean {
    return this.keysPresentIn(attrs) && this.attrCount < keyCount(attrs);
  }

  isLessSpecificMatch(attrs: StyleAttrs) {
    return (
      this.isLessSpecific(attrs) &&
      Object.keys(this.attrs).every((key) => this.attrs[key] === attrs[key])
    );
  }

  /**
   * how tightly specified this style is;
   * the more keys, the higher the score.
   */
  get specificity() {
    let score = 0;
    for (const attr of Object.keys(this.attrs)) {
      if (scoreValue.has(attr)) score += scoreValue.get(attr)!;
      else score += 1;
    }
    return score;
  }

  /**
   * this is the inverse of `noExtraProps`; it ensures that
   * this.attrs keys are all in attrs. But attrs may be more specific than.
   *
   * @param attrs {StyleAttrs}
   * @returns
   */
  keysPresentIn(attrs: StyleAttrs) {
    for (const key of Object.keys(this.attrs)) {
      if (!(key in attrs)) return false;
    }
    return true;
  }

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
  matches(attrs: StyleAttrs) {
    return (
      this.haveAllKeysOf(attrs) &&
      this.keysPresentIn(attrs) &&
      Array.from(Object.keys(this.attrs)).every(
        (k) => this.attrs[k] === attrs[k]
      )
    );
  }
  toJSON() {
    const out: {
      style: Record<string, string | LightDark>;
      attrs: Record<string, AttrValue>;
    } = { style: {}, attrs: {} };
    Array.from(Object.keys(this.style))
      .sort()
      .forEach((k) => {
        out.style[k] = this.style[k] as string | LightDark;
      });
    Array.from(Object.keys(this.attrs))
      .sort()
      .forEach((k) => {
        out.attrs[k] = this.attrs[k] as AttrValue;
      });
    return out;
  }
  toString() {
    return JSON.stringify(this.toJSON(), true, 1);
  }

  equals(ss: StylerStyleIF) {
    return ss.toString() === this.toString();
  }
}
