import { describe, expect, it } from "vitest";
import { FOOTER_BRAND_MARKS } from "./pages/Storefront";

describe("footer brand-mark rail", () => {
  it("uses the complete supplied icon set with alternating approved accent tones", () => {
    expect(FOOTER_BRAND_MARKS).toHaveLength(7);
    expect(FOOTER_BRAND_MARKS.map(mark => mark.tone)).toEqual(["vermillion", "coral", "ember", "vermillion", "coral", "ember", "vermillion"]);
  });
});
