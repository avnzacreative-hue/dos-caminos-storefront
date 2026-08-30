import { describe, expect, it } from "vitest";
import { clampPdpQuantity, getActivePdpAnchorId, getPdpSpecFields, PDP_ANCHORS, PDP_SIZE_HEADERS } from "./pdp";

describe("PDP revision helpers", () => {
  it("keeps the required section anchors in their specified order", () => {
    expect(PDP_ANCHORS.map(anchor => anchor.label)).toEqual(["DESCRIPTION", "PRODUCT DETAILS", "SIZE CHART"]);
  });

  it("selects the top-most visible PDP section for the anchor active state", () => {
    expect(getActivePdpAnchorId([{ id: "description", isIntersecting: true, top: -20 }, { id: "product-details", isIntersecting: true, top: 56 }])).toBe("description");
    expect(getActivePdpAnchorId([{ id: "product-details", isIntersecting: true, top: 5 }])).toBe("product-details");
    expect(getActivePdpAnchorId([{ id: "size-chart", isIntersecting: false, top: 2 }])).toBeUndefined();
  });

  it("keeps fixed-bar quantities purchasable and bounded", () => {
    expect(clampPdpQuantity(0)).toBe(1);
    expect(clampPdpQuantity(4.9)).toBe(4);
    expect(clampPdpQuantity(150)).toBe(99);
  });

  it("names every size measurement method precisely and provides the four PDP fields", () => {
    expect(PDP_SIZE_HEADERS).toEqual(["SIZE", "BODY LENGTH (HPS)", "CHEST (PIT TO PIT)", "SHOULDER (SEAM TO SEAM)", "SLEEVE", "HEM OPENING"]);
    expect(getPdpSpecFields("Los Angeles, CA", "100% combed cotton").map(field => field.value)).toEqual(["Los Angeles, CA", "100% Cotton", "Within 2 Weeks", "Cropped, Boxy"]);
  });
});
