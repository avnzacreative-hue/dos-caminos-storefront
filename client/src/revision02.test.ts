import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./index.css", import.meta.url), "utf8");
const editableSources = [
  source,
  readFileSync(new URL("./mobile-optimizations.css", import.meta.url), "utf8"),
  readFileSync(new URL("./brand-treatments.css", import.meta.url), "utf8"),
  readFileSync(new URL("./new-wordmark.css", import.meta.url), "utf8"),
  readFileSync(new URL("./pages/Storefront.tsx", import.meta.url), "utf8"),
].join("\n");
const legacyIndigo = ["3D4A63", "232B3B", "8A8577", "2A2724"].map(value => `#${value}`);

describe("revision 02 visual system", () => {
  it("defines the supplied palette and removes the legacy indigo token values", () => {
    ["--cacao: #421E19", "--vermillion: #F24519", "--ember: #B8360F", "--coral: #FF7A4F", "--clay: #6B5A4E", "--ash: #B8A392"].forEach(token => expect(source).toContain(token));
    legacyIndigo.forEach(color => expect(editableSources).not.toContain(color));
  });

  it("prohibits negative tracking and uses the mandated dark section ground", () => {
    expect(editableSources).not.toMatch(/letter-spacing:\s*-/);
    expect(source).toContain(".archivo-section { background: var(--cacao)");
    expect(source).toContain(".fit-strip { background: var(--cacao)");
  });

  it("uses the prescribed Archivo image edge treatment", () => {
    expect(source).toContain("border: 1px solid var(--line-on-dark)");
    expect(source).toContain("border-radius: 2px");
    expect(source).toContain(".collection-archivo .product-image");
  });

  it("assigns accent, muted text, and filled buttons to their approved ground-specific tokens", () => {
    expect(source).toContain(".primary-button { min-height: 46px; border: 1px solid var(--cacao); color: var(--bone); background: var(--cacao)");
    expect(source).toContain(".primary-button:hover:not(:disabled) { background: var(--vermillion)");
    expect(source).toContain(".inline-link { display: inline-flex; align-items: center; gap: 6px; color: var(--ember)");
    expect(source).toContain(".archivo-section .inline-link { color: var(--coral)");
    expect(source).toContain(".eyebrow, .footer-label { color: var(--clay)");
    expect(source).toContain(".archivo-section .eyebrow, .archivo-section .product-line { color: var(--ash)");
    expect(source).not.toMatch(/font-size:\s*(?:[0-9]|1[0-9]|2[0-3])px[^}]*color:\s*var\(--vermillion\)/);
  });
});
