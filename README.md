<div align="center">
  <br />
  <img src="https://raw.githubusercontent.com/your-username/onyx-protocol/main/assets/onyx-logo.svg" alt="Onyx Protocol Logo" width="200"/>
  <h1>⚫️ ONYX PROTOCOL</h1>
  <p><strong>A Rebase-Stablecoin Protocol with 200% Over-Collateralization</strong></p>
  <p>
    <a href="https://opensource.org/licenses/MIT">
      <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"/>
    </a>
    <a href="https://soliditylang.org/">
      <img src="https://img.shields.io/badge/Solidity-^0.8.0-blue" alt="Solidity"/>
    </a>
    <a href="https://hardhat.org/">
      <img src="https://img.shields.io/badge/Built%20with-Hardhat-FFDB1C" alt="Hardhat"/>
    </a>
    <a href="https://github.com/your-username/onyx-protocol/actions">
      <img src="https://img.shields.io/github/actions/workflow/status/your-username/onyx-protocol/test.yml?branch=main" alt="Tests"/>
    </a>
  </p>
  <br />
</div>

---

## 📋 Table of Contents
- [Overview](#-overview)
- [How It Works](#-how-it-works)
  - [Minting (Borrowing)](#1-minting-borrowing)
  - [Rebase Mechanism](#2-rebase-mechanism)
  - [Health Factor](#3-health-factor)
  - [Liquidations](#4-liquidations)
- [Architecture](#️-architecture)
- [Getting Started](#-getting-started)
- [Security](#-security)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🌌 Overview

**Onyx Protocol** is a decentralized stablecoin protocol that combines the security of **over-collateralization** with the flexibility of a **rebase mechanism**. Users can mint the Onyx stablecoin (pegged to 1 USD) by depositing collateral at a **minimum 200% ratio**, ensuring the system remains robust against market volatility.

### ✨ Key Features
- **Dual Stability Mechanism**: 200% collateral buffer + automatic supply rebasing
- **Fully Collateralized**: Every Onyx token is backed by at least $2 worth of collateral
- **Rebase-Enabled**: Supply adjusts automatically to maintain the $1 peg
- **Decentralized Liquidations**: Anyone can liquidate underwater positions and earn a bonus
- **ERC-20 Compatible**: Use Onyx tokens anywhere in the DeFi ecosystem

---

## 🚀 How It Works

### 1. Minting (Borrowing)
Users open a **Vault** by depositing accepted collateral (ETH, WBTC, etc.). The amount of Onyx they can mint is determined by their collateral value:
Maximum Mintable = Collateral Value (USD) / 2

This ensures a **minimum 200% collateral ratio** at all times.

```solidity
// Example: User deposits $10,000 worth of ETH
// They can mint up to $5,000 worth of Onyx tokens
```
2. Rebase Mechanism

Onyx maintains its $1 peg through an elastic supply mechanism. If the market price deviates from $1:
Price Deviation	Rebase Action	Effect on Holders
Price > $1	Positive Rebase (Supply ↑)	Balance increases
Price < $1	Negative Rebase (Supply ↓)	Balance decreases

The rebase happens daily (or based on oracle triggers) and affects all holders proportionally - no dilution occurs.

3. Health Factor

Each vault has a Health Factor that determines its safety:
Health Factor = (Collateral Value / Minted Onyx Value) × 100

Status	Health Factor	Action Required
🟢 Safe	> 200%	No action needed
🟡 Warning	150% - 200%	Monitor position
🔴 Liquidation Zone	< 150%	Add collateral or repay debt

When a vault's Health Factor drops below 150%, it becomes eligible for liquidation. Here's how the process works:
<div align="center"> <img src="https://raw.githubusercontent.com/your-username/onyx-protocol/main/assets/liquidation-flow.png" alt="Liquidation Flow" width="600"/> </div>
🎯 Be Your Own Liquidator

Anyone can liquidate underwater positions - including the original borrower! The process is simple:

    Identify an unhealthy vault from the public list

    Repay the vault's debt using Onyx tokens

    Receive the collateral plus a liquidation bonus (typically 5-10%)

This creates a profitable arbitrage opportunity while keeping the protocol solvent.

Architecture:

┌─────────────────────────────────────────────────────────────┐
│                        Frontend (dApp)                       │
│                      React + Web3.js                         │
└─────────────────────────────┬───────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                     Smart Contracts Layer                     │
├───────────────────┬───────────────────┬─────────────────────┤
│  VaultManager.sol │   OnyxToken.sol   │ LiquidationEngine.sol│
│  - Open/close     │  - ERC20          │  - Process           │
│    vaults         │  - Rebase logic   │    liquidations      │
│  - Mint/burn      │  - Balance        │  - Calculate         │
│  - Track health   │    tracking       │    bonuses           │
├───────────────────┴───────────────────┴─────────────────────┤
│                     Oracle.sol                               │
│                  (Chainlink integration)                     │
└─────────────────────────────────────────────────────────────┘

📦 Core Smart Contracts
Contract	Description
VaultManager.sol	Handles vault creation, collateral deposits/withdrawals, and minting/burning of Onyx
OnyxToken.sol	The rebase-enabled ERC20 token that maintains the $1 peg
LiquidationEngine.sol	Manages the liquidation process and reward distribution
Oracle.sol	Provides real-time price feeds for collateral assets (Chainlink integration)

🛠️ Getting Started
Prerequisites

    Node.js (v16 or higher)

    npm or yarn

    MetaMask (for frontend interaction)
  Installation
bash

# Clone the repository
git clone https://github.com/your-username/onyx-protocol.git

# Navigate to project directory
cd onyx-protocol

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your configuration

Testing
bash

# Run all tests
npx hardhat test

# Run tests with gas reporting
REPORT_GAS=true npx hardhat test

# Run test coverage
npx hardhat coverage

Deployment
bash

# Deploy to local network
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost

# Deploy to testnet (Sepolia)
npx hardhat run scripts/deploy.js --network sepolia

# Deploy to mainnet
npx hardhat run scripts/deploy.js --network mainnet

🔒 Security

    ⚠️ IMPORTANT: This is a pet project developed for educational purposes. It has NOT been audited for production use.

Known Risks

    Smart Contract Risk: Undiscovered bugs could lead to loss of funds

    Oracle Risk: Manipulated or stale price feeds could trigger false liquidations

    Liquidation Risk: In volatile markets, positions may be liquidated before users can react

    Rebase Risk: Negative rebases may surprise unprepared users

Best Practices

    Always test on testnets first

    Start with small positions

    Monitor your Health Factor regularly

    Keep extra collateral as a buffer

🗺️ Roadmap

    ✅ Core smart contract architecture

    ✅ Basic vault and liquidation logic

    🔄 Advanced testing suite (fuzzing, invariants)

    🔄 Frontend dApp (React + ethers.js)

    🔄 Subgraph for analytics (The Graph)

    🔄 Testnet deployment

    🔄 Community feedback & iteration

    🔄 Potential audit preparation

🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

    Fork the Project

    Create your Feature Branch (git checkout -b feature/AmazingFeature)

    Commit your Changes (git commit -m 'Add some AmazingFeature')

    Push to the Branch (git push origin feature/AmazingFeature)

    Open a Pull Request

Development Guidelines

    Follow Solidity best practices and style guides

    Write comprehensive tests for new features

    Update documentation as needed

    Use meaningful commit messages

📄 License

Distributed under the MIT License. See LICENSE for more information.
📬 Contact

Project Maintainer - [Your Name]

    GitHub: @your-username

    Twitter: @your-twitter

    Email: your.email@example.com

    Discord: Join our community (optional)

Project Link: https://github.com/your-username/onyx-protocol
<div align="center"> <sub>Built with ❤️ for the DeFi community</sub> <br /> <sub>© 2024 Onyx Protocol. All rights reserved.</sub> </div> ```