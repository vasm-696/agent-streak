// DRY-RUN mainnet gas estimate for the AgentStreak deployment.
// Sends NO transaction and needs NO funds: it calls eth_estimateGas against
// live BNB Chain mainnet state using the deployer address as `from`.
// Also estimates a checkIn() call from an address that holds an Agent ID
// (erkleo.ai holder) — estimation only, no transaction is sent.
const fs = require("fs");
const { ethers } = require("hardhat");

const WALLET_FILE = process.env.DEPLOYER_WALLET_FILE || "./deployer-wallet.json";
const AGENT_ID_MAINNET = "0x60b9262456de011f7d15a54cdd8c48baaa8b022f";

async function main() {
  const walletJson = JSON.parse(fs.readFileSync(WALLET_FILE, "utf8"));
  const deployer = new ethers.Wallet(walletJson.privateKey, ethers.provider);
  console.log("Deployer:", deployer.address);

  const feeData = await ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice;
  console.log("Current gas price (gwei):", ethers.formatUnits(gasPrice, "gwei"));

  const Streak = await ethers.getContractFactory("AgentStreak", deployer);
  const deployTx = await Streak.getDeployTransaction(AGENT_ID_MAINNET);
  const deployGas = await ethers.provider.estimateGas({ from: deployer.address, data: deployTx.data });
  const deployCost = deployGas * gasPrice;
  console.log("Deploy gas units:", deployGas.toString());
  console.log("Deploy cost @ current gas price (BNB):", ethers.formatEther(deployCost));
  console.log("Deploy cost @ 3 gwei (BNB):", ethers.formatEther(deployGas * 3000000000n));
  console.log("Deploy cost @ 5 gwei (BNB):", ethers.formatEther(deployGas * 5000000000n));

  // NOTE: checkIn() gas is measured from real transactions instead:
  // local Hardhat test receipts and (once funded) the BSC testnet deploy.
  // No deployed mainnet contract exists yet, so no mainnet estimate is possible here.

  const out = {
    network: "bsc",
    chainId: 56,
    deployGasUnits: deployGas.toString(),
    gasPriceGwei: ethers.formatUnits(gasPrice, "gwei"),
    deployCostBnbAtCurrentGasPrice: ethers.formatEther(deployCost),
    deployCostBnbAt3Gwei: ethers.formatEther(deployGas * 3000000000n),
    deployCostBnbAt5Gwei: ethers.formatEther(deployGas * 5000000000n),
  };
  fs.mkdirSync("./deployments", { recursive: true });
  fs.writeFileSync("./deployments/mainnet-estimate.json", JSON.stringify(out, null, 2));
  console.log("Saved ./deployments/mainnet-estimate.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
