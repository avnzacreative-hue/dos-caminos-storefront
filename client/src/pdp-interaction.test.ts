import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const page = readFileSync(new URL("./pages/Storefront.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("./pdp-revision.css", import.meta.url), "utf8");
const globalStyles = readFileSync(new URL("./index.css", import.meta.url), "utf8");

describe("PDP anchor and action-bar protections", () => {
  it("implements navigable active-state anchors and smooth in-page targets", () => {
    expect(page).toContain("new IntersectionObserver");
    expect(page).toContain("href={`#${anchor.id}`}");
    expect(page).toContain("className={active === anchor.id ? \"active\" : \"\"}");
    expect(styles).toContain("scroll-margin-top: 126px");
    expect(globalStyles).toContain("html { scroll-behavior: smooth;");
  });

  it("keeps the action bar fixed and reserves PDP end clearance at both breakpoints", () => {
    expect(styles).toContain(".pdp-action-bar {\n  position: fixed");
    expect(styles).toContain("padding: 97px 0 112px");
    expect(styles).toContain(".pdp-page { padding-top: 109px; padding-bottom: 126px;");
  });
});
