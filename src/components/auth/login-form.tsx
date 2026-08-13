"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { TextField } from "@/components/ui/text-field";
import { PasswordField } from "@/components/ui/password-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (!result || result.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <TextField
        label="Email Address"
        name="email"
        type="email"
        placeholder="Enter Email Address"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <PasswordField
        label="Password"
        name="password"
        placeholder="********"
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <div className="flex items-center justify-between">
        <Checkbox label="Remember me" name="remember" />
        <Link href="/forgot-password" className="text-sm font-medium text-brand-orange">
          Forgot Password?
        </Link>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
