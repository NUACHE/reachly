"use client";

import { useState } from "react";
import { BlueModal } from "@/components/ui/blue-modal";
import { Button } from "@/components/ui/button";

interface FundAccountModalProps {
  open: boolean;
  defaultAmount: number;
  onClose: () => void;
  onPay: (amount: number) => void;
}

export function FundAccountModal({ open, defaultAmount, onClose, onPay }: FundAccountModalProps) {
  const [amount, setAmount] = useState(String(defaultAmount));
  const [chequeNote, setChequeNote] = useState(false);

  return (
    <BlueModal open={open} onClose={onClose} title="Load Funds Into Account" maxWidth="max-w-sm">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="fund-amount" className="text-sm font-medium text-ink">
            Amount
          </label>
          <input
            id="fund-amount"
            type="number"
            min={0}
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="w-full rounded-lg border border-border-subtle bg-white px-4 py-3 text-sm text-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
          />
        </div>

        <Button type="button" fullWidth onClick={() => onPay(Number(amount) || 0)}>
          Pay With Card Or Mobile Money
        </Button>

        <button
          type="button"
          onClick={() => setChequeNote(true)}
          className="text-center text-xs font-medium text-brand-blue hover:underline"
        >
          Make A Cheque Deposit
        </button>
        {chequeNote ? (
          <p className="text-center text-xs text-muted">
            Cheque deposits are processed manually — our team will reach out to confirm details.
          </p>
        ) : null}
      </div>
    </BlueModal>
  );
}
