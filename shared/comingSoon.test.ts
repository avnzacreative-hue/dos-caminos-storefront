import { describe, expect, it } from "vitest";
import { getDropCountdown, getDropLaunchState, getEmailSubmissionState, getEmailValidationMessage } from "./comingSoon";

describe("coming-soon launch helpers", () => {
  it("calculates padded countdown units from an absolute timestamp", () => {
    expect(getDropCountdown("2026-09-18T10:00:00-07:00", Date.parse("2026-09-17T09:57:55-07:00"))).toMatchObject({ days: "01", hours: "00", minutes: "02", seconds: "05", isLive: false });
  });

  it("shows the live state without permitting negative countdown values", () => {
    expect(getDropCountdown("2026-09-18T10:00:00-07:00", Date.parse("2026-09-18T10:01:00-07:00"))).toMatchObject({ days: "00", hours: "00", minutes: "00", seconds: "00", isLive: true });
  });

  it("distinguishes empty, invalid, and valid email input", () => {
    expect(getEmailValidationMessage("")).toBe("Enter an email address");
    expect(getEmailValidationMessage("not-an-email")).toBe("That email doesn't look right");
    expect(getEmailValidationMessage("hello@example.com")).toBe("");
  });

  it("transitions email submission through error and loading states without sending data", () => {
    expect(getEmailSubmissionState("")).toEqual({ status: "error", message: "Enter an email address" });
    expect(getEmailSubmissionState("wrong")).toEqual({ status: "error", message: "That email doesn't look right" });
    expect(getEmailSubmissionState("hello@example.com")).toEqual({ status: "loading", message: "" });
  });

  it("provides the correct rendered call-to-action when the launch target has passed", () => {
    const liveCountdown = getDropCountdown("2026-09-18T10:00:00-07:00", Date.parse("2026-09-18T10:01:00-07:00"));
    expect(getDropLaunchState(liveCountdown)).toEqual({ title: "DROP 01 IS LIVE", actionLabel: "SHOP DROP 01", actionPath: "/collections/blanks" });
  });
});
