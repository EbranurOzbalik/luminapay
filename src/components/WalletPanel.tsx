import { LogOut, RefreshCw, Wallet, Wifi, WifiOff } from "lucide-react";

type WalletPanelProps = {
  publicKey: string | null;
  balance: string | null;
  isFreighterInstalled: boolean | null;
  isConnecting: boolean;
  isLoadingBalance: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onRefreshBalance: () => void;
};

export function WalletPanel({
  publicKey,
  balance,
  isFreighterInstalled,
  isConnecting,
  isLoadingBalance,
  onConnect,
  onDisconnect,
  onRefreshBalance,
}: WalletPanelProps) {
  return (
    <section className="panel wallet-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Wallet</p>
          <h2>Freighter Testnet connection</h2>
        </div>
        <span className="panel-icon" aria-hidden="true">
          <Wallet size={20} />
        </span>
      </div>

      <div className={`status-row ${isFreighterInstalled ? "ready" : "blocked"}`}>
        {isFreighterInstalled ? <Wifi size={17} /> : <WifiOff size={17} />}
        <span>
          {isFreighterInstalled === null
            ? "Checking Freighter..."
            : isFreighterInstalled
              ? "Freighter detected"
              : "Freighter is not installed"}
        </span>
      </div>

      {publicKey ? (
        <div className="wallet-details">
          <div className="address-block">
            <span className="label">Public key</span>
            <code>{publicKey}</code>
          </div>

          <div className="balance-box">
            <div>
              <span className="label">Testnet XLM balance</span>
              <strong>{isLoadingBalance ? "Loading..." : `${balance ?? "0"} XLM`}</strong>
            </div>
            <span className="balance-badge">Horizon Testnet</span>
          </div>

          <div className="button-row">
            <button type="button" className="secondary" onClick={onRefreshBalance} disabled={isLoadingBalance}>
              <RefreshCw size={17} aria-hidden="true" />
              {isLoadingBalance ? "Refreshing..." : "Refresh Balance"}
            </button>
            <button type="button" className="ghost" onClick={onDisconnect}>
              <LogOut size={17} aria-hidden="true" />
              Disconnect Wallet
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="primary"
          onClick={onConnect}
          disabled={!isFreighterInstalled || isConnecting}
        >
          <Wallet size={18} aria-hidden="true" />
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
    </section>
  );
}
