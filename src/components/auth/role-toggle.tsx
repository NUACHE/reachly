type SignupRole = "BRAND" | "INFLUENCER";

interface RoleToggleProps {
  value: SignupRole;
  onChange: (role: SignupRole) => void;
}

const OPTIONS: { role: SignupRole; label: string }[] = [
  { role: "BRAND", label: "I'm a Brand" },
  { role: "INFLUENCER", label: "I'm an Influencer" },
];

export function RoleToggle({ value, onChange }: RoleToggleProps) {
  return (
    <div className="mb-5 grid grid-cols-2 gap-1 rounded-full bg-[#f8f8f8] p-1">
      {OPTIONS.map((option) => (
        <button
          key={option.role}
          type="button"
          onClick={() => onChange(option.role)}
          className={`rounded-full py-2.5 text-sm font-bold transition ${
            value === option.role ? "bg-brand-orange text-white" : "text-muted"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
