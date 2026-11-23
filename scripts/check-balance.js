const fs = require("fs");
const { ethers } = require("hardhat");
async function main() {
  const walletJson = JSON.parse(fs.readFileSync("./deployer-wallet.json", "utf8"));
  const b = await ethers.provider.getBalance(walletJson.address);
  console.log("DEPLOYER=" + walletJson.address);
  console.log("BALANCE_BNB=" + ethers.formatEther(b));
  console.log("BLOCK=" + (await ethers.provider.getBlockNumber()));
}
main().catch((e) => { console.error(e.message || e); process.exit(1); });
