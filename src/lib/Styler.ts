import {isFlatObj, isObj} from "./gates.ts";
import {zipObject} from 'lodash-es';
import {Nested, Style, StyleAttrs, StylerIF, StylerStyleIF} from "../types.ts";
import {StylerStyle} from "./StylerStyle.ts";

/**
 * a "style manager"
 */
export class Styler implements StylerIF {

  public targetStyles: Map<string, StylerStyle[]> = new Map();

  public static Singleton: Styler = new Styler();

  add(target: string, style: Style, attrs: StyleAttrs) {
    if (!this.targetStyles.has(target)) {
      this.targetStyles.set(target, [new StylerStyle(style, attrs)]);
    } else {
      if (this.targetStyles.get(target)!.some((ss) => {
       return ss.matches(attrs)
      })) {
        console.warn('added multiple definitions for target', target, 'attrs', attrs)
      }
      this.targetStyles.get(target)!.push(new StylerStyle(style, attrs));
    }
  }

  perfectMatches(target: string, attrs: StyleAttrs) {
    if (!this.targetStyles.has(target)) return [];
    const matches = [];
    for (const style of this.targetStyles.get(target)!) {
      if (style.matches(attrs)) matches.push(style);
    }
    return matches;
  }

  lessSpecificStyles(target: string, attrs: StyleAttrs) {
    if (!this.targetStyles.has(target)) return [];
    return this.targetStyles.get(target)!
      .filter((stylerStyle: StylerStyleIF) => stylerStyle.isLessSpecific(attrs))
      .sort((a, b) => b.specificity - a.specificity);
  }

  /**
   * compresses all styles that are not more specific than the attrs into a single style.
   *  -- enforces any perfect match as the domainant style.
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
  for(target: string, attrs: StyleAttrs) {
    const [perfectMatch] = this.perfectMatches(target, attrs);
    const lesserStyles = this.lessSpecificStyles(target, attrs).map((s) => s.style);
    return [...lesserStyles, (perfectMatch || {})].reduce((out, style) => {
      // would use StyleSheet.combine
      return {...out, ...style};
    }, {}) as Style;
  }

  /**
   * add a cluster of style definitions in an arbitrary JSON tree of definitions.
   * All properties at the same depth are defined by the attrNames array.
   *
   * @param data {Nested}
   * @param attrNames {String[]}
   * @param history {String[]}
   */
  public addMany(data: Nested, attrNames: string[], history = []) {
    // if target is not explicit assume it is the last attribute.
    if (!attrNames.includes('target')) {
      attrNames = [...attrNames, 'target'];
    }

    if (isFlatObj(data)) {
      const minLength = Math.min(attrNames.length, history.length);
      const targetAndAttrs = zipObject(attrNames.slice(0, minLength), history.slice(0, minLength))
      if (!('target' in targetAndAttrs)) {
        return;
      }
      const {target, ...attrs} = targetAndAttrs;
      this.add(target, data, attrs);
    } else {
      for (const key of Object.keys(data)) {
        const value = data[key];
        if (!isObj(value)) continue;

        if (history.length < attrNames.length) {
          this.addMany(value, attrNames, [...history, key])
        }
      }
    }
  }
}