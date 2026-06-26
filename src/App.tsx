import { useEffect, useState } from "react";
import { PaymentForm } from "./components/PaymentForm";
import { TransactionResult } from "./components/TransactionResult";
import { WalletPanel } from "./components/WalletPanel";
import { checkFreighterInstalled, connectFreighter, signWithFreighter } from "./services/freighter";
import {
  buildPaymentTransaction,
  getNativeBalance,
  submitSignedTransaction,
  validatePaymentInput,
  type PaymentResult,
} from "./services/stellar";

function App() {
  const [isFreighterInstalled, setIsFreighterInstalled] = useState<boolean | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PaymentResult | null>(null);

  useEffect(() => {
    checkFreighterInstalled().then(setIsFreighterInstalled);
  }, []);

  async function refreshBalance(address = publicKey) {
    if (!address) {
      return;
    }

    setIsLoadingBalance(true);
    setError(null);

    try {
      const nextBalance = await getNativeBalance(address);
      setBalance(nextBalance);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError, "Balance could not be refreshed."));
    } finally {
      setIsLoadingBalance(false);
    }
  }

  async function handleConnect() {
    setIsConnecting(true);
    setError(null);
    setResult(null);

    try {
      const address = await connectFreighter();
      setPublicKey(address);
      await refreshBalance(address);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError, "Wallet connection failed."));
    } finally {
      setIsConnecting(false);
    }
  }

  function handleDisconnect() {
    setPublicKey(null);
    setBalance(null);
    setError(null);
    setResult(null);
  }

  async function handleSend(recipient: string, amount: string) {
    if (!publicKey) {
      setError("Connect your Freighter wallet before sending XLM.");
      return;
    }

    const validationError = validatePaymentInput(recipient, amount);

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSending(true);
    setError(null);
    setResult(null);

    try {
      const transactionXdr = await buildPaymentTransaction(publicKey, recipient, amount);
      const signedTransactionXdr = await signWithFreighter(transactionXdr);
      const paymentResult = await submitSignedTransaction(signedTransactionXdr);

      setResult(paymentResult);
      await refreshBalance(publicKey);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError, "Payment failed."));
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-mark">LP</div>
        <div>
          <strong>LuminaPay</strong>
          <span>Stellar Testnet</span>
        </div>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">Stellar Testnet dApp</p>
          <h1>LuminaPay</h1>
          <p>
            A minimal Freighter-powered Stellar Testnet demo for connecting a wallet, reading XLM balance,
            and submitting signed payments.
          </p>
          <div className="hero-actions" aria-label="Demo capabilities">
            <span>Freighter</span>
            <span>Balance</span>
            <span>Payment</span>
          </div>
        </div>
        <div className="hero-status" aria-label="Network status">
          <span>Network</span>
          <strong>Testnet</strong>
          <small>Horizon endpoint ready</small>
        </div>
      </section>

      <div className="content-grid">
        <WalletPanel
          publicKey={publicKey}
          balance={balance}
          isFreighterInstalled={isFreighterInstalled}
          isConnecting={isConnecting}
          isLoadingBalance={isLoadingBalance}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          onRefreshBalance={() => refreshBalance()}
        />
        <PaymentForm isWalletConnected={Boolean(publicKey)} isSending={isSending} onSend={handleSend} />
      </div>

      <TransactionResult error={error} result={result} />
    </main>
  );
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export default App;
