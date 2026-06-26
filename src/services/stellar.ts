import {
  Asset,
  BASE_FEE,
  Horizon,
  Networks,
  Operation,
  StrKey,
  TransactionBuilder,
} from "@stellar/stellar-sdk";

const server = new Horizon.Server("https://horizon-testnet.stellar.org");

export type PaymentResult = {
  hash: string;
  ledger: number;
};

export function validatePaymentInput(destinationPublicKey: string, amount: string): string | null {
  if (!destinationPublicKey) {
    return "Recipient address is required.";
  }

  if (!StrKey.isValidEd25519PublicKey(destinationPublicKey)) {
    return "Recipient address must be a valid Stellar public key.";
  }

  if (!amount) {
    return "Amount is required.";
  }

  const parsedAmount = Number(amount);

  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    return "Amount must be a positive number.";
  }

  if (parsedAmount < 0.0000001) {
    return "Amount must be at least 0.0000001 XLM.";
  }

  return null;
}

export async function getNativeBalance(publicKey: string): Promise<string> {
  try {
    const account = await server.loadAccount(publicKey);
    const nativeBalance = account.balances.find((balance) => balance.asset_type === "native");

    if (!nativeBalance) {
      return "0";
    }

    return nativeBalance.balance;
  } catch (error) {
    throw new Error(getStellarErrorMessage(error, "Could not load Testnet XLM balance."));
  }
}

export async function buildPaymentTransaction(
  sourcePublicKey: string,
  destinationPublicKey: string,
  amount: string,
): Promise<string> {
  try {
    const account = await server.loadAccount(sourcePublicKey);

    const transaction = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.payment({
          destination: destinationPublicKey,
          asset: Asset.native(),
          amount,
        }),
      )
      .setTimeout(180)
      .build();

    return transaction.toXDR();
  } catch (error) {
    throw new Error(getStellarErrorMessage(error, "Could not build the payment transaction."));
  }
}

export async function submitSignedTransaction(signedTransactionXdr: string): Promise<PaymentResult> {
  try {
    const transaction = TransactionBuilder.fromXDR(signedTransactionXdr, Networks.TESTNET);
    const response = await server.submitTransaction(transaction);

    return {
      hash: response.hash,
      ledger: response.ledger,
    };
  } catch (error) {
    throw new Error(getStellarErrorMessage(error, "Could not submit the transaction to Stellar Testnet."));
  }
}

function getStellarErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "response" in error) {
    const horizonError = error as {
      response?: { data?: { title?: string; detail?: string; extras?: { result_codes?: unknown } } };
    };

    const title = horizonError.response?.data?.title;
    const detail = horizonError.response?.data?.detail;
    const resultCodes = horizonError.response?.data?.extras?.result_codes;

    if (title || detail || resultCodes) {
      return [title, detail, resultCodes ? JSON.stringify(resultCodes) : undefined]
        .filter(Boolean)
        .join(" ");
    }
  }

  return fallback;
}
