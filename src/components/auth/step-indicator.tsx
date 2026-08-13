interface StepIndicatorProps {
  currentStep: 1 | 2;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <StepCircle active={currentStep >= 1} label="01" />
      <div className="h-px w-16 bg-ink/20" />
      <StepCircle active={currentStep >= 2} label="02" />
    </div>
  );
}

function StepCircle({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={`flex size-9 items-center justify-center rounded-full text-sm font-bold ${
        active ? "bg-brand-blue text-white" : "bg-[#f8f8f8] text-muted"
      }`}
    >
      {label}
    </span>
  );
}
