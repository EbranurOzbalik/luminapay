import type { PaymentResult } from "../services/stellar";
import { AlertTriangle, CheckCircle2, ExternalLink } from "lucide-react";

type TransactionResultProps = {
  error: string | null;
  result: PaymentResult | null;
};

export function TransactionResult({ error, result }: TransactionResultProps) {
  if (!error && !result) {
    return null;
  }

  return (
    <section className={`result-panel ${error ? "error" : "success"}`}>
      {error ? (
        <div className="result-content">
          <span className="result-icon" aria-hidden="true">
            <AlertTriangle size={22} />
          </span>
          <div>
            <p className="eyebrow">Error</p>
            <h2>Something went wrong</h2>
            <p>{error}</p>
          </div>
        </div>
      ) : (
        <div className="result-content">
          <span className="result-icon" aria-hidden="true">
            <CheckCircle2 size={22} />
          </span>
          <div>
            <p className="eyebrow">Success</p>
            <h2>Transaction submitted</h2>
            <p>Hash</p>
            <code>{result?.hash}</code>
            <div className="result-meta">
              <span>Ledger: {result?.ledger}</span>
              {result?.hash && (
                <a href={`https://stellar.expert/explorer/testnet/tx/${result.hash}`} target="_blank" rel="noreferrer">
                  View on explorer
                  <ExternalLink size={15} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
