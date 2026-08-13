"use client";

import { useState } from "react";
import { BlueModal } from "@/components/ui/blue-modal";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/button";

const MOBILE_MONEY_METHODS = ["MTN MoMo", "Vodafone Cash", "AirtelTigo Money"];

interface WithdrawFundsModalProps {
  open: boolean;
  balance: number;
  onClose: () => void;
}

export function WithdrawFundsModal({ open, balance, onClose }: WithdrawFundsModalProps) {
  const [method, setMethod] = useState<"Mobile Money" | "Cheque">("Mobile Money");
  const [amount, setAmount] = useState(String(balance.toFixed(2)));
  const [mobileProvider, setMobileProvider] = useState(MOBILE_MONEY_METHODS[0]);
  const [mobileNumber, setMobileNumber] = useState("");
  const [note, setNote] = useState<string | null>(null);

  return (
    <BlueModal open={open} onClose={onClose} title="Withdraw Funds" maxWidth="max-w-sm">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between rounded-xl bg-[#1e2a4a] px-4 py-3">
          <span className="text-xs text-white/70">Available Balance</span>
          <span className="text-sm font-semibold text-white">¢{balance.toFixed(2)}</span>
        </div>

        <div className="flex gap-2 rounded-lg bg-[#f8f9fb] p-1">
          {(["Mobile Money", "Cheque"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMethod(option)}
              className={`flex-1 rounded-md py-2 text-xs font-semibold transition ${
                method === option ? "bg-brand-orange text-white" : "text-muted"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <TextField label="Amount" name="amount" type="number" min={0} max={balance} value={amount} onChange={(e) => setAmount(e.target.value)} />

        {method === "Mobile Money" ? (
          <>
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-ink">Select Method</span>
              <div className="grid grid-cols-3 gap-2">
                {MOBILE_MONEY_METHODS.map((provider) => (
                  <button
                    key={provider}
                    type="button"
                    onClick={() => setMobileProvider(provider)}
                    className={`rounded-lg border px-2 py-2 text-[10px] font-semibold transition ${
                      mobileProvider === provider ? "border-brand-orange text-brand-orange" : "border-border-subtle text-ink"
                    }`}
                  >
                    {provider}
                  </button>
                ))}
              </div>
            </div>
            <TextField
              label="Mobile Number"
              name="mobileNumber"
              type="tel"
              placeholder="9876543210"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
          </>
        ) : (
          <p className="text-xs text-muted">Cheque withdrawals are processed manually — our team will reach out to confirm details.</p>
        )}

        {note ? <p className="text-xs text-emerald-600">{note}</p> : null}

        <Button fullWidth onClick={() => setNote("Withdrawal request submitted. This can take 1-2 business days.")}>
          Withdraw
        </Button>
      </div>
    </BlueModal>
  );
}
