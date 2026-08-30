export type DropCountdown = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  isLive: boolean;
};

export type EmailSubmissionState = {
  status: "error" | "loading";
  message: string;
};

const pad = (value: number) => String(value).padStart(2, "0");

export function getDropCountdown(targetDatetime: string, now = Date.now()): DropCountdown {
  const target = Date.parse(targetDatetime);
  const remainingSeconds = Number.isFinite(target) ? Math.max(0, Math.floor((target - now) / 1000)) : 0;
  const days = Math.floor(remainingSeconds / 86_400);
  const hours = Math.floor((remainingSeconds % 86_400) / 3_600);
  const minutes = Math.floor((remainingSeconds % 3_600) / 60);
  const seconds = remainingSeconds % 60;

  return { days: pad(days), hours: pad(hours), minutes: pad(minutes), seconds: pad(seconds), isLive: remainingSeconds === 0 };
}

export function getEmailValidationMessage(email: string) {
  const normalized = email.trim();
  if (!normalized) return "Enter an email address";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) ? "" : "That email doesn't look right";
}

export function getEmailSubmissionState(email: string): EmailSubmissionState {
  const message = getEmailValidationMessage(email);
  return message ? { status: "error", message } : { status: "loading", message: "" };
}

export function getDropLaunchState(countdown: DropCountdown) {
  return countdown.isLive
    ? { title: "DROP 01 IS LIVE", actionLabel: "SHOP DROP 01", actionPath: "/collections/blanks" }
    : null;
}
