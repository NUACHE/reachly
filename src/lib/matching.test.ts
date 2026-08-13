import { describe, expect, it } from "vitest";
import {
  audienceFitScore,
  computeMatchScore,
  engagementScore,
  nicheOverlapScore,
} from "@/lib/matching";

describe("nicheOverlapScore", () => {
  it("returns 100 when all campaign niches are covered", () => {
    expect(nicheOverlapScore(["Tech", "Gaming"], ["Tech", "Gaming", "Finance"])).toBe(100);
  });

  it("returns partial credit for partial overlap", () => {
    expect(nicheOverlapScore(["Tech", "Gaming"], ["Tech"])).toBe(50);
  });

  it("returns 0 for no overlap", () => {
    expect(nicheOverlapScore(["Tech"], ["Fashion"])).toBe(0);
  });

  it("returns 0 when the campaign has no niches", () => {
    expect(nicheOverlapScore([], ["Tech"])).toBe(0);
  });
});

describe("audienceFitScore", () => {
  it("returns 100 when follower count is within range", () => {
    expect(audienceFitScore(5000, 1000, 10000)).toBe(100);
  });

  it("decays for a follower count below the minimum", () => {
    const score = audienceFitScore(500, 1000, 10000);
    expect(score).toBeLessThan(100);
    expect(score).toBeGreaterThanOrEqual(0);
  });

  it("decays for a follower count above the maximum", () => {
    const score = audienceFitScore(20000, 1000, 10000);
    expect(score).toBeLessThan(100);
    expect(score).toBeGreaterThanOrEqual(0);
  });

  it("floors at 0 rather than going negative", () => {
    expect(audienceFitScore(0, 1000, 10000)).toBe(0);
  });
});

describe("engagementScore", () => {
  it("scores >=5% as excellent", () => {
    expect(engagementScore(6)).toBe(100);
  });

  it("scores 2-5% as good", () => {
    expect(engagementScore(3)).toBe(70);
  });

  it("scores <2% as low", () => {
    expect(engagementScore(1)).toBe(40);
  });
});

describe("computeMatchScore", () => {
  it("scores a well-matched influencer highly", () => {
    const score = computeMatchScore({
      campaignNiches: ["Tech"],
      influencerNiches: ["Tech"],
      minFollowers: 1000,
      maxFollowers: 10000,
      followerCount: 5000,
      engagementRate: 6,
    });
    expect(score).toBe(100);
  });

  it("scores a poorly-matched influencer lower", () => {
    const score = computeMatchScore({
      campaignNiches: ["Tech"],
      influencerNiches: ["Fashion"],
      minFollowers: 1000,
      maxFollowers: 10000,
      followerCount: 50,
      engagementRate: 0.5,
    });
    expect(score).toBeLessThan(40);
  });

  it("always returns an integer between 0 and 100", () => {
    const score = computeMatchScore({
      campaignNiches: ["Tech", "Gaming"],
      influencerNiches: ["Gaming"],
      minFollowers: 2000,
      maxFollowers: 20000,
      followerCount: 15000,
      engagementRate: 3.2,
    });
    expect(Number.isInteger(score)).toBe(true);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});
