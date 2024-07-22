var T = Object.defineProperty;
var w = (e, t, r) => t in e ? T(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var l = (e, t, r) => w(e, typeof t != "symbol" ? t + "" : t, r);
function g(e) {
  return !!(e && typeof e == "object");
}
function m(e) {
  if (!g(e)) return !1;
  const t = e;
  return !!("light" in t && t.light || "dark" in t && t.dark);
}
function $(e) {
  if (!g(e)) return !1;
  const t = e;
  return Array.from(Object.keys(t)).every((r) => typeof t[r] == "string" || typeof t[r] == "number" || m(t[r]));
}
const k = $;
var A = typeof global == "object" && global && global.Object === Object && global, M = typeof self == "object" && self && self.Object === Object && self, j = A || M || Function("return this")(), a = j.Symbol, v = Object.prototype, _ = v.hasOwnProperty, F = v.toString, c = a ? a.toStringTag : void 0;
function L(e) {
  var t = _.call(e, c), r = e[c];
  try {
    e[c] = void 0;
    var n = !0;
  } catch {
  }
  var s = F.call(e);
  return n && (t ? e[c] = r : delete e[c]), s;
}
var x = Object.prototype, I = x.toString;
function C(e) {
  return I.call(e);
}
var E = "[object Null]", V = "[object Undefined]", h = a ? a.toStringTag : void 0;
function J(e) {
  return e == null ? e === void 0 ? V : E : h && h in Object(e) ? L(e) : C(e);
}
function P(e) {
  var t = typeof e;
  return e != null && (t == "object" || t == "function");
}
var R = "[object AsyncFunction]", G = "[object Function]", K = "[object GeneratorFunction]", q = "[object Proxy]";
function D(e) {
  if (!P(e))
    return !1;
  var t = J(e);
  return t == G || t == K || t == R || t == q;
}
var y = j["__core-js_shared__"], p = function() {
  var e = /[^.]+$/.exec(y && y.keys && y.keys.IE_PROTO || "");
  return e ? "Symbol(src)_1." + e : "";
}();
function z(e) {
  return !!p && p in e;
}
var H = Function.prototype, N = H.toString;
function U(e) {
  if (e != null) {
    try {
      return N.call(e);
    } catch {
    }
    try {
      return e + "";
    } catch {
    }
  }
  return "";
}
var Z = /[\\^$.*+?()[\]{}|]/g, B = /^\[object .+?Constructor\]$/, Q = Function.prototype, W = Object.prototype, X = Q.toString, Y = W.hasOwnProperty, tt = RegExp(
  "^" + X.call(Y).replace(Z, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function et(e) {
  if (!P(e) || z(e))
    return !1;
  var t = D(e) ? tt : B;
  return t.test(U(e));
}
function rt(e, t) {
  return e == null ? void 0 : e[t];
}
function nt(e, t) {
  var r = rt(e, t);
  return et(r) ? r : void 0;
}
var b = function() {
  try {
    var e = nt(Object, "defineProperty");
    return e({}, "", {}), e;
  } catch {
  }
}();
function st(e, t, r) {
  t == "__proto__" && b ? b(e, t, {
    configurable: !0,
    enumerable: !0,
    value: r,
    writable: !0
  }) : e[t] = r;
}
function it(e, t) {
  return e === t || e !== e && t !== t;
}
var ot = Object.prototype, ct = ot.hasOwnProperty;
function at(e, t, r) {
  var n = e[t];
  (!(ct.call(e, t) && it(n, r)) || r === void 0 && !(t in e)) && st(e, t, r);
}
function ft(e, t, r) {
  for (var n = -1, s = e.length, i = t.length, o = {}; ++n < s; ) {
    var u = n < i ? t[n] : void 0;
    r(o, e[n], u);
  }
  return o;
}
function ut(e, t) {
  return ft(e || [], t || [], at);
}
const S = /* @__PURE__ */ new Map([
  ["appearance", 8],
  ["variant", 4]
]);
function d(e) {
  return Array.from(Object.keys(e)).length;
}
class lt {
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
  haveAllKeysOf(t) {
    return Array.from(Object.keys(t)).every((r) => r in this.attrs);
  }
  get attrCount() {
    return d(this.attrs);
  }
  isLessSpecific(t) {
    return this.keysPresentIn(t) && this.attrCount < d(t);
  }
  isLessSpecificMatch(t) {
    return this.isLessSpecific(t) && Object.keys(this.attrs).every((r) => this.attrs[r] === t[r]);
  }
  /**
   * how tightly specified this style is;
   * the more keys, the higher the score.
   */
  get specificity() {
    let t = 0;
    for (const r of Object.keys(this.attrs))
      S.has(r) ? t += S.get(r) : t += 1;
    return t;
  }
  /**
   * this is the inverse of `noExtraProps`; it ensures that
   * this.attrs keys are all in attrs. But attrs may be more specific than.
   *
   * @param attrs {StyleAttrs}
   * @returns
   */
  keysPresentIn(t) {
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
    return this.haveAllKeysOf(t) && this.keysPresentIn(t) && Array.from(Object.keys(this.attrs)).every(
      (r) => this.attrs[r] === t[r]
    );
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
const f = class f {
  constructor() {
    l(this, "targetStyles", /* @__PURE__ */ new Map());
  }
  add(t, r, n) {
    const s = new lt(r, n);
    this.targetStyles.has(t) ? (this.targetStyles.get(t).some((i) => i.matches(n)) && console.warn(
      "added multiple definitions for target",
      t,
      "attrs",
      n
    ), this.targetStyles.get(t).push(s)) : this.targetStyles.set(t, [s]);
  }
  perfectMatches(t, r) {
    if (!this.targetStyles.has(t)) return [];
    const n = [];
    for (const s of this.targetStyles.get(t))
      s.matches(r) && n.push(s);
    return n;
  }
  lessSpecificStyles(t, r) {
    return this.targetStyles.has(t) ? this.targetStyles.get(t).filter((n) => (console.log(
      r,
      "lses specific",
      n.toString(),
      n.isLessSpecificMatch(r)
    ), n.isLessSpecificMatch(r))).sort((n, s) => s.specificity - n.specificity) : [];
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
    if (!(t && r)) throw new Error("must have target and attrs");
    const [n] = this.perfectMatches(t, r);
    return [...this.lessSpecificStyles(t, r).map(
      (i) => i.style
    ), (n == null ? void 0 : n.style) || {}].reduce((i, o) => ({ ...i, ...o }), {});
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
    if (r.includes("target") || (r = [...r, "target"]), k(t)) {
      const s = Math.min(r.length, n.length), i = ut(
        r.slice(0, s),
        n.slice(0, s)
      );
      if (!("target" in i))
        return;
      const { target: o, ...u } = i;
      this.add(o, t, u);
    } else
      for (const s of Object.keys(t)) {
        const i = t[s];
        g(i) && n.length < r.length && this.addMany(i, r, [...n, s]);
      }
  }
};
l(f, "Singleton", new f());
let O = f;
export {
  O as Styler,
  lt as StylerStyle,
  O as default
};
