import { describe, expect, it } from "vitest";
import { kpiProgressPercent } from "@/lib/kpi";

describe("kpiProgressPercent", () => {
  it("returns 0 when no targets are set", () => {
    expect(kpiProgressPercent({ views: 978, likes: 6 }, { targetViews: 0, targetLikes: 0 })).toBe(0);
  });

  it("averages progress across both metrics when both targets are set", () => {
    // views: 978/1000 = 97.8%, likes: 6/12 = 50% -> average 73.9% -> rounds to 74
    expect(kpiProgressPercent({ views: 978, likes: 6 }, { targetViews: 1000, targetLikes: 12 })).toBe(74);
  });

  it("uses only the views ratio when only a views target is set", () => {
    expect(kpiProgressPercent({ views: 500, likes: 6 }, { targetViews: 1000, targetLikes: 0 })).toBe(50);
  });

  it("uses only the likes ratio when only a likes target is set", () => {
    expect(kpiProgressPercent({ views: 978, likes: 3 }, { targetViews: 0, targetLikes: 12 })).toBe(25);
  });

  it("caps each ratio at 100% even when the target is exceeded", () => {
    expect(kpiProgressPercent({ views: 5000, likes: 100 }, { targetViews: 1000, targetLikes: 10 })).toBe(100);
  });

  it("returns 0 with zero actuals against a real target", () => {
    expect(kpiProgressPercent({ views: 0, likes: 0 }, { targetViews: 1000, targetLikes: 10 })).toBe(0);
  });
});
