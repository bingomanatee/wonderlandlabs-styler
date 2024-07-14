import {isFlatObj, isObj} from "./gates.ts";
import {zipObject} from 'lodash-es';
import {Nested, Style, StyleAttrs, StylerIF, StylerStyleIF} from "../types.ts";

function leastSpecific(s1: StylerStyleIF, s2: StylerStyleIF) {
  if (s1.specificity < s2.specificity) return s1;
  return s2;
}

function leastSpecificOf(list: StylerStyleIF[]) {
  return list.reduce((best: null | StylerStyleIF, next) => {
      if (!best) return next;
      return leastSpecific(best, next);
    }, null
  )
}

const scoreValue: Map<string, number> = new Map([
  ['appearance', 8],
  ['variant', 4],
])

class StylerStyle implements StylerStyleIF {
  constructor(public style: Style, public attrs: StyleAttrs) {
  }

  noExtraProps(attrs) {
    return Array.from(Object.keys(attrs)).every((key) => key in this.attrs);
  }

  isLessSpecificMatch(attrs: StyleAttrs): boolean {
    return this.includes(attrs) && !this.matches(attrs);
  }

  similarity(attrs: StyleAttrs) {
    let match = 0;
    for (const attr of Object.keys(attrs)) {
      if (this.attrs[attr] === attr[(attr as string)]) {
        if (scoreValue.has(attr)) match += scoreValue.get(attr)!;
        else match += 1;
      }
    }
    return match;
  }

  /**
   * how tightly specified this style is
   */
  get specificity() {
    let score = 0;
    for (const attr of Object.keys(this.attrs)) {
      if (scoreValue.has(attr)) score += scoreValue.get(attr)!;
      else score += 1;
    }
    return score;
  }

  includes(attrs: StyleAttrs) {
    return   Array.from(Object.keys(this.attrs)).every((key) => (!key in attrs) || this.attrs[key] === attrs[key]);
  }

  matches(attrs: StyleAttrs) {
    return this.noExtraProps(attrs) &&  Array.from(Object.keys(this.attrs)).every((key) => this.attrs[key] === attrs[key]);
  }

}

export class Styler implements StylerIF{

  public targetStyles: Map<string, StylerStyle[]> = new Map();

  public static Singleton: Styler = new Styler();

  add(target: string, style: Style, attrs: StyleAttrs) {
    if (!this.targetStyles.has(target)) {
      this.targetStyles.set(target, [new StylerStyle(style, attrs)]);
    } else {
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

  private matches(target, attrs) {
    const candidates = this.targetStyles.get(target) || [];

    return candidates.filter((candidate) => candidate.noExtraProps(attrs));
  }

  /**
   * find a style that matches the attributes
   * @param target
   * @param attrs
   */
  baseStyle(target: string, attrs?: StyleAttrs) {
    if (!this.targetStyles.has(target)) return {};

    // if there are one or more styles that perfectly match the attrs,
    // return the _lease specific_ one - i.e., the one with the fewest extra attrs.
    const perfectMatches = attrs ? this.perfectMatches(target, attrs) : this.targetStyles.get(target)!;

    if (perfectMatches.length) {
      return leastSpecificOf(perfectMatches)!.style;
    } else {
      const mostSimilar = this.matches(target, attrs)!.reduce((best: StylerStyleIF[], next: StylerStyleIF) => {
        if (!best.length) {
          return [next];
        }

        const similarity = next.similarity(attrs);

        if (best.every((bestStyle) => bestStyle.similarity(attrs) < similarity)) {
          return [next];
        }
        if (best.every((bestStyle: StylerStyleIF) => bestStyle.similarity(attrs) === similarity)) {
          return [...best, next];
        }
        return best;
      }, []);

      if (mostSimilar.length === 1) return mostSimilar[0].style;
      if (mostSimilar.length === 0) return {};
      // if there are more than one styles that are equally similar to the attributes return the one with the least number of attributes;
      return leastSpecificOf(mostSimilar)!.style;
    }
  }

  lessSpecificStyles (target, attrs) {
    if (!this.targetStyles.has(target)) return [];
    return this.targetStyles.get(target).filter((stylerStyle: StylerStyleIF) => {
     return  stylerStyle.isLessSpecificMatch(attrs) && !stylerStyle.matches(attrs)
    }).sort((a, b) => {
      return b.specificity - a.specificity;
    });
  }

  for(target, attrs) {
    const baseStyle = this.baseStyle(target, attrs);
    const lesserStyles = this.lessSpecificStyles(target, attrs).map((s) => s.style);
    return[...lesserStyles, baseStyle].reduce((out, style) => {
      // would use StyleSheet.combine
      return {...out, ...style};
    }, {});
  }

  public many(data: Nested, attrNames: string[], history = []) {
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
          this.many(value, attrNames, [...history, key])
        }
      }
    }
  }
}