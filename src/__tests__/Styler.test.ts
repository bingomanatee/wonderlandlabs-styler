import { describe, it, expect } from "vitest";
import { Styler } from "../Styler";
import { StylerStyleIF } from "../types";

const BUTTON = "button";
const DARK = { appearnace: "dark" };
const BORDERED = { bordered: true };
const BIG_TEXT = { variant: "big-text" };
const DISABLED = { disabled: true };

describe("Styler", () => {
  describe("base styles", () => {
    it("should recognize base styles", () => {
      const s = new Styler();

      s.add(BUTTON, { margin: 2, paddig: 4 }, {});
      s.add(
        BUTTON,
        { backgroundColor: "black", color: "white" },
        { appearnace: "dark" }
      );

      s.for(BUTTON, {});

      expect(s.for(BUTTON, {})).toEqual({ margin: 2, paddig: 4 });
    });
  });

  describe("sub styles", () => {
    it("should recognize sub styles", () => {
      const s = new Styler();
      const DARK = { appearnace: "dark" };

      s.add(BUTTON, { margin: 2, paddig: 4 }, {});
      s.add(BUTTON, { backgroundColor: "black", color: "white" }, DARK);

      s.for(BUTTON, DARK);
      expect(s.for(BUTTON, { appearnace: "dark" })).toEqual({
        margin: 2,
        paddig: 4,
        backgroundColor: "black",
        color: "white",
      });
    });

    it("should recognize multiple sub styles", () => {
      const s = new Styler();
      const DARK = { appearnace: "dark" };
      const BIG_TEXT = { variant: "big-text" };
      const TARGET = { ...DARK, ...BIG_TEXT };

      s.add(BUTTON, { margin: 2, paddig: 4 }, {});
      s.add(BUTTON, { fontSize: 40 }, BIG_TEXT);
      s.add(BUTTON, { backgroundColor: "black", color: "white" }, DARK);

      const styles = s.targetStyles.get(BUTTON);

      s.for(BUTTON, { ...DARK, variant: "big-text" });
      expect(s.for(BUTTON, TARGET)).toEqual({
        margin: 2,
        paddig: 4,
        backgroundColor: "black",
        color: "white",
        fontSize: 40,
      });
    });

    it("should recognize specificity", () => {
      const s = new Styler();
      const DARK = { appearnace: "dark" };
      const BIG_TEXT = { variant: "big-text" };
      const DISABLED = { disabled: true };
      const TARGET = { ...DARK, ...BIG_TEXT, ...DISABLED };

      s.add(BUTTON, { margin: 2, paddig: 4 }, {});
      s.add(BUTTON, { fontSize: 40 }, BIG_TEXT);
      s.add(
        BUTTON,
        { fontSize: 20, color: "grey" },
        { ...BIG_TEXT, ...DISABLED }
      );
      s.add(BUTTON, { backgroundColor: "black", color: "white" }, DARK);

      console.log("----", s.for(BUTTON, TARGET));

      s.lessSpecificStyles(BUTTON, TARGET).forEach((ss: StylerStyleIF) => {
        console.log(
          "style",
          ss.isLessSpecificMatch(TARGET),
          ss.specificity,
          ss.attrs,
          ss.style
        );
      });
      expect(s.for(BUTTON, TARGET)).toEqual({
        margin: 2,
        paddig: 4,
        backgroundColor: "black",
        color: "grey",
        fontSize: 20,
      });
    });
  });

  describe("super styles", () => {
    it("should recognize sub styles but ignore more specific ones", () => {
      const s = new Styler();

      s.add(BUTTON, { margin: 2, paddig: 4 }, {});
      s.add(BUTTON, { backgroundColor: "black", color: "white" }, DARK);
      s.add(BUTTON, { borderColor: "black", borderWidth: 1 }, BORDERED);
      s.add(BUTTON, { borderColor: "white" }, { ...DARK, ...BORDERED });

      s.for(BUTTON, DARK);
      expect(s.for(BUTTON, DARK)).toEqual({
        margin: 2,
        paddig: 4,
        backgroundColor: "black",
        color: "white",
      });
    });

    it("should recognize multiple sub styles but ingore more specific ones", () => {
      const s = new Styler();
      const TARGET = { ...DARK, ...BIG_TEXT };

      s.add(BUTTON, { margin: 2, paddig: 4 }, {});
      s.add(BUTTON, { fontSize: 40 }, BIG_TEXT);
      s.add(BUTTON, { backgroundColor: "black", color: "white" }, DARK);
      s.add(BUTTON, { borderColor: "black", borderWidth: 1 }, BORDERED);
      s.add(BUTTON, { borderColor: "white" }, { ...DARK, ...BORDERED });

      const styles = s.targetStyles.get(BUTTON);

      s.for(BUTTON, { ...DARK, variant: "big-text" });
      expect(s.for(BUTTON, TARGET)).toEqual({
        margin: 2,
        paddig: 4,
        backgroundColor: "black",
        color: "white",
        fontSize: 40,
      });
    });

    it("should recognize specificity", () => {
      const s = new Styler();

      const TARGET = { ...DARK, ...BIG_TEXT, ...DISABLED };

      s.add(BUTTON, { margin: 2, paddig: 4 }, {});
      s.add(BUTTON, { fontSize: 40 }, BIG_TEXT);
      s.add(
        BUTTON,
        { fontSize: 20, color: "grey" },
        { ...BIG_TEXT, ...DISABLED }
      );
      s.add(BUTTON, { backgroundColor: "black", color: "white" }, DARK);

      console.log("----", s.for(BUTTON, TARGET));

      s.lessSpecificStyles(BUTTON, TARGET).forEach((ss: StylerStyleIF) => {
        console.log(
          "style",
          ss.isLessSpecificMatch(TARGET),
          ss.specificity,
          ss.attrs,
          ss.style
        );
      });
      expect(s.for(BUTTON, TARGET)).toEqual({
        margin: 2,
        paddig: 4,
        backgroundColor: "black",
        color: "grey",
        fontSize: 20,
      });
    });
  });
});
