import {
  getAddress,
  isConnected,
  requestAccess,
  signTransaction,
} from "@stellar/freighter-api";

declare global {
  interface Window {
    freighter?: boolean;
    freighterApi?: unknown;
  }
}

export async function checkFreighterInstalled(): Promise<boolean> {
  return typeof window !== "undefined" && Boolean(window.freighter || window.freighterApi);
}

export async function connectFreighter(): Promise<string> {
  const installed = await checkFreighterInstalled();

  if (!installed) {
    throw new Error("Freighter wallet is not installed.");
  }

  try {
    const connected = await isConnected();

    if (connected.isConnected) {
      const currentAddress = await getAddress();

      if (currentAddress.address) {
        return currentAddress.address;
      }
    }

    const access = await requestAccess();

    if (!access.address) {
      throw new Error("Wallet access was not approved.");
    }

    return access.address;
  } catch (error) {
    throw new Error(getFreighterErrorMessage(error, "Could not connect Freighter wallet."));
  }
}

export async function signWithFreighter(transactionXdr: string): Promise<string> {
  try {
    const result = await signTransaction(transactionXdr, {
      networkPassphrase: "Test SDF Network ; September 2015",
    });

    if (!result.signedTxXdr) {
      throw new Error("Freighter did not return a signed transaction.");
    }

    return result.signedTxXdr;
  } catch (error) {
    throw new Error(getFreighterErrorMessage(error, "Transaction signing was cancelled or failed."));
  }
}

function getFreighterErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
