import { Camera, Music, Star, Video } from "lucide-react";

const BADGES = [
  { icon: Camera, className: "-top-4 -left-4" },
  { icon: Video, className: "top-6 -right-5" },
  { icon: Music, className: "-bottom-5 left-10" },
];

const PROFILE_CARDS = [
  { name: "Amara K.", niche: "Beauty & Skincare", followers: "128K", rating: "4.9" },
  { name: "Jordan P.", niche: "Fitness & Wellness", followers: "64K", rating: "4.8" },
];

export function HeroVisual() {
  return (
    <div className="relative mx-auto h-80 w-full max-w-sm sm:h-96">
      {BADGES.map(({ icon: Icon, className }) => (
        <span
          key={className}
          className={`absolute z-20 flex size-11 items-center justify-center rounded-full bg-white text-brand-orange shadow-lg ${className}`}
        >
          <Icon className="size-5" />
        </span>
      ))}

      {PROFILE_CARDS.map((card, index) => (
        <div
          key={card.name}
          className={`absolute w-56 rounded-2xl bg-white p-4 text-left text-ink shadow-xl ${
            index === 0 ? "top-4 left-1/2 -translate-x-[68%] rotate-[-3deg]" : "bottom-4 left-1/2 -translate-x-[32%] rotate-[3deg]"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-brand-blue/10 text-sm font-bold text-brand-blue">
              {card.name.charAt(0)}
            </span>
            <div>
              <p className="text-sm font-bold">{card.name}</p>
              <p className="text-xs text-muted">{card.niche}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs font-semibold text-muted">
            <span>{card.followers} followers</span>
            <span className="flex items-center gap-1 text-brand-orange">
              <Star className="size-3.5 fill-current" />
              {card.rating}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
