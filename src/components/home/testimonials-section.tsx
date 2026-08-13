"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Amara K.",
    role: "Beauty & Skincare Creator",
    quote:
      "Reachly matched me with brands that actually fit my niche. I went from cold-pitching in DMs to picking campaigns I actually want to run.",
  },
  {
    name: "Jordan P.",
    role: "Brand Marketing Lead, Fitness & Wellness",
    quote:
      "We used to manage influencer outreach in spreadsheets. Now we post a campaign, review applications, and track results in one place.",
  },
  {
    name: "Priya S.",
    role: "Travel Creator",
    quote:
      "The verified stats mean I don't have to keep sending screenshots to prove my reach. Brands can just see it.",
  },
  {
    name: "Marcus T.",
    role: "Founder, DTC Brand",
    quote:
      "Reachly cut the time it takes us to launch a campaign from weeks to days. The reporting alone is worth it.",
  },
];

export function TestimonialsSection() {
  const [start, setStart] = useState(0);
  const visibleCount = 2;

  const showPrevious = () => {
    setStart((current) => (current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const showNext = () => {
    setStart((current) => (current + 1) % TESTIMONIALS.length);
  };

  const visible = Array.from(
    { length: visibleCount },
    (_, offset) => TESTIMONIALS[(start + offset) % TESTIMONIALS.length],
  );

  return (
    <section id="testimonials" className="bg-[#f8f8f8] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-extrabold text-ink sm:text-4xl">
          What our users are saying
        </h2>

        <div className="mt-14 flex items-center gap-4">
          <button
            type="button"
            onClick={showPrevious}
            aria-label="Previous testimonial"
            className="hidden size-10 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-white text-ink transition hover:bg-[#f0f0f0] sm:flex"
          >
            <ChevronLeft className="size-5" />
          </button>

          <div className="grid flex-1 gap-6 sm:grid-cols-2">
            {visible.map((testimonial) => (
              <div key={testimonial.name} className="rounded-2xl bg-white p-8 shadow-sm">
                <Quote className="size-8 text-brand-blue/30" />
                <p className="mt-4 text-sm text-muted">{testimonial.quote}</p>
                <div className="mt-6 flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-brand-orange/10 text-sm font-bold text-brand-orange">
                    {testimonial.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink">{testimonial.name}</p>
                    <p className="text-xs text-muted">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={showNext}
            aria-label="Next testimonial"
            className="hidden size-10 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-white text-ink transition hover:bg-[#f0f0f0] sm:flex"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
