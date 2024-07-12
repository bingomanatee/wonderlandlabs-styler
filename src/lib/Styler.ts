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

  matches(attrs: StyleAttrs) {
    return Array.from(Object.keys(attrs)).every((key) => this.attrs[key] === attrs[key]);
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

  inclusiveMatches(target: string, attrs: StyleAttrs) {
    if (!this.targetStyles.has(target)) return [];
    const matches = [];
    for (const style of this.targetStyles.get(target)!) {
      if (style.matches(attrs)) matches.push(style);
    }
    return matches;
  }

  /**
   * find a style that matches the attributes
   * @param target
   * @param attrs
   */
  for(target: string, attrs?: StyleAttrs) {
    console.log('______________ for', target, 'matching', attrs, '_______________');
    if (!this.targetStyles.has(target)) return {};

    // if there are one or more styles that perfectly match the attrs,
    // return the _lease specific_ one - i.e., the one with the fewest extra attrs.
    const perfectMatches = attrs ? this.inclusiveMatches(target, attrs) : this.targetStyles.get(target)!;

    if (perfectMatches.length) {
      console.log('...perfect matches for ', target, 'are', perfectMatches);
      return leastSpecificOf(perfectMatches)!.style;
    } else {
      const mostSimilar = this.targetStyles.get(target)!.reduce((best: StylerStyleIF[], next: StylerStyleIF) => {
        if (!best.length) {
          return [next];
        }

        console.log('similarity of', best, 'are', best.map((b) => b.similarity(attrs)));
        const similarity = next.similarity(attrs);
        console.log('next',next, 'similarity', next.similarity(attrs));

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

  public many(data: Nested, attrNames: string[], history = []) {
    console.log('....many ', data, attrNames, history);
    // if target is not explicit assume it is the last attribute.
    if (!attrNames.includes('target')) {
      attrNames = [...attrNames, 'target'];
    }

    if (isFlatObj(data)) {
      console.log('...many: flat data');
      const minLength = Math.min(attrNames.length, history.length);
      const targetAndAttrs = zipObject(attrNames.slice(0, minLength), history.slice(0, minLength))
      if (!('target' in targetAndAttrs)) {
        return;
      }
      const {target, ...attrs} = targetAndAttrs;
      this.add(target, data, attrs);
    } else {
      console.log('data is not flat', data);
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