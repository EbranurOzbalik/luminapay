import {
  getAddress,
  getNetworkDetails,
  isConnected,
  requestAccess,
  signTransaction,
} from "@stellar/freighter-api";

const TESTNET_PASSPHRASE = "Test SDF Network ; September 2015";

declare global {
  interface Window {
    freighter?: boolean;
    freighterApi?: unknown;
  }
}

export async function checkFreighterInstalled(): Promise<boolean> {
  if (typeof window === "undefined") {
    return false;
  }

  if (window.freighter || window.freighterApi) {
    return true;
  }

  try {
    const connectionStatus = await isConnected();
    return !connectionStatus.error;
  } catch {
    return false;
  }
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

      if (currentAddress.error) {
        throw new Error(getFreighterErrorMessage(currentAddress.error, "Could not read wallet address."));
      }

      if (currentAddress.address) {
        await assertFreighterTestnet();
        return currentAddress.address;
      }
    }

    const access = await requestAccess();

    if (access.error) {
      throw new Error(getFreighterErrorMessage(access.error, "Wallet access was not approved."));
    }

    if (!access.address) {
      throw new Error("Wallet access was not approved.");
    }

    await assertFreighterTestnet();

    return access.address;
  } catch (error) {
    throw new Error(getFreighterErrorMessage(error, "Could not connect Freighter wallet."));
  }
}

export async function signWithFreighter(transactionXdr: string): Promise<string> {
  try {
    const result = await signTransaction(transactionXdr, {
      networkPassphrase: TESTNET_PASSPHRASE,
    });

    if (!result.signedTxXdr) {
      throw new Error("Freighter did not return a signed transaction.");
    }

    return result.signedTxXdr;
  } catch (error) {
    throw new Error(getFreighterErrorMessage(error, "Transaction signing was cancelled or failed."));
  }
}

async function assertFreighterTestnet(): Promise<void> {
  const networkDetails = await getNetworkDetails();

  if (networkDetails.error) {
    throw new Error(getFreighterErrorMessage(networkDetails.error, "Could not read Freighter network."));
  }

  if (networkDetails.networkPassphrase !== TESTNET_PASSPHRASE) {
    throw new Error("Freighter must be switched to Stellar Testnet before connecting.");
  }
}

function getFreighterErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object" && error !== null) {
    const possibleError = error as { message?: string; error?: string };

    if (possibleError.message) {
      return possibleError.message;
    }

    if (possibleError.error) {
      return possibleError.error;
    }
  }

  return fallback;
}
