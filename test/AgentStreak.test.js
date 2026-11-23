const { expect } = require("chai");
const { ethers, network } = require("hardhat");

const DAY = 24 * 60 * 60;

async function mineNextDay() {
  await network.provider.send("evm_increaseTime", [DAY]);
  await network.provider.send("evm_mine");
}

describe("AgentStreak", function () {
  let mockId, streak, holder, holder2, stranger;

  beforeEach(async function () {
    [holder, holder2, stranger] = await ethers.getSigners();
    const Mock = await ethers.getContractFactory("MockAgentID");
    mockId = await Mock.deploy();
    await mockId.waitForDeployment();
    await mockId.mint(holder.address, 1);
    await mockId.mint(holder2.address, 2);

    const Streak = await ethers.getContractFactory("AgentStreak");
    streak = await Streak.deploy(await mockId.getAddress());
    await streak.waitForDeployment();
  });

  it("rejects a zero Agent ID address in the constructor", async function () {
    const Streak = await ethers.getContractFactory("AgentStreak");
    await expect(Streak.deploy(ethers.ZeroAddress)).to.be.revertedWith(
      "AgentStreak: zero Agent ID address"
    );
  });

  it("lets an Agent ID holder check in once per UTC day", async function () {
    await expect(streak.connect(holder).checkIn())
      .to.emit(streak, "CheckIn")
      .withArgs(holder.address, await streak.today(), 1, 1);
    expect(await streak.streakOf(holder.address)).to.equal(1);
    expect(await streak.totalOf(holder.address)).to.equal(1);
    expect(await streak.totalCheckins()).to.equal(1);
    expect(await streak.hasCheckedInToday(holder.address)).to.equal(true);
    expect(await streak.lastDayOf(holder.address)).to.equal(await streak.today());
  });

  it("rejects a second check-in on the same UTC day", async function () {
    await streak.connect(holder).checkIn();
    await expect(streak.connect(holder).checkIn()).to.be.revertedWithCustomError(
      streak,
      "AlreadyCheckedInToday"
    );
  });

  it("rejects callers who hold no Agent ID", async function () {
    await expect(streak.connect(stranger).checkIn()).to.be.revertedWithCustomError(
      streak,
      "NotAgentIdHolder"
    );
  });

  it("grows the streak on consecutive days", async function () {
    await streak.connect(holder).checkIn();
    await mineNextDay();
    await streak.connect(holder).checkIn();
    expect(await streak.streakOf(holder.address)).to.equal(2);
    expect(await streak.longestStreak(holder.address)).to.equal(2);
    expect(await streak.totalOf(holder.address)).to.equal(2);
  });

  it("resets the streak to 1 after a missed day, keeping the longest streak", async function () {
    await streak.connect(holder).checkIn();
    await mineNextDay();
    await streak.connect(holder).checkIn(); // streak 2
    await mineNextDay();
    await mineNextDay(); // skip a day
    await streak.connect(holder).checkIn();
    expect(await streak.streakOf(holder.address)).to.equal(1);
    expect(await streak.longestStreak(holder.address)).to.equal(2);
    expect(await streak.totalOf(holder.address)).to.equal(3);
  });

  it("tracks holders independently", async function () {
    await streak.connect(holder).checkIn();
    await streak.connect(holder2).checkIn();
    expect(await streak.streakOf(holder.address)).to.equal(1);
    expect(await streak.streakOf(holder2.address)).to.equal(1);
    expect(await streak.totalCheckins()).to.equal(2);
    expect(await streak.hasCheckedInToday(stranger.address)).to.equal(false);
  });
});
