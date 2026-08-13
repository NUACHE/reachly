import { describe, expect, it } from "vitest";
import { pointsForPosts, summarizePoints } from "@/lib/points";

describe("pointsForPosts", () => {
  it("returns 0 for no posts", () => {
    expect(pointsForPosts([])).toBe(0);
  });

  it("weights views at 0.1 and likes+comments at 0.5 each", () => {
    // 978 views + 6 likes -> 978*0.1 + 6*0.5 = 97.8 + 3 = 100.8 -> rounds to 101
    expect(pointsForPosts([{ views: 978, likes: 6, comments: 0 }])).toBe(101);
  });

  it("counts comments the same as likes", () => {
    expect(pointsForPosts([{ views: 0, likes: 0, comments: 4 }])).toBe(2);
  });

  it("sums across multiple posts", () => {
    expect(
      pointsForPosts([
        { views: 100, likes: 1, comments: 0 },
        { views: 200, likes: 0, comments: 2 },
      ]),
    ).toBe(Math.round(100 * 0.1 + 1 * 0.5 + 200 * 0.1 + 2 * 0.5));
  });

  it("ignores campaign budget entirely — is purely engagement-based by design", () => {
    expect(pointsForPosts([{ views: 0, likes: 0, comments: 0 }])).toBe(0);
  });
});

describe("summarizePoints", () => {
  it("returns the raw views/engagement totals alongside the computed points", () => {
    expect(summarizePoints([{ views: 978, likes: 6, comments: 0 }])).toEqual({
      views: 978,
      engagement: 6,
      points: 101,
    });
  });

  it("sums views and engagement independently across posts", () => {
    expect(
      summarizePoints([
        { views: 100, likes: 1, comments: 1 },
        { views: 200, likes: 0, comments: 2 },
      ]),
    ).toEqual({ views: 300, engagement: 4, points: Math.round(300 * 0.1 + 4 * 0.5) });
  });
});
