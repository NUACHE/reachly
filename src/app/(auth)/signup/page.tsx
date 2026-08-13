import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import { SignUpForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign Up — Reachly",
};

export default function SignUpPage() {
  return (
    <AuthLayout
      title="Sign Up"
      subtitle="Connect with thousands of influencers and get your brand to the right people"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-blue">
            Sign In
          </Link>
        </>
      }
    >
      <Suspense>
        <SignUpForm />
      </Suspense>
    </AuthLayout>
  );
}
