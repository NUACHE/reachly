import { describe, expect, it } from "vitest";
import { initialsFor } from "@/lib/initials";

describe("initialsFor", () => {
  it("returns two initials for a two-word name", () => {
    expect(initialsFor("Ama Boateng")).toBe("AB");
  });

  it("returns one initial for a single-word name", () => {
    expect(initialsFor("Cher")).toBe("C");
  });

  it("caps at two initials for a name with more than two words", () => {
    expect(initialsFor("Jean Paul Gaultier")).toBe("JP");
  });

  it("ignores extra whitespace between words", () => {
    expect(initialsFor("  Ama   Boateng  ")).toBe("AB");
  });

  it("returns an empty string for an empty name", () => {
    expect(initialsFor("")).toBe("");
  });
});
