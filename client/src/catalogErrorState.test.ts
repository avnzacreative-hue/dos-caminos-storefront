import { describe, expect, it } from "vitest";
import { CATALOG_UNAVAILABLE_COPY } from "./pages/Storefront";

describe("catalog unavailable state", () => {
  it("gives shoppers concise recovery guidance when Shopify cannot return the catalog", () => {
    expect(CATALOG_UNAVAILABLE_COPY).toContain("temporarily unavailable");
    expect(CATALOG_UNAVAILABLE_COPY).toContain("refresh");
  });
});
