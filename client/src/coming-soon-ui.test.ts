import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getDropCountdown, getDropLaunchState, getEmailValidationMessage } from "@shared/comingSoon";

const storefront = readFileSync(new URL("./pages/Storefront.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("./coming-soon.css", import.meta.url), "utf8");

describe("coming-soon launch UI safeguards", () => {
  it("declares one named absolute launch target and every required launch state", () => {
    expect(storefront).toContain("DROP_01_TARGET_DATETIME_AMERICA_LOS_ANGELES");
    const liveState = getDropLaunchState(getDropCountdown("2026-09-18T10:00:00-07:00", Date.parse("2026-09-18T10:01:00-07:00")));
    expect(liveState).toMatchObject({ title: "DROP 01 IS LIVE", actionLabel: "SHOP DROP 01", actionPath: "/collections/blanks" });
    expect(getEmailValidationMessage("")).toBe("Enter an email address");
    expect(getEmailValidationMessage("not-an-email")).toBe("That email doesn't look right");
    expect(storefront).toContain("You’re on the list.");
  });

  it("keeps SMS visibly staged but disabled with explicit unchecked consent", () => {
    expect(storefront).toContain('type="tel" placeholder="Phone number" disabled');
    expect(storefront).toContain('type="checkbox" disabled');
    expect(storefront).not.toContain("defaultChecked");
    expect(storefront).toContain("TCPA: wire to compliant SMS provider");
  });

  it("keeps the mobile launch layout legible at the specified narrow breakpoint", () => {
    expect(styles).toContain("@media (max-width: 767px)");
    expect(styles).toContain("font-size: 28px");
    expect(styles).toContain("letter-spacing: .12em");
    expect(styles).toContain(".coming-soon-email-form { display: grid");
  });
});
