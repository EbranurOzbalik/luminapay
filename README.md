# LuminaPay

LuminaPay is a minimal React + TypeScript + Vite dApp demo for Stellar Testnet. It connects to Freighter, displays the connected wallet's Testnet XLM balance, builds a payment transaction, asks Freighter to sign it, and submits the signed transaction through Horizon Testnet.

This project is built for the Stellar Journey to Mastery Level 1 - White Belt submission as a simple payment dApp.

## Features

- Detects whether Freighter is installed.
- Connects and disconnects a Freighter wallet.
- Displays the connected Stellar public key.
- Fetches and refreshes Testnet XLM balance from Horizon.
- Sends Testnet XLM to a recipient address.
- Shows loading, success, and error states.
- Responsive single-page UI.

## White Belt Requirements Coverage

- Wallet setup: Freighter wallet integration on Stellar Testnet.
- Wallet connection: Connect and disconnect wallet flows.
- Balance handling: Fetches and displays the connected wallet's native XLM balance.
- Transaction flow: Sends XLM on Stellar Testnet with Freighter signing.
- Transaction feedback: Shows success or failure state and displays the transaction hash.
- Development standards: React components, service layer, TypeScript types, input validation, and try/catch error handling.

## Tech Stack

- React
- TypeScript
- Vite
- Stellar SDK (`@stellar/stellar-sdk`)
- Freighter API (`@stellar/freighter-api`)
- Lucide React (`lucide-react`)
- Stellar Horizon Testnet

## Setup Instructions

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Freighter Testnet Requirement

Install the Freighter browser extension and switch it to Stellar Testnet before using LuminaPay. The connected account must exist on Testnet and hold Testnet XLM. You can fund a Testnet account with Friendbot from the Stellar Laboratory or other official Stellar Testnet tools.

## Submission Notes

- Project idea: Simple Payment dApp.
- Network: Stellar Testnet.
- Horizon endpoint: `https://horizon-testnet.stellar.org`.
- Repository requirement: publish this project as a public GitHub repository before submitting.

## Screenshots

### Wallet Connected

Placeholder for a connected wallet screenshot.

### Balance Displayed

Placeholder for a balance screenshot.

### Successful Testnet Transaction

Placeholder for a successful payment screenshot.

### Transaction Result

Placeholder for the submitted transaction hash screenshot.
