import { describe, expect, it } from "vitest";
import { PRIMARY_WORDMARK_URL } from "./pages/Storefront";

describe("primary wordmark", () => {
  it("uses the newly supplied project-managed primary lockup", () => {
    expect(PRIMARY_WORDMARK_URL).toBe("/manus-storage/dos-caminos-primary-lockup_1923c629.png");
  });
});
