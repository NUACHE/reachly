import { describe, expect, it } from "vitest";
import {
  applicationDecisionSchema,
  campaignSchema,
  loginSchema,
  signupSchema,
} from "@/lib/validation";

describe("signupSchema", () => {
  it("accepts a valid brand signup", () => {
    const result = signupSchema.safeParse({
      role: "BRAND",
      email: "brand@example.com",
      password: "password123",
      companyName: "Acme Co",
      website: "",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a valid influencer signup", () => {
    const result = signupSchema.safeParse({
      role: "INFLUENCER",
      email: "creator@example.com",
      password: "password123",
      displayName: "Ama Boateng",
      niches: ["Fashion", "Beauty"],
      followerCount: 1000,
      engagementRate: 4.5,
    });
    expect(result.success).toBe(true);
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = signupSchema.safeParse({
      role: "BRAND",
      email: "brand@example.com",
      password: "short",
      companyName: "Acme Co",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = signupSchema.safeParse({
      role: "BRAND",
      email: "not-an-email",
      password: "password123",
      companyName: "Acme Co",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an influencer with no niches selected", () => {
    const result = signupSchema.safeParse({
      role: "INFLUENCER",
      email: "creator@example.com",
      password: "password123",
      displayName: "Ama Boateng",
      niches: [],
      followerCount: 1000,
      engagementRate: 4.5,
    });
    expect(result.success).toBe(false);
  });

  it("rejects a niche outside the fixed taxonomy", () => {
    const result = signupSchema.safeParse({
      role: "INFLUENCER",
      email: "creator@example.com",
      password: "password123",
      displayName: "Ama Boateng",
      niches: ["Astrology"],
      followerCount: 1000,
      engagementRate: 4.5,
    });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("accepts a valid email/password pair", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", password: "x" }).success).toBe(true);
  });

  it("rejects an empty password", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", password: "" }).success).toBe(false);
  });
});

describe("campaignSchema", () => {
  const base = {
    title: "Summer Launch",
    description: "A campaign to promote our summer product line to a wide audience.",
    objective: "AWARENESS" as const,
    niches: ["Tech"],
    minFollowers: 1000,
    maxFollowers: 10000,
    budget: 500,
    deliverables: "One TikTok video",
    deadline: "2027-01-01",
  };

  it("accepts a valid campaign", () => {
    expect(campaignSchema.safeParse(base).success).toBe(true);
  });

  it("rejects when maxFollowers is less than minFollowers", () => {
    const result = campaignSchema.safeParse({ ...base, minFollowers: 10000, maxFollowers: 1000 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["maxFollowers"]);
    }
  });

  it("rejects a title that is too short", () => {
    expect(campaignSchema.safeParse({ ...base, title: "Hi" }).success).toBe(false);
  });
});

describe("applicationDecisionSchema", () => {
  it("accepts ACCEPTED and REJECTED", () => {
    expect(
      applicationDecisionSchema.safeParse({ applicationId: "app-1", decision: "ACCEPTED" }).success,
    ).toBe(true);
    expect(
      applicationDecisionSchema.safeParse({ applicationId: "app-1", decision: "REJECTED" }).success,
    ).toBe(true);
  });

  it("rejects any other decision value", () => {
    expect(
      applicationDecisionSchema.safeParse({ applicationId: "app-1", decision: "MAYBE" }).success,
    ).toBe(false);
  });
});
