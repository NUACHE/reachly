"use client";

import { useState } from "react";
import { PasswordField } from "@/components/ui/password-field";
import { Button } from "@/components/ui/button";

export function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (newPassword.length < 8) {
      setMessage({ text: "New password must be at least 8 characters.", error: true });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ text: "New password and confirmation don't match.", error: true });
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
      <Button type="submit" fullWidth={false} className="px-8">
        Change Password
      </Button>
    </form>
  );
}
