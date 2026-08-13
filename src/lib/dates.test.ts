import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { daysUntil, relativeTimeFrom } from "@/lib/dates";

const NOW = new Date("2026-06-15T12:00:00.000Z");

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("daysUntil", () => {
  it("returns the number of whole days until a future deadline", () => {
    expect(daysUntil("2026-06-20T12:00:00.000Z")).toBe(5);
  });

  it("floors at 0 for a deadline in the past", () => {
    expect(daysUntil("2026-01-01T00:00:00.000Z")).toBe(0);
  });

  it("rounds up a partial day", () => {
    expect(daysUntil("2026-06-16T00:00:01.000Z")).toBe(1);
  });
});

describe("relativeTimeFrom", () => {
  it("returns 'just now' for the current instant", () => {
    expect(relativeTimeFrom(NOW)).toBe("just now");
  });

  it("pluralizes correctly for multiple minutes", () => {
    expect(relativeTimeFrom(new Date(NOW.getTime() - 5 * 60_000))).toBe("5 minutes ago");
  });

  it("does not pluralize a single unit", () => {
    expect(relativeTimeFrom(new Date(NOW.getTime() - 60_000))).toBe("1 minute ago");
  });

  it("reports the largest applicable unit for an older date", () => {
    expect(relativeTimeFrom(new Date(NOW.getTime() - 2 * 86_400_000))).toBe("2 days ago");
  });
});
