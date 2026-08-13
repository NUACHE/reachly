import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

// Temporary placeholder landing page — the full marketing homepage (Tier 2,
// see SRS FR-G1) is implemented from the Figma "Home" screen separately.
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
      <Logo />
      <div className="max-w-md space-y-2">
        <h1 className="text-3xl font-extrabold text-ink">
          Connect brands with the right influencers
        </h1>
        <p className="text-muted">
          Reachly matches campaigns to creators by niche and audience fit — no more
          spreadsheets and DMs.
        </p>
      </div>
      <div className="flex gap-3">
        <Link href="/login">
          <Button variant="ghost" className="px-8">
            Log In
          </Button>
        </Link>
        <Link href="/signup">
          <Button className="px-8">Sign Up</Button>
        </Link>
      </div>
    </main>
  );
}
