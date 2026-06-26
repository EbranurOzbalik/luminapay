import { FormEvent, useState } from "react";
import { ArrowRight, Send } from "lucide-react";

type PaymentFormProps = {
  isWalletConnected: boolean;
  isSending: boolean;
  onSend: (recipient: string, amount: string) => Promise<void>;
};

export function PaymentForm({ isWalletConnected, isSending, onSend }: PaymentFormProps) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSend(recipient.trim(), amount.trim());
  }

  return (
    <section className="panel payment-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Payment</p>
          <h2>Send Testnet XLM</h2>
        </div>
        <span className="panel-icon" aria-hidden="true">
          <Send size={20} />
        </span>
      </div>

      {!isWalletConnected && <p className="panel-note">Connect Freighter to enable Testnet payments.</p>}

      <form onSubmit={handleSubmit} className="payment-form">
        <label>
          Recipient address
          <input
            type="text"
            value={recipient}
            onChange={(event) => setRecipient(event.target.value)}
            placeholder="G..."
            disabled={!isWalletConnected || isSending}
            required
          />
        </label>

        <label>
          Amount
          <input
            type="number"
            min="0.0000001"
            step="0.0000001"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="10"
            disabled={!isWalletConnected || isSending}
            required
          />
        </label>

        <button type="submit" className="primary" disabled={!isWalletConnected || isSending}>
          <ArrowRight size={18} aria-hidden="true" />
          {isSending ? "Sending..." : "Send XLM"}
        </button>
      </form>
    </section>
  );
}
