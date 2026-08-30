// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ComingSoonBlock } from "./pages/Storefront";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("ComingSoonBlock rendered states", () => {
  it("shows required email validation, loading, and success states", () => {
    vi.useFakeTimers();
    render(<ComingSoonBlock />);
    const submit = screen.getByRole("button", { name: "NOTIFY ME" });
    fireEvent.click(submit);
    expect(screen.getByText("Enter an email address")).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "invalid" } });
    fireEvent.click(submit);
    expect(screen.getByText("That email doesn't look right")).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "hello@example.com" } });
    fireEvent.click(submit);
    expect(screen.getByRole("button", { name: "..." })).toBeTruthy();
    act(() => { vi.advanceTimersByTime(650); });
    expect(screen.getByText("You’re on the list.")).toBeTruthy();
  });

  it("shows an explicitly disabled, unchecked SMS placeholder and returns to email", () => {
    render(<ComingSoonBlock />);
    fireEvent.click(screen.getByRole("button", { name: "Get a text instead" }));
    const phoneInput = screen.getByLabelText("Phone number") as HTMLInputElement;
    const consentCheckbox = screen.getByRole("checkbox") as HTMLInputElement;
    expect(phoneInput.disabled).toBe(true);
    expect(consentCheckbox.disabled).toBe(true);
    expect(consentCheckbox.checked).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "Use email instead" }));
    expect(screen.getByLabelText("Email address")).toBeTruthy();
  });

  it("replaces the countdown with the live label and collection CTA after the target", () => {
    render(<ComingSoonBlock targetDatetime="2020-09-18T10:00:00-07:00" />);
    expect(screen.getByText("DROP 01 IS LIVE")).toBeTruthy();
    const action = screen.getByRole("link", { name: /SHOP DROP 01/i });
    expect(action.getAttribute("href")).toBe("/collections/blanks");
    expect(screen.queryByText("DAYS")).toBeNull();
  });
});
