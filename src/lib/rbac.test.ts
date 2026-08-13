import { beforeEach, describe, expect, it, vi } from "vitest";
import { auth } from "@/lib/auth";
import { requireRole, requireRoleForPage, requireUser, UnauthorizedError, ForbiddenError } from "@/lib/rbac";

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));

const mockedAuth = vi.mocked(auth);

beforeEach(() => {
  mockedAuth.mockReset();
});

describe("requireUser", () => {
  it("returns the session user when authenticated", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "u1", role: "BRAND" } } as never);
    await expect(requireUser()).resolves.toEqual({ id: "u1", role: "BRAND" });
  });

  it("throws UnauthorizedError when there is no session", async () => {
    mockedAuth.mockResolvedValue(null as never);
    await expect(requireUser()).rejects.toBeInstanceOf(UnauthorizedError);
  });
});

describe("requireRole", () => {
  it("returns the user when their role is allowed", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "u1", role: "ADMIN" } } as never);
    await expect(requireRole("ADMIN")).resolves.toEqual({ id: "u1", role: "ADMIN" });
  });

  it("throws ForbiddenError when the role is not in the allowed list", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "u1", role: "INFLUENCER" } } as never);
    await expect(requireRole("ADMIN", "BRAND")).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("throws UnauthorizedError before checking role when unauthenticated", async () => {
    mockedAuth.mockResolvedValue(null as never);
    await expect(requireRole("ADMIN")).rejects.toBeInstanceOf(UnauthorizedError);
  });
});

describe("requireRoleForPage", () => {
  it("returns the user when their role matches", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "u1", role: "BRAND" } } as never);
    await expect(requireRoleForPage("BRAND")).resolves.toEqual({ id: "u1", role: "BRAND" });
  });

  it("redirects to /login when there is no session", async () => {
    mockedAuth.mockResolvedValue(null as never);
    await expect(requireRoleForPage("BRAND")).rejects.toThrow("REDIRECT:/login");
  });

  it("redirects to the user's own home when their role doesn't match", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "u1", role: "INFLUENCER" } } as never);
    await expect(requireRoleForPage("BRAND")).rejects.toThrow("REDIRECT:/influencer");
  });
});
