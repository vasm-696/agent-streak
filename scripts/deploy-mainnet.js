// MAINNET DEPLOY SCRIPT — PREPARED ONLY. DO NOT RUN without the user's
// explicit go-ahead and a funded deployer wallet.
// Deploys AgentStreak on BNB Chain mainnet (chain 56) gated on the REAL
// Agent ID contract 0x60b9262456de011f7d15a54cdd8c48baaa8b022f.
// Reads the deployer key from DEPLOYER_WALLET_FILE (default: ./deployer-wallet.json).
// NEVER prints the private key. After deploy, verify on BscScan with the
// flattened source in flattened/AgentStreak.flattened.sol
// (Solidity 0.8.20, optimizer ON, 200 runs).
const fs = require("fs");
const { ethers } = require("hardhat");

const WALLET_FILE = process.env.DEPLOYER_WALLET_FILE || "./deployer-wallet.json";
const AGENT_ID_MAINNET = "0x60b9262456de011f7d15a54cdd8c48baaa8b022f";
const EXPLORER = "https://bscscan.com";

async function main() {
  const walletJson = JSON.parse(fs.readFileSync(WALLET_FILE, "utf8"));
  const deployer = new ethers.Wallet(walletJson.privateKey, ethers.provider);
  console.log("Deployer:", deployer.address);
  console.log("Network chainId:", (await ethers.provider.getNetwork()).chainId.toString());

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("BNB balance:", ethers.formatEther(balance));
  if (balance < ethers.parseEther("0.002")) {
    console.log("BLOCKED: deployer needs at least ~0.002 BNB (deploy ~0.0011 BNB at 3 gwei; BscScan verification is free/off-chain).");
    process.exit(2);
  }

  const Streak = await ethers.getContractFactory("AgentStreak", deployer);
  const streak = await Streak.deploy(AGENT_ID_MAINNET);
  await streak.waitForDeployment();
  const addr = await streak.getAddress();
  console.log("AgentStreak (mainnet):", addr, EXPLORER + "/address/" + addr);
  console.log("Agent ID gate:", await streak.agentId());
  console.log("NEXT: verify on BscScan with flattened/AgentStreak.flattened.sol");
  console.log("      (Solidity 0.8.20, optimizer ON, 200 runs, no constructor args beyond the Agent ID address above).");

  const out = {
    network: "bsc",
    chainId: 56,
    agentId: AGENT_ID_MAINNET,
    agentStreak: addr,
    deployer: deployer.address,
    explorer: EXPLORER,
  };
  fs.mkdirSync("./deployments", { recursive: true });
  fs.writeFileSync("./deployments/mainnet.json", JSON.stringify(out, null, 2));
  console.log("Saved ./deployments/mainnet.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
