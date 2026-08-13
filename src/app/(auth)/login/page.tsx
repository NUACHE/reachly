import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login — Reachly",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Login"
      subtitle="Provide your login details to access your account"
      footer={
        <>
          Don&apos;t have an account yet?{" "}
          <Link href="/signup" className="font-semibold text-brand-blue">
            Sign Up
          </Link>
        </>
      }
    >
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
