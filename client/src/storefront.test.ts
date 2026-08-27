import { describe, expect, it } from "vitest";
import { FIT_MEASURES, getProductDetail, getProductImage, matchesCollection } from "@shared/storefrontData";

describe("storefront content helpers", () => {
  it("keeps the published tee measurements available for every size", () => {
    expect(FIT_MEASURES.map(measure => measure.size)).toEqual(["S", "M", "L"]);
    expect(FIT_MEASURES.every(measure => measure.body && measure.chest && measure.shoulder)).toBe(true);
  });

  it("maps each Shopify product handle to its editorial fallback image and details", () => {
    expect(getProductDetail("faded-crop-tee-slate")?.line).toBe("BLANKS");
    expect(getProductImage("archivo-no-01-tee")).toContain("dos-caminos-archivo-front");
  });

  it("separates Blanks and Archivo products without relying on collection objects", () => {
    expect(matchesCollection("Blanks", "faded-crop-tee-slate", "blanks")).toBe(true);
    expect(matchesCollection("Archivo", "archivo-no-01-tee", "blanks")).toBe(false);
    expect(matchesCollection("Archivo", "archivo-no-01-tee", "archivo")).toBe(true);
  });
});
