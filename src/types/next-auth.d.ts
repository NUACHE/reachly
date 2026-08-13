import type { Role } from "@/generated/prisma/client";

declare module "next-auth" {
  interface User {
    // Optional: an OAuth provider's initial profile (e.g. Google) has no role until
    // the jwt callback resolves it from our own User row.
    role?: Role;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      role: Role;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}
