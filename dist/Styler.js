var P = Object.defineProperty;
var $ = (e, t, r) => t in e ? P(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var u = (e, t, r) => $(e, typeof t != "symbol" ? t + "" : t, r);
function h(e) {
  return !!(e && typeof e == "object");
}
function w(e) {
  if (!h(e)) return !1;
  const t = e;
  return !!("light" in t && t.light || "dark" in t && t.dark);
}
function _(e) {
  if (!h(e)) return !1;
  const t = e;
  return Array.from(Object.keys(t)).every((r) => typeof t[r] == "string" || typeof t[r] == "number" || w(t[r]));
}
const M = _;
var x = typeof global == "object" && global && global.Object === Object && global, A = typeof self == "object" && self && self.Object === Object && self, O = x || A || Function("return this")(), a = O.Symbol, v = Object.prototype, k = v.hasOwnProperty, E = v.toString, c = a ? a.toStringTag : void 0;
function F(e) {
  var t = k.call(e, c), r = e[c];
  try {
    e[c] = void 0;
    var n = !0;
  } catch {
  }
  var s = E.call(e);
  return n && (t ? e[c] = r : delete e[c]), s;
}
var L = Object.prototype, C = L.toString;
function K(e) {
  return C.call(e);
}
var V = "[object Null]", I = "[object Undefined]", b = a ? a.toStringTag : void 0;
function J(e) {
  return e == null ? e === void 0 ? I : V : b && b in Object(e) ? F(e) : K(e);
}
function T(e) {
  var t = typeof e;
  return e != null && (t == "object" || t == "function");
}
var R = "[object AsyncFunction]", z = "[object Function]", G = "[object GeneratorFunction]", q = "[object Proxy]";
function D(e) {
  if (!T(e))
    return !1;
  var t = J(e);
  return t == z || t == G || t == R || t == q;
}
var y = O["__core-js_shared__"], p = function() {
  var e = /[^.]+$/.exec(y && y.keys && y.keys.IE_PROTO || "");
  return e ? "Symbol(src)_1." + e : "";
}();
function H(e) {
  return !!p && p in e;
}
var N = Function.prototype, U = N.toString;
function Z(e) {
  if (e != null) {
    try {
      return U.call(e);
    } catch {
    }
    try {
      return e + "";
    } catch {
    }
  }
  return "";
}
var B = /[\\^$.*+?()[\]{}|]/g, Q = /^\[object .+?Constructor\]$/, W = Function.prototype, X = Object.prototype, Y = W.toString, tt = X.hasOwnProperty, et = RegExp(
  "^" + Y.call(tt).replace(B, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function rt(e) {
  if (!T(e) || H(e))
    return !1;
  var t = D(e) ? et : Q;
  return t.test(Z(e));
}
function nt(e, t) {
  return e == null ? void 0 : e[t];
}
function st(e, t) {
  var r = nt(e, t);
  return rt(r) ? r : void 0;
}
var S = function() {
  try {
    var e = st(Object, "defineProperty");
    return e({}, "", {}), e;
  } catch {
  }
}();
function it(e, t, r) {
  t == "__proto__" && S ? S(e, t, {
    configurable: !0,
    enumerable: !0,
    value: r,
    writable: !0
  }) : e[t] = r;
}
function ot(e, t) {
  return e === t || e !== e && t !== t;
}
var ct = Object.prototype, at = ct.hasOwnProperty;
function lt(e, t, r) {
  var n = e[t];
  (!(at.call(e, t) && ot(n, r)) || r === void 0 && !(t in e)) && it(e, t, r);
}
function ft(e, t, r) {
  for (var n = -1, s = e.length, i = t.length, o = {}; ++n < s; ) {
    var f = n < i ? t[n] : void 0;
    r(o, e[n], f);
  }
  return o;
}
function ut(e, t) {
  return ft(e || [], t || [], lt);
}
const d = /* @__PURE__ */ new Map([
  ["appearance", 8],
  ["variant", 4]
]);
function j(e) {
  return Array.from(Object.keys(e)).length;
}
class m {
  constructor(t, r) {
    this.style = t, this.attrs = r;
  }
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
  noExtraKeys(t) {
    return Array.from(Object.keys(t)).every((r) => r in this.attrs);
  }
  get attrCount() {
    return j(this.attrs);
  }
  isLessSpecific(t) {
    return this.noExtraKeys(t) && this.attrCount > j(t);
  }
  isLessSpecificMatch(t) {
    return this.isLessSpecific(t) && Object.keys(t).every((r) => this.attrs[r] === t[r]);
  }
  /**
   * how tightly specified this style is;
   * the more keys, the higher the score.
   */
  get specificity() {
    let t = 0;
    for (const r of Object.keys(this.attrs))
      d.has(r) ? t += d.get(r) : t += 1;
    return t;
  }
  /**
   * this is the inverse of `noExtraProps`; it ensures that
   * this.attrs keys are all in attrs. But attrs may be more specific than.
   *
   * @param attrs {StyleAttrs}
   * @returns
   */
  includesKeys(t) {
    for (const r of Object.keys(this.attrs))
      if (!(r in t)) return !1;
    return !0;
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
  matches(t) {
    return this.noExtraKeys(t) && this.includesKeys(t) && Array.from(Object.keys(this.attrs)).every((r) => this.attrs[r] === t[r]);
  }
  toJSON() {
    const t = { style: {}, attrs: {} };
    return Array.from(Object.keys(this.style)).sort().forEach((r) => {
      t.style[r] = this.style[r];
    }), Array.from(Object.keys(this.attrs)).sort().forEach((r) => {
      t.attrs[r] = this.attrs[r];
    }), t;
  }
  toString() {
    return JSON.stringify(this.toJSON());
  }
  equals(t) {
    return t.toString() === this.toString();
  }
}
const gt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  StylerStyle: m
}, Symbol.toStringTag, { value: "Module" })), l = class l {
  constructor() {
    u(this, "targetStyles", /* @__PURE__ */ new Map());
  }
  add(t, r, n) {
    const s = new m(r, n);
    this.targetStyles.has(t) ? (this.targetStyles.get(t).some((i) => i.matches(n)) && console.warn("added multiple definitions for target", t, "attrs", n), this.targetStyles.get(t).push(s)) : this.targetStyles.set(t, [s]);
  }
  perfectMatches(t, r) {
    if (!this.targetStyles.has(t)) return [];
    const n = [];
    for (const s of this.targetStyles.get(t))
      s.matches(r) && n.push(s);
    return n;
  }
  lessSpecificStyles(t, r) {
    return this.targetStyles.has(t) ? this.targetStyles.get(t).filter((n) => n.isLessSpecificMatch(r)).sort((n, s) => s.specificity - n.specificity) : [];
  }
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
  for(t, r) {
    const [n] = this.perfectMatches(t, r);
    return [...this.lessSpecificStyles(t, r).map((i) => i.style), n || {}].reduce((i, o) => ({ ...i, ...o }), {});
  }
  /**
   * add a cluster of style definitions in an arbitrary JSON tree of definitions.
   * All properties at the same depth are defined by the attrNames array.
   *
   * @param data {Nested}
   * @param attrNames {String[]}
   * @param history {String[]}
   */
  addMany(t, r, n = []) {
    if (r.includes("target") || (r = [...r, "target"]), M(t)) {
      const s = Math.min(r.length, n.length), i = ut(r.slice(0, s), n.slice(0, s));
      if (!("target" in i))
        return;
      const { target: o, ...f } = i;
      this.add(o, t, f);
    } else
      for (const s of Object.keys(t)) {
        const i = t[s];
        h(i) && n.length < r.length && this.addMany(i, r, [...n, s]);
      }
  }
};
u(l, "Singleton", new l());
let g = l;
const ht = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Styler: g
}, Symbol.toStringTag, { value: "Module" }));
export {
  ht as Styler,
  gt as StylerStyle
};
