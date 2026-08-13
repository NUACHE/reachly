import { describe, expect, it } from "vitest";
import { isNiche, NICHES } from "@/lib/niches";

describe("isNiche", () => {
  it("returns true for every value in the fixed taxonomy", () => {
    for (const niche of NICHES) {
      expect(isNiche(niche)).toBe(true);
    }
  });

  it("returns false for a value outside the taxonomy", () => {
    expect(isNiche("Astrology")).toBe(false);
  });

  it("is case-sensitive", () => {
    expect(isNiche("fashion")).toBe(false);
  });
});
