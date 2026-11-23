const { ethers } = require("hardhat");
async function main() {
  const addr = "0xd6132a1340332A16C0130E44743CFAEC04640f70";
  const latest = await ethers.provider.getBlockNumber();
  let lo = 135234700, hi = latest, ans = latest;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const code = await ethers.provider.getCode(addr, mid);
    if (code !== "0x") { ans = mid; hi = mid - 1; } else { lo = mid + 1; }
  }
  console.log("DEPLOY_BLOCK=" + ans);
  console.log("LATEST=" + latest);
  const b = await ethers.provider.getBalance("0x0a0145605CdB8ffd3D70267dB780D7721B78cF7c");
  console.log("DEPLOYER_BALANCE_BNB=" + ethers.formatEther(b));
  const code = await ethers.provider.getCode(addr);
  console.log("CODE_LEN=" + (code.length - 2) / 2 + " bytes");
}
main().catch((e) => { console.error(e.message || e); process.exit(1); });
