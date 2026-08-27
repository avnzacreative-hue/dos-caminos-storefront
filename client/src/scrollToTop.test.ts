import { describe, expect, it, vi } from "vitest";
import { scrollToPageTop } from "./pages/Storefront";

describe("scrollToPageTop", () => {
  it("resets the viewport to the page origin without animation", () => {
    const scrollTo = vi.fn();

    scrollToPageTop({ scrollTo });

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "auto" });
  });
});
