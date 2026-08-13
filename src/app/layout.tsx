import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { SessionProvider } from "@/components/providers/session-provider";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Reachly — Brand & Influencer Campaign Marketplace",
  description:
    "Reachly connects brands with influencers to run, match, and manage marketing campaigns.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans text-xs">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
