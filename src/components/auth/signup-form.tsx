"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { TextField } from "@/components/ui/text-field";
import { PasswordField } from "@/components/ui/password-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { NicheSelector } from "@/components/ui/niche-selector";
import { StepIndicator } from "@/components/auth/step-indicator";
import { RoleToggle } from "@/components/auth/role-toggle";
import { signUpAction } from "@/lib/actions/auth";

type SignupRole = "BRAND" | "INFLUENCER";

export function SignUpForm() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<SignupRole>("BRAND");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");

  const [displayName, setDisplayName] = useState("");
  const [niches, setNiches] = useState<string[]>([]);
  const [followerCount, setFollowerCount] = useState("");
  const [engagementRate, setEngagementRate] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleContinue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!acceptedTerms) {
      setError("You must accept Reachly's Terms and Conditions to continue.");
      return;
    }

    setStep(2);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const payload =
      role === "BRAND"
        ? { role, email, password, companyName, website }
        : {
            role,
            email,
            password,
            displayName,
            niches,
            followerCount: Number(followerCount),
            engagementRate: Number(engagementRate),
          };

    const result = await signUpAction(payload);

    if (!result.success) {
      setIsSubmitting(false);
      setError(result.error ?? "Something went wrong. Please try again.");
      return;
    }

    const signInResult = await signIn("credentials", { email, password, redirect: false });
    setIsSubmitting(false);

    if (!signInResult || signInResult.error) {
      router.push("/login");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  if (step === 1) {
    return (
      <form className="flex flex-col gap-4" onSubmit={handleContinue}>
        <StepIndicator currentStep={1} />
        <RoleToggle value={role} onChange={setRole} />

        <TextField
          label="Email Address"
          name="email"
          type="email"
          placeholder="johndoe123@gmail.com"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <PasswordField
          label="Password"
          name="password"
          placeholder="********"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <Checkbox
          label="I accept Reachly's Terms and Conditions"
          name="terms"
          checked={acceptedTerms}
          onChange={(event) => setAcceptedTerms(event.target.checked)}
        />

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <Button type="submit">Continue</Button>
      </form>
    );
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <StepIndicator currentStep={2} />

      {role === "BRAND" ? (
        <>
          <TextField
            label="Company Name"
            name="companyName"
            placeholder="Enter Company Name"
            required
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
          />
          <TextField
            label="Website (optional)"
            name="website"
            type="url"
            placeholder="https://yourcompany.com"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </>
      ) : (
        <>
          <TextField
            label="Display Name"
            name="displayName"
            placeholder="Enter Display Name"
            required
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-ink">Your Niches (pick up to 3)</span>
            <NicheSelector value={niches} onChange={setNiches} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="Follower Count"
              name="followerCount"
              type="number"
              min={0}
              placeholder="e.g. 5000"
              required
              value={followerCount}
              onChange={(event) => setFollowerCount(event.target.value)}
            />
            <TextField
              label="Engagement Rate (%)"
              name="engagementRate"
              type="number"
              min={0}
              max={100}
              step="0.1"
              placeholder="e.g. 4.5"
              required
              value={engagementRate}
              onChange={(event) => setEngagementRate(event.target.value)}
            />
          </div>
          <p className="text-xs text-muted">
            Self-reported for now — connecting a real social account is on our roadmap.
          </p>
        </>
      )}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex gap-3">
        <Button type="button" variant="ghost" className="flex-1" onClick={() => setStep(1)}>
          Back
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={isSubmitting || (role === "INFLUENCER" && niches.length === 0)}
        >
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </Button>
      </div>
    </form>
  );
}
