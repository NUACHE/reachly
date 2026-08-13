"use client";

import { useState, type KeyboardEvent } from "react";
import { Plus, X } from "lucide-react";

type TagTheme = "green" | "red" | "blue";

const THEME_CLASSES: Record<TagTheme, string> = {
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  red: "border-red-200 bg-red-50 text-red-600",
  blue: "border-brand-blue/20 bg-brand-blue/5 text-brand-blue",
};

interface TagListEditorProps {
  label: string;
  placeholder?: string;
  values: string[];
  onChange: (values: string[]) => void;
  theme?: TagTheme;
}

export function TagListEditor({ label, placeholder = "Lorem ipsum is dummy text", values, onChange, theme = "blue" }: TagListEditorProps) {
  const [draft, setDraft] = useState("");

  function addTag() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...values, trimmed]);
    setDraft("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      addTag();
    }
  }

  function removeTag(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border-subtle bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">{label}</h3>
        <button
          type="button"
          onClick={addTag}
          className="flex items-center gap-1 rounded-lg bg-brand-blue px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-95"
        >
          <Plus size={13} />
          Add
        </button>
      </div>
      <input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border-subtle bg-white px-3 py-2 text-xs text-ink placeholder:text-muted/70 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
      />
      <div className="flex flex-wrap gap-2">
        {values.map((value, index) => (
          <span
            key={`${value}-${index}`}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${THEME_CLASSES[theme]}`}
          >
            {value}
            <button type="button" onClick={() => removeTag(index)} aria-label={`Remove ${value}`} className="text-current/70 hover:text-current">
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
