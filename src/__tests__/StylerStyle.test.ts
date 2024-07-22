import { describe, it, expect } from "vitest";
import { StylerStyle } from "../StylerStyle";
import { StyleAttrs } from "../types";

const ATTRS: StyleAttrs = {
  variant: "primary",
  appearance: "light",
  disabled: "true",
};
const STYLE = {
  fontWeight: "bold",
  fontFamily: "Roboto",
};

describe("StylerStyle", () => {
  describe("(constructor)", () => {
    const ss = new StylerStyle(STYLE, ATTRS);
    it("should include the arguments", () => {
      expect(ss.style).toEqual(STYLE);
      expect(ss.attrs).toEqual(ATTRS);
    });
  });

  describe("attrCount", () => {
    const ss = new StylerStyle(STYLE, ATTRS);
    it("should count attributes correctly", () => {
      expect(ss.attrCount).toBe(3);
    });
  });
  describe("noExtraKeys", () => {
    const ss = new StylerStyle(STYLE, ATTRS);
    it("should be true for exact match", () => {
      expect(ss.haveAllKeysOf(ATTRS)).toBeTruthy();
    });

    it("should be true for same keys, different props", () => {
      expect(
        ss.haveAllKeysOf({
          variant: "secondary",
          disabled: false,
          appearance: "light",
        })
      ).toBeTruthy();
    });

    it("should be false for same keys, extra keys", () => {
      expect(
        ss.haveAllKeysOf({
          variant: "secondary",
          disabled: false,
          size: "large",
          appearance: "light",
        })
      ).toBeFalsy();
    });
    it("should be true for fewer keys", () => {
      expect(ss.haveAllKeysOf({ variant: "secondary" })).toBeTruthy();
    });
  });
  describe("includesKeys", () => {
    const ss = new StylerStyle(STYLE, ATTRS);
    it("should be true for exact match", () => {
      expect(ss.keysPresentIn(ATTRS)).toBeTruthy();
    });

    it("should be true for same keys, different props", () => {
      expect(
        ss.keysPresentIn({
          variant: "secondary",
          disabled: false,
          appearance: "light",
        })
      ).toBeTruthy();
    });

    it("should be true for same keys, extra keys", () => {
      expect(
        ss.keysPresentIn({
          variant: "secondary",
          disabled: false,
          size: "large",
          appearance: "light",
        })
      ).toBeTruthy();
    });
    it("should be false for fewer keys", () => {
      expect(ss.keysPresentIn({ variant: "secondary" })).toBeFalsy();
    });
  });
  describe("isLessSpecific", () => {
    const ss = new StylerStyle(STYLE, ATTRS);
    it("should be false for exact match", () => {
      expect(ss.isLessSpecific(ATTRS)).toBeFalsy();
    });

    it("should be false for same keys, different props", () => {
      expect(
        ss.isLessSpecific({
          variant: "secondary",
          disabled: false,
          appearance: "light",
        })
      ).toBeFalsy();
    });

    it("should be true for same keys, extra keys", () => {
      expect(
        ss.isLessSpecific({
          variant: "secondary",
          disabled: false,
          size: "large",
          appearance: "light",
        })
      ).toBeTruthy();
    });
    it("should be false for fewer keys", () => {
      expect(ss.isLessSpecific({ variant: "secondary" })).toBeFalsy();
    });
  });
  describe("isLessSpecificMatch", () => {
    const ss = new StylerStyle(STYLE, ATTRS);
    it("should be false for exact match", () => {
      expect(ss.isLessSpecificMatch(ATTRS)).toBeFalsy();
    });

    it("should be false for same keys, different props", () => {
      expect(
        ss.isLessSpecificMatch({
          variant: "secondary",
          disabled: false,
          appearance: "light",
        })
      ).toBeFalsy();
    });

    it("should be true for same keys, extra keys", () => {
      expect(
        ss.isLessSpecificMatch({
          ...ATTRS,
          size: "large",
        })
      ).toBeTruthy();
    });
    it("should be true for fewer keys", () => {
      const { appearance, ...sub } = ATTRS;
      expect(ss.isLessSpecificMatch(sub)).toBeFalsy();
      expect(appearance).toBeTruthy();
    });
  });
  describe("matches", () => {
    const ss = new StylerStyle(STYLE, ATTRS);
    it("should be true on a perfect match", () => {
      expect(ss.matches(ATTRS)).toBeTruthy();
    });
    it("should be false if one attr is different", () => {
      expect(ss.matches({ ...ATTRS, variant: "secondary" })).toBeFalsy();
    });
    it("should be false if one attr is added", () => {
      expect(ss.matches({ ...ATTRS, foo: "bar" })).toBeFalsy();
    });
    it("should be false if one attr is removed", () => {
      const { appearance, ...rest } = ATTRS;
      expect(appearance).toBeTruthy();
      expect(ss.matches(rest)).toBeFalsy();
    });
  });
  describe("specificity", () => {
    it("should have a known specificity", () => {
      const ss = new StylerStyle(STYLE, ATTRS);
      expect(ss.specificity).toBe(13);
    });
    it("should have a specificity of 8 for just appearance", () => {
      const ss = new StylerStyle(STYLE, { appearance: "dark" });
      expect(ss.specificity).toBe(8);
    });
    it("should have a specificity of 4 for just variant", () => {
      const ss = new StylerStyle(STYLE, { variant: "foo" });
      expect(ss.specificity).toBe(4);
    });
  });
});
