# AgentStreak — Hackathon Submission Draft

> DRAFT — contract addresses for mainnet to be filled after deployment.
> Submission form (needs Binance login; the user submits it):
> https://www.binance.com/en/survey/fb26d2bd25e04329b1ba77c7b3811d23

## Project

- **Name:** AgentStreak
- **Website:** https://vasm-696.github.io/agent-streak/
- **Repo:** https://github.com/vasm-696/agent-streak
- **Category:** Agent Application Innovation Award (also eligible for the
  Ecosystem Pioneer Award by on-chain activity)

## Contracts

| Network | AgentStreak address | BscScan |
| --- | --- | --- |
| BNB Chain mainnet (56) | _TBD — deploy pending_ | _TBD_ |
| BSC testnet (97) | _TBD — deployer needs tBNB_ | _TBD_ |

- Agent ID gate (mainnet): `0x60b9262456de011f7d15a54cdd8c48baaa8b022f`
  (SPACE ID Agent ID, ERC-721, non-transferable)
- Verification: flattened source `flattened/AgentStreak.flattened.sol`,
  Solidity 0.8.20, optimizer ON, 200 runs. Standard-JSON input in
  `artifacts/build-info/` after compiling.

## How Agent ID is used

AgentStreak is a daily check-in dApp gated on holding an Agent ID. The
contract's only state-changing function, `checkIn()`, requires
`balanceOf(caller) > 0` on the Agent ID contract. Holders check in at most
once per UTC day; consecutive days grow a streak, a missed day resets it to
1. The frontend shows holder status, today's check-in state, streak/total,
and a leaderboard built from on-chain `CheckIn` events. No token, no fee,
no custody, no yield — points and streaks have no monetary value.

## Reward receiving address (TO BE CONFIRMED BY THE USER)

`0x301d7b7d802779d292b453a6d4468758efb97045` — holder address of the
erkleo.ai Agent ID (Agentic Wallet, BSC). Confirm with the user before
submitting; do not change without confirmation.

## Deployment cost (measured)

- Deploy: 356,755 gas ≈ **0.0011 BNB at 3 gwei** (≈ 0.0018 BNB at 5 gwei)
- Check-in: ≈ 140,000 gas first time, ≈ 55,000 gas afterwards
  (≈ 0.0002–0.0004 BNB at 3 gwei)
- Deployer wallet: `0x0a0145605CdB8ffd3D70267dB780D7721B78cF7c`
  (needs ~0.003 BNB for deploy + buffer)

## Safety red-line checklist

- [x] No web QR-code / pairing-code login; injected wallets only; Agentic
      Wallet users open the site in the Binance App browser.
- [x] No bypass of user transaction confirmation; no unauthorized transfers;
      no hidden extra transfers; no unlimited approvals.
- [x] Contract open-source; owner permissions disclosed — there are none
      (no owner, no pause, no mint, no freeze, no tax, no withdraw).
- [x] No "Binance"/"BNB" in project name, token name or domain.
- [x] No promised returns ("passive income" / "earn money" never used).
- [x] Agent ID is not packaged as a wallet-lookup-by-name tool.
- [x] No trading in the product.
