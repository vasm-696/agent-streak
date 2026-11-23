# AgentStreak — Hackathon Submission Draft

> Deployed on BNB Chain mainnet 2026-11-23 (block 135234832). Testnet not deployed.
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
| BNB Chain mainnet (56) | `0xd6132a1340332A16C0130E44743CFAEC04640f70` (deployed 2026-11-23, block 135234832) | https://bscscan.com/address/0xd6132a1340332A16C0130E44743CFAEC04640f70 |
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

- Deploy: 356,755 gas, actual cost **0.00001764 BNB** (gas price ~0.05 gwei at deploy time; ≈ 0.0011 BNB at 3 gwei)
- Check-in: ≈ 140,000 gas first time, ≈ 55,000 gas afterwards
  (≈ 0.0002–0.0004 BNB at 3 gwei)
- Deployer wallet: `0x0a0145605CdB8ffd3D70267dB780D7721B78cF7c`
  (funded 0.00299022 BNB on 2026-11-23; balance after deploy 0.0029725806 BNB)

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
