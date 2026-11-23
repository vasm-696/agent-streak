// Local gas measurement (Hardhat network, no real funds): deploys MockAgentID
// + AgentStreak, performs check-ins and prints gas used per call.
const { ethers } = require("hardhat");

async function main() {
  const [holder] = await ethers.getSigners();
  const Mock = await ethers.getContractFactory("MockAgentID");
  const mock = await Mock.deploy();
  await mock.waitForDeployment();
  await (await mock.mint(holder.address, 1)).wait();

  const Streak = await ethers.getContractFactory("AgentStreak");
  const streak = await Streak.deploy(await mock.getAddress());
  await streak.waitForDeployment();

  const deployReceipt = await ethers.provider.getTransactionReceipt(
    (await streak.deploymentTransaction()).hash
  );
  console.log("AgentStreak deploy gas:", deployReceipt.gasUsed.toString());

  const tx1 = await streak.checkIn();
  const r1 = await tx1.wait();
  console.log("checkIn #1 (new streak) gas:", r1.gasUsed.toString());

  // second day, streak grows
  await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]);
  await ethers.provider.send("evm_mine");
  const tx2 = await streak.checkIn();
  const r2 = await tx2.wait();
  console.log("checkIn #2 (streak continues) gas:", r2.gasUsed.toString());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
