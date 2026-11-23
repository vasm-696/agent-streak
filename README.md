# AgentStreak

Daily check-in for holders of a Binance Agent ID. Hold an Agent ID, check in
once per UTC day, build your streak. Built for the Binance Wallet + BNB Chain
**Agent ID Hackathon** (60,000 USDC prize pool, submission deadline
2026-12-09 16:00 CST).

Live site: https://vasm-696.github.io/agent-streak/

## How Agent ID is used

The `AgentStreak` contract gates its only state-changing function on holding
an Agent ID. It calls `balanceOf(user)` on the SPACE ID Agent ID contract
(`0x60b9262456de011f7d15a54cdd8c48baaa8b022f` on BNB Chain mainnet); a return
value greater than 0 means the caller holds an Agent ID. Non-holders cannot
check in. The contract never looks up wallets by Agent ID name and never
stores or resolves names.

## No owner, no admin powers

The contract has **no owner and no admin functions at all**. There is no
pause, no mint, no freeze, no tax, no withdraw, no upgrade, and no way for
anyone (including the deployer) to change its behaviour or move funds.
`checkIn()` is not payable and the contract never holds user funds. The
Agent ID contract address is immutable, set once in the constructor.

Check-ins are free except for BNB network gas. Points and streaks have **no
monetary value** — there is no token, no yield and no promised return.

## Contracts

| Network | AgentStreak | Agent ID gate |
| --- | --- | --- |
| BNB Chain mainnet (56) | _to be deployed_ | `0x60b9262456de011f7d15a54cdd8c48baaa8b022f` |
| BSC testnet (97) | _pending testnet BNB for the deployer_ | mock `MockAgentID` (test only, never on mainnet) |

## Verify on BscScan

- Source: `flattened/AgentStreak.flattened.sol`
- Compiler: Solidity **0.8.20**, optimizer **ON, 200 runs**, EVM target Paris.
- Constructor argument: the Agent ID contract address (ABI-encoded `address`).
- The full standard-JSON input is in `artifacts/build-info/` after compiling.

## Run locally

```bash
npm install
npx hardhat compile
npx hardhat test          # 7 tests: check-in, streaks, duplicate-day + non-holder reverts
npx hardhat run scripts/measure-gas.js
```

Testnet deploy (needs ~0.1 tBNB on the deployer — claim at
https://testnet.bnbchain.org/faucet-smart):

```bash
npx hardhat run scripts/deploy-testnet.js --network bscTestnet
```

Mainnet deploy (prepared, NOT run yet — see `scripts/deploy-mainnet.js`):

```bash
npx hardhat run scripts/deploy-mainnet.js --network bsc
```

Dry-run mainnet gas estimate (sends no transaction, needs no funds):

```bash
npx hardhat run scripts/estimate-mainnet.js --network bsc
```

Measured: deploy ≈ 356,755 gas (≈ 0.0011 BNB at 3 gwei); check-in ≈
140,000 gas first time, ≈ 55,000 gas afterwards.

## Hackathon safety red lines — compliance

- No web QR-code / pairing-code login anywhere. The site uses injected
  wallets (MetaMask / Binance Wallet extension); Agentic Wallet users open
  it in the Binance App browser.
- No prompts or code that bypass user transaction confirmation; no
  unauthorized transfers; no hidden extra transfers; no unlimited approvals.
- Contract open-source, owner permissions disclosed (there are none).
- No "Binance" or "BNB" in the project name, token name or domain.
- No promised returns: no "passive income", no "earn money", no yield.
- Agent ID is not packaged as a wallet-lookup-by-name tool.
- No trading in the product.

## Disclaimer

AgentStreak is an independent hackathon entry. It is not affiliated with,
endorsed by, or connected to Binance or BNB Chain.
