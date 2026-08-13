import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { DEMO_MODE, findDemoAccount } from "@/lib/demo-accounts";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = typeof credentials?.email === "string" ? credentials.email : undefined;
        const password =
          typeof credentials?.password === "string" ? credentials.password : undefined;
        if (!email || !password) return null;

        if (DEMO_MODE) {
          const demoAccount = findDemoAccount(email, password);
          if (demoAccount) {
            return { id: demoAccount.id, email: demoAccount.email, role: demoAccount.role };
          }
        }

        try {
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user || user.suspended || !user.passwordHash) return null;

          const isValid = await bcrypt.compare(password, user.passwordHash);
          if (!isValid) return null;

          return { id: user.id, email: user.email, role: user.role };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (account?.provider === "credentials" && user) {
        token.id = user.id as string;
        token.role = user.role!;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
});
