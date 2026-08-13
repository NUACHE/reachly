"use client";

import { useState } from "react";
import { PasswordField } from "@/components/ui/password-field";
import { Button } from "@/components/ui/button";
import { changePasswordAction } from "@/lib/actions/account";

export function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    const result = await changePasswordAction({ oldPassword, newPassword, confirmPassword });

    setIsSubmitting(false);

    if (!result.success) {
      setMessage({ text: result.error ?? "Something went wrong. Please try again.", error: true });
      return;
    }

    setMessage({ text: "Password updated.", error: false });
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <form className="flex max-w-lg flex-col gap-5" onSubmit={handleSubmit}>
      <PasswordField label="Old Password" name="oldPassword" required value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
      <PasswordField label="New Password" name="newPassword" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
      <PasswordField label="Confirm New Password" name="confirmPassword" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      {message ? <p className={`text-sm ${message.error ? "text-red-600" : "text-emerald-600"}`}>{message.text}</p> : null}
      <Button type="submit" fullWidth={false} className="px-8" disabled={isSubmitting}>
        {isSubmitting ? "Updating…" : "Change Password"}
      </Button>
    </form>
  );
}
