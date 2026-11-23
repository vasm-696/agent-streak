// Testnet deploy (BSC testnet, chain 97) for AgentStreak.
// Deploys MockAgentID, mints one mock Agent ID to the deployer, deploys
// AgentStreak gated on the mock, then performs one live check-in.
// Reads the deployer key from DEPLOYER_WALLET_FILE (default: ./deployer-wallet.json).
// NEVER prints the private key. Requires tBNB on the deployer address:
//   https://testnet.bnbchain.org/faucet-smart (browser + captcha, ~0.1 tBNB)
// If the balance is too low the script exits cleanly with instructions.
const fs = require("fs");
const { ethers } = require("hardhat");

const WALLET_FILE = process.env.DEPLOYER_WALLET_FILE || "./deployer-wallet.json";
const EXPLORER = "https://testnet.bscscan.com";

async function main() {
  const walletJson = JSON.parse(fs.readFileSync(WALLET_FILE, "utf8"));
  const deployer = new ethers.Wallet(walletJson.privateKey, ethers.provider);
  console.log("Deployer:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("tBNB balance:", ethers.formatEther(balance));
  if (balance < ethers.parseEther("0.01")) {
    console.log("BLOCKED: deployer needs tBNB. Claim 0.1 tBNB at");
    console.log("  https://testnet.bnbchain.org/faucet-smart");
    console.log("for address " + deployer.address + " then re-run this script.");
    process.exit(2);
  }

  const Mock = await ethers.getContractFactory("MockAgentID", deployer);
  const mock = await Mock.deploy();
  await mock.waitForDeployment();
  const mockAddr = await mock.getAddress();
  console.log("MockAgentID:", mockAddr, EXPLORER + "/address/" + mockAddr);

  const mintTx = await mock.mint(deployer.address, 1);
  await mintTx.wait();
  console.log("Minted mock Agent ID #1 to deployer, tx:", mintTx.hash);

  const Streak = await ethers.getContractFactory("AgentStreak", deployer);
  const streak = await Streak.deploy(mockAddr);
  await streak.waitForDeployment();
  const streakAddr = await streak.getAddress();
  console.log("AgentStreak:", streakAddr, EXPLORER + "/address/" + streakAddr);

  const checkTx = await streak.checkIn();
  const receipt = await checkTx.wait();
  console.log("checkIn tx:", checkTx.hash, "gas used:", receipt.gasUsed.toString());
  console.log("streak:", (await streak.streakOf(deployer.address)).toString());
  console.log("total:", (await streak.totalOf(deployer.address)).toString());

  const out = {
    network: "bscTestnet",
    chainId: 97,
    mockAgentId: mockAddr,
    agentStreak: streakAddr,
    deployer: deployer.address,
    checkInTx: checkTx.hash,
    explorer: EXPLORER,
  };
  fs.mkdirSync("./deployments", { recursive: true });
  fs.writeFileSync("./deployments/testnet.json", JSON.stringify(out, null, 2));
  console.log("Saved ./deployments/testnet.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
